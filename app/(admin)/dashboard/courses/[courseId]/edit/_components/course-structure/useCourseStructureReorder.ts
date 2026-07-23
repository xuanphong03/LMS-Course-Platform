import { reorderChapters, reorderLessons } from '@/app/(admin)/dashboard/courses/[courseId]/edit/actions'
import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'
import type { CourseStructureItem } from './course-structure.types'
import { useCallback, useEffect, useRef, useTransition } from 'react'
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
    const [isReordering, startTransition] = useTransition()

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

    const persistOrder = useCallback(
        (request: ReorderRequest) => {
            // Không await hàm này trong onDragEnd. Transition bắt đầu action nhưng trả
            // quyền điều khiển ngay để dnd-kit hoàn tất drop animation trước network.
            startTransition(async () => {
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

                await reorderPromise.catch(() => undefined)

                // Thành công: action response đã mang theo RSC snapshot mới.
                // Thất bại: serverItems vẫn là snapshot cũ. Bỏ draft xử lý cả hai.
                resetOptimisticItems()
            })
        },
        [resetOptimisticItems, startTransition],
    )

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
        isReordering,
    }
}
