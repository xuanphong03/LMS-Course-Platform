import { reorderChapters, reorderLessons } from '@/app/(admin)/dashboard/courses/[courseId]/edit/actions'
import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'
import type { CourseStructureItem } from './course-structure.types'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

type ReorderRequest =
    | {
          type: 'lessons'
          payload: Parameters<typeof reorderLessons>[0]
      }
    | {
          type: 'chapters'
          payload: Parameters<typeof reorderChapters>[0]
      }

interface UseCourseStructureReorderProps {
    courseId: string
    items: CourseStructureItem[]
    serverItems: CourseStructureItem[]
    setDraftItems: Dispatch<SetStateAction<CourseStructureItem[] | null>>
}

/**
 * Quản lý draft DnD và việc lưu thứ tự lên server.
 *
 * `serverItems` luôn là nguồn dữ liệu đã được server xác nhận. Draft chỉ che nguồn
 * này trong lúc kéo hoặc chờ persistence; khi request kết thúc, xóa draft sẽ tự động
 * hiển thị RSC snapshot mới mà không cần sao chép props vào state bằng effect.
 */
export function useCourseStructureReorder({
    courseId,
    items,
    serverItems,
    setDraftItems,
}: UseCourseStructureReorderProps) {
    const latestItemsRef = useRef(items)
    const serverItemsRef = useRef(serverItems)
    const [queuedRequest, setQueuedRequest] = useState<ReorderRequest | null>(null)
    const [isPersisting, startTransition] = useTransition()

    // Cập nhật ref cùng draft để event kế tiếp không phải chờ effect mới thấy order mới.
    const setOptimisticItems = useCallback(
        (action: SetStateAction<CourseStructureItem[]>) => {
            setDraftItems((currentDraft) => {
                const currentItems = currentDraft ?? serverItemsRef.current
                const nextItems = typeof action === 'function' ? action(currentItems) : action

                latestItemsRef.current = nextItems
                return nextItems
            })
        },
        [setDraftItems],
    )

    const resetOptimisticItems = useCallback(() => {
        latestItemsRef.current = serverItemsRef.current
        setDraftItems(null)
    }, [setDraftItems])

    useEffect(() => {
        serverItemsRef.current = serverItems
        latestItemsRef.current = items
    }, [items, serverItems])

    const persistOrder = useCallback((request: ReorderRequest) => {
        // Chỉ xếp request trong event drop. dnd-kit tự chạy onDragEnd trong một
        // transition; gọi Server Action ngay tại đây sẽ khiến lifecycle drop có thể
        // bị React gộp với transition mạng và phải chờ request hoàn tất.
        setQueuedRequest(request)
    }, [])

    useEffect(() => {
        if (!queuedRequest) return

        // Effect chạy sau khi optimistic draft đã commit và dnd-kit đã giải phóng
        // drop lifecycle. Từ thời điểm này, transition chỉ phục vụ persistence.
        startTransition(async () => {
            try {
                const actionPromise =
                    queuedRequest.type === 'lessons'
                        ? reorderLessons(queuedRequest.payload)
                        : reorderChapters(queuedRequest.payload)
                const reorderPromise = actionPromise.then((result) => {
                    if (result.status === 'error') throw new Error(result.message)
                    return result.message
                })

                toast.promise(reorderPromise, {
                    loading: queuedRequest.type === 'lessons' ? 'Reordering lessons' : 'Reordering chapters',
                    success: (message) => message,
                    error: (error) => (error instanceof Error ? error.message : 'Failed to save the new order'),
                })

                await reorderPromise.catch(() => undefined)
            } finally {
                // Thành công: action response đã mang theo RSC snapshot mới.
                // Thất bại: serverItems vẫn là snapshot cũ. Bỏ draft xử lý cả hai
                // và luôn mở khóa drag, kể cả khi integration ném lỗi ngoài dự kiến.
                resetOptimisticItems()
                setQueuedRequest(null)
            }
        })
    }, [queuedRequest, resetOptimisticItems])

    const persistLessonOrder = useCallback(
        (lessons: ReorderLessonInput[]) => {
            persistOrder({
                type: 'lessons',
                payload: { courseId, lessons },
            })
        },
        [courseId, persistOrder],
    )

    const persistChapterOrder = useCallback(
        (chapters: ReorderChapterInput[]) => {
            persistOrder({
                type: 'chapters',
                payload: { courseId, chapters },
            })
        },
        [courseId, persistOrder],
    )

    return {
        latestItemsRef,
        setOptimisticItems,
        resetOptimisticItems,
        persistLessonOrder,
        persistChapterOrder,
        isReordering: queuedRequest !== null || isPersisting,
    }
}
