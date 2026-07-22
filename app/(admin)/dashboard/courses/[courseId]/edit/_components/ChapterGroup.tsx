'use client'
import type { CourseStructureItem } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.types'
import { CourseStructureChapter } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/CourseStructureChapter'
import {
    getChapterOrder,
    getLessonGroupId,
    getLessonOrder,
    hasLessonOrderChanged,
} from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.utils'
import { useCourseStructureReorder } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/useCourseStructureReorder'
import { move } from '@dnd-kit/helpers'
import { AutoScroller } from '@dnd-kit/dom'
import { DragDropProvider, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'

interface ChapterGroupProps {
    courseId: string
    items: CourseStructureItem[]
    setItems: Dispatch<SetStateAction<CourseStructureItem[]>>
}

export default function ChapterGroup({ courseId, items, setItems }: ChapterGroupProps) {
    const itemsSnapshot = useRef(items)
    const { latestItemsRef, setOptimisticItems, enqueueLessonOrder, enqueueChapterOrder, isReordering } =
        useCourseStructureReorder({
            courseId,
            items,
            setItems,
        })

    const handleToggleChapter = (chapterId: string) => {
        setOptimisticItems((currentItems) =>
            currentItems.map((chapter) =>
                chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter,
            ),
        )
    }

    const handleDragStart = (event: DragStartEvent) => {
        // Lưu trạng thái trước khi kéo để có thể khôi phục nếu người dùng hủy thao tác.
        // Lỗi server dùng baseline trong hook vì snapshot có thể chứa optimistic state cũ.
        if (event.operation.source) {
            itemsSnapshot.current = latestItemsRef.current
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        // Chapter chỉ được chốt thứ tự khi thả; riêng lesson phải cập nhật trạng thái
        // ngay khi đi qua danh sách khác để React luôn đồng bộ với DOM của dnd-kit.
        if (event.operation.source?.type !== 'lesson') return

        setOptimisticItems((currentItems) => {
            // Chuyển cấu trúc chapter lồng nhau thành Record<groupId, lessons>
            // để hàm move xử lý thống nhất cả đổi thứ tự và chuyển khác chapter.
            const currentLessonGroups = Object.fromEntries(
                currentItems.map((chapter) => [getLessonGroupId(chapter.id), chapter.lessons]),
            )
            const nextLessonGroups = move(currentLessonGroups, event)

            // move trả lại cùng tham chiếu khi vị trí không đổi; bỏ qua lần kết xuất thừa.
            if (nextLessonGroups === currentLessonGroups) return currentItems

            // Đưa kết quả về cấu trúc state ban đầu. Array index là nguồn thứ tự duy nhất,
            // vì vậy không lưu thêm trường order có thể bị lệch với vị trí thực tế.
            const nextItems = currentItems.map((chapter) => ({
                ...chapter,
                lessons: nextLessonGroups[getLessonGroupId(chapter.id)],
            }))

            return nextItems
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { source } = event.operation

        // Lesson đã được cập nhật trong onDragOver nên khi hủy phải khôi phục
        // bản chụp trạng thái; dnd-kit tự hoàn tác phần hiển thị lạc quan của chapter.
        if (event.canceled) {
            if (source?.type === 'lesson') {
                setOptimisticItems(itemsSnapshot.current)
            }

            return
        }

        if (!isSortable(source)) return

        if (source.type === 'lesson') {
            // Tạo dữ liệu gửi từ trạng thái cuối cùng sau khi thả. Mỗi lesson cần cả
            // chapterId và position để server hỗ trợ di chuyển khác chapter.
            const currentLessons = getLessonOrder(latestItemsRef.current)
            const hasChanged = hasLessonOrderChanged(currentLessons, itemsSnapshot.current)

            // Không gọi Server Action nếu lesson được thả lại vị trí ban đầu.
            if (!hasChanged) return

            // Chỉ xếp yêu cầu lưu tại đây. Effect sẽ gọi Server Action sau khi React
            // commit trạng thái thả, tránh giữ lifecycle drop chờ network hoàn tất.
            enqueueLessonOrder(currentLessons)

            return
        }

        const { initialIndex, index } = source

        if (source.type === 'chapter') {
            // Chapter là một danh sách phẳng nên chỉ cần cập nhật trạng thái khi thả,
            // thay vì kết xuất lại liên tục trong onDragOver như lesson.
            if (initialIndex === index) return

            const nextItems = [...latestItemsRef.current]
            const [movedChapter] = nextItems.splice(initialIndex, 1)

            if (!movedChapter) return

            nextItems.splice(index, 0, movedChapter)

            const reorderedItems = nextItems
            const chapters = getChapterOrder(reorderedItems)

            setOptimisticItems(reorderedItems)

            // Tách việc lưu khỏi onDragEnd để giao diện hoàn tất drop trước khi action
            // và revalidation bắt đầu chạy.
            enqueueChapterOrder(chapters)

            return
        }
    }

    return (
        <DragDropProvider
            // Mở rộng vùng kích hoạt cuộn ở mép trên/dưới để kéo item qua danh sách
            // dài dễ hơn; tắt tự động cuộn ngang vì chỉ sắp xếp theo chiều dọc.
            plugins={(defaults) => [
                ...defaults,
                AutoScroller.configure({
                    acceleration: 20,
                    threshold: { x: 0, y: 0.25 },
                }),
            ]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {items.map((chapter, index) => (
                <CourseStructureChapter
                    key={chapter.id}
                    courseId={courseId}
                    chapter={chapter}
                    index={index}
                    isDragDisabled={isReordering}
                    onToggle={handleToggleChapter}
                />
            ))}
        </DragDropProvider>
    )
}
