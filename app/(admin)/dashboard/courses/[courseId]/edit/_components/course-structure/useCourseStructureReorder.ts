'use client'

import { reorderChapters, reorderLessons } from '@/app/(admin)/dashboard/courses/[courseId]/edit/actions'
import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'
import { getChapterOrder, getLessonOrder, restoreChapterOrder, restoreLessonOrder } from './course-structure.utils'
import type { CourseStructureItem } from './course-structure.types'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

type ReorderType = 'lessons' | 'chapters'

type ReorderRequest =
    | {
          sequence: number
          revision: number
          type: 'lessons'
          payload: Parameters<typeof reorderLessons>[0]
      }
    | {
          sequence: number
          revision: number
          type: 'chapters'
          payload: Parameters<typeof reorderChapters>[0]
      }

type EnqueueReorderRequest =
    | Omit<Extract<ReorderRequest, { type: 'lessons' }>, 'sequence' | 'revision'>
    | Omit<Extract<ReorderRequest, { type: 'chapters' }>, 'sequence' | 'revision'>

interface UseCourseStructureReorderProps {
    courseId: string
    items: CourseStructureItem[]
    setItems: Dispatch<SetStateAction<CourseStructureItem[]>>
}

/**
 * Quản lý toàn bộ việc đồng bộ optimistic order với server.
 *
 * Hook tách persistence khỏi component DnD để `ChapterGroup` chỉ cần quan tâm đến
 * drag lifecycle. Hàng đợi chỉ giữ request mới nhất của mỗi loại, còn baseline chỉ
 * tiến lên sau khi server xác nhận thành công.
 */
export function useCourseStructureReorder({ courseId, items, setItems }: UseCourseStructureReorderProps) {
    const latestItemsRef = useRef(items)
    const requestSequenceRef = useRef(0)
    const latestRevisionsRef = useRef<Record<ReorderType, number>>({ chapters: 0, lessons: 0 })
    const confirmedOrdersRef = useRef({
        chapters: getChapterOrder(items),
        lessons: getLessonOrder(items),
    })
    const pendingRequestsRef = useRef<Partial<Record<ReorderType, ReorderRequest>>>({})
    const isPersistingRef = useRef(false)
    const [queueSignal, signalQueue] = useState(0)
    const [isReordering, setIsReordering] = useState(false)
    const [, startTransition] = useTransition()

    /**
     * Mọi optimistic update đi qua hàm này để state React và ref dùng trong event
     * handler luôn trỏ đến cùng một phiên bản, kể cả trước khi effect chạy.
     */
    const setOptimisticItems = useCallback(
        (action: SetStateAction<CourseStructureItem[]>) => {
            setItems((currentItems) => {
                const nextItems = typeof action === 'function' ? action(currentItems) : action

                latestItemsRef.current = nextItems
                return nextItems
            })
        },
        [setItems],
    )

    const enqueueReorder = useCallback((request: EnqueueReorderRequest) => {
        const revision = ++latestRevisionsRef.current[request.type]
        const sequence = ++requestSequenceRef.current

        // Thay request chưa gửi cùng loại bằng trạng thái mới nhất. Server chỉ cần
        // nhận full snapshot cuối cùng, không cần ghi từng bước kéo trung gian.
        if (request.type === 'lessons') {
            pendingRequestsRef.current.lessons = { ...request, revision, sequence }
        } else {
            pendingRequestsRef.current.chapters = { ...request, revision, sequence }
        }

        signalQueue((currentSignal) => currentSignal + 1)
    }, [])

    const enqueueLessonOrder = useCallback(
        (lessons: ReorderLessonInput[]) => {
            enqueueReorder({
                type: 'lessons',
                payload: { courseId, lessons },
            })
        },
        [courseId, enqueueReorder],
    )

    const enqueueChapterOrder = useCallback(
        (chapters: ReorderChapterInput[]) => {
            enqueueReorder({
                type: 'chapters',
                payload: { courseId, chapters },
            })
        },
        [courseId, enqueueReorder],
    )

    useEffect(() => {
        latestItemsRef.current = items
    }, [items])

    useEffect(() => {
        // Next.js dispatch Server Action tuần tự; khóa cục bộ này giúp hàng đợi của UI
        // cũng tuần tự và cho phép gộp các request phát sinh trong lúc đang lưu.
        if (isPersistingRef.current) return

        const request = [pendingRequestsRef.current.chapters, pendingRequestsRef.current.lessons]
            .filter((pendingRequest): pendingRequest is ReorderRequest => Boolean(pendingRequest))
            .sort((left, right) => left.sequence - right.sequence)[0]

        if (!request) return

        delete pendingRequestsRef.current[request.type]
        isPersistingRef.current = true

        // Chỉ khóa thao tác kéo khi request thực sự bắt đầu. Effect chạy sau commit nên
        // việc disable không can thiệp vào drop animation vừa hoàn tất của dnd-kit.
        setIsReordering(true)

        // Gọi Server Action sau commit trong một transition riêng để network/revalidation
        // không giữ lifecycle drop của dnd-kit tại vị trí con trỏ.
        startTransition(() => {
            const actionPromise =
                request.type === 'lessons' ? reorderLessons(request.payload) : reorderChapters(request.payload)
            const reorderPromise = actionPromise.then((result) => {
                if (result.status === 'error') throw new Error(result.message)
                return result.message
            })

            toast.promise(reorderPromise, {
                loading: request.type === 'lessons' ? 'Reordering lessons' : 'Reordering chapters',
                success: (message) => message,
                error: (error) => (error instanceof Error ? error.message : 'Failed to save the new order'),
            })

            void reorderPromise
                .then(
                    () => {
                        // Baseline chỉ tiến lên khi server xác nhận request tương ứng.
                        if (request.type === 'lessons') {
                            confirmedOrdersRef.current.lessons = request.payload.lessons
                        } else {
                            confirmedOrdersRef.current.chapters = request.payload.chapters
                        }
                    },
                    () => {
                        // Nếu có revision mới hơn cùng loại, payload mới sẽ quyết định
                        // kết quả cuối; rollback ở đây sẽ làm UI nhảy về trạng thái cũ.
                        if (latestRevisionsRef.current[request.type] !== request.revision) return

                        setOptimisticItems((currentItems) =>
                            request.type === 'lessons'
                                ? restoreLessonOrder(currentItems, confirmedOrdersRef.current.lessons)
                                : restoreChapterOrder(currentItems, confirmedOrdersRef.current.chapters),
                        )
                    },
                )
                .finally(() => {
                    isPersistingRef.current = false

                    // Giữ khóa nếu hàng đợi vẫn còn request; tránh một frame có thể kéo
                    // lại giữa hai lần gọi Server Action liên tiếp.
                    const hasPendingRequest = Boolean(
                        pendingRequestsRef.current.chapters || pendingRequestsRef.current.lessons,
                    )
                    if (!hasPendingRequest) {
                        setIsReordering(false)
                    }

                    signalQueue((currentSignal) => currentSignal + 1)
                })
        })
    }, [queueSignal, setOptimisticItems, startTransition])

    return {
        latestItemsRef,
        setOptimisticItems,
        enqueueLessonOrder,
        enqueueChapterOrder,
        isReordering,
    }
}
