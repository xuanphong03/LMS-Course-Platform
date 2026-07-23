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
import { useRef, useState } from 'react'

interface ChapterGroupProps {
    courseId: string
    serverItems: CourseStructureItem[]
}

/**
 * Client boundary được giới hạn tại đây vì dnd-kit và optimistic draft cần browser
 * state. Ngoài một vòng drag/persist, serverItems luôn là nguồn dữ liệu chính xác.
 */
export default function ChapterGroup({ courseId, serverItems }: ChapterGroupProps) {
    const [draftItems, setDraftItems] = useState<CourseStructureItem[] | null>(null)
    const [closedChapters, setClosedChapters] = useState<Record<string, boolean>>({})
    const items = draftItems ?? serverItems
    const itemsSnapshot = useRef(items)
    const {
        latestItemsRef,
        setOptimisticItems,
        resetOptimisticItems,
        persistLessonOrder,
        persistChapterOrder,
        isReordering,
    } = useCourseStructureReorder({
        courseId,
        items,
        serverItems,
        setDraftItems,
    })

    const handleToggleChapter = (chapterId: string) => {
        // Trạng thái đóng/mở chỉ thuộc UI, không đưa vào draft thứ tự để một thao tác
        // toggle không vô tình che các props mới do Server Component gửi xuống.
        setClosedChapters((currentState) => ({
            ...currentState,
            [chapterId]: !currentState[chapterId],
        }))
    }

    const handleDragStart = (event: DragStartEvent) => {
        // Lưu trạng thái trước khi kéo để xác định thao tác có thực sự thay đổi order.
        // Khi hủy hoặc request lỗi, bỏ draft sẽ quay về snapshot server gần nhất.
        if (event.operation.source) {
            itemsSnapshot.current = latestItemsRef.current
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        // Chapter chỉ được chốt thứ tự khi thả; riêng lesson phải cập nhật trạng thái
        // ngay khi đi qua danh sách khác để React luôn đồng bộ với DOM của dnd-kit.
        if (event.operation.source?.type !== 'lesson') return

        setOptimisticItems((currentItems) => {
            const currentLessonGroups = Object.fromEntries(
                currentItems.map((chapter) => [getLessonGroupId(chapter.id), chapter.lessons]),
            )
            const nextLessonGroups = move(currentLessonGroups, event)

            if (nextLessonGroups === currentLessonGroups) return currentItems

            // Array index là nguồn order duy nhất để tránh một trường position cục bộ
            // có thể lệch khỏi cấu trúc mà dnd-kit đang hiển thị.
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
                resetOptimisticItems()
            }

            return
        }

        if (!isSortable(source)) return

        if (source.type === 'lesson') {
            // Full snapshot cần cả chapterId và position vì một lần kéo có thể thay đổi
            // đồng thời chapter cha và thứ tự của lesson.
            const currentLessons = getLessonOrder(latestItemsRef.current)
            const hasChanged = hasLessonOrderChanged(currentLessons, itemsSnapshot.current)

            if (!hasChanged) {
                resetOptimisticItems()
                return
            }

            // Transition không block handler nên dnd-kit vẫn hoàn tất drop ngay,
            // còn isReordering sẽ khóa lần kéo tiếp theo đến khi server phản hồi.
            persistLessonOrder(currentLessons)

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

            persistChapterOrder(chapters)

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
                    isOpen={!closedChapters[chapter.id]}
                    isDragDisabled={isReordering}
                    onToggle={handleToggleChapter}
                />
            ))}
        </DragDropProvider>
    )
}
