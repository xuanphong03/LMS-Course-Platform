import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'
import type { CourseStructureItem } from './course-structure.types'

/** Namespace group ID để droppable list không va chạm với entity ID trong cùng provider. */
export const getLessonGroupId = (chapterId: string) => `lesson-list-${chapterId}`

/** Full snapshot buộc server xác thực cả tập ID, tránh lưu một phần order từ client. */
export const getChapterOrder = (items: CourseStructureItem[]): ReorderChapterInput[] =>
    items.map((chapter, position) => ({ id: chapter.id, position }))

/** Bao gồm chapterId vì reorder lesson cũng hỗ trợ di chuyển qua chapter khác. */
export const getLessonOrder = (items: CourseStructureItem[]): ReorderLessonInput[] =>
    items.flatMap((chapter) =>
        chapter.lessons.map((lesson, position) => ({
            id: lesson.id,
            chapterId: chapter.id,
            position,
        })),
    )

/**
 * So sánh vị trí lesson hiện tại với snapshot tại thời điểm bắt đầu kéo.
 * Ghép chapterId và position để nhận biết cả reorder cùng chapter lẫn chuyển chapter.
 */
export const hasLessonOrderChanged = (currentOrder: ReorderLessonInput[], snapshot: CourseStructureItem[]) => {
    const previousPositions = new Map(
        snapshot.flatMap((chapter) =>
            chapter.lessons.map((lesson, position) => [lesson.id, `${chapter.id}:${position}`] as const),
        ),
    )

    return currentOrder.some((lesson) => previousPositions.get(lesson.id) !== `${lesson.chapterId}:${lesson.position}`)
}
