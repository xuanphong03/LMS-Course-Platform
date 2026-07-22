import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'
import type { CourseStructureItem } from './course-structure.types'

/** Namespace ID của droppable lesson list để không trùng với ID entity trong cùng provider. */
export const getLessonGroupId = (chapterId: string) => `lesson-list-${chapterId}`

/** Chuyển thứ tự chapter trên UI thành full snapshot để gửi lên server. */
export const getChapterOrder = (items: CourseStructureItem[]): ReorderChapterInput[] =>
    items.map((chapter, position) => ({ id: chapter.id, position }))

/** Chuyển cấu trúc lesson lồng nhau thành full snapshot gồm chapter đích và position. */
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

/**
 * Khôi phục riêng thứ tự chapter từ baseline đã được server xác nhận.
 * Object chapter hiện tại được tái sử dụng để không làm mất UI state như `isOpen`.
 */
export const restoreChapterOrder = (
    items: CourseStructureItem[],
    confirmedOrder: ReorderChapterInput[],
): CourseStructureItem[] => {
    const chaptersById = new Map(items.map((chapter) => [chapter.id, chapter]))
    const confirmedIds = new Set(confirmedOrder.map((chapter) => chapter.id))
    const restoredChapters = [...confirmedOrder]
        .sort((left, right) => left.position - right.position)
        .flatMap((chapter) => {
            const currentChapter = chaptersById.get(chapter.id)
            return currentChapter ? [currentChapter] : []
        })

    // Giữ entity mới chưa có trong baseline thay vì vô tình xóa khỏi local state.
    return [...restoredChapters, ...items.filter((chapter) => !confirmedIds.has(chapter.id))]
}

/**
 * Khôi phục riêng vị trí lesson từ baseline server, đồng thời giữ nguyên thứ tự
 * chapter và mọi UI state hiện tại của chapter.
 */
export const restoreLessonOrder = (
    items: CourseStructureItem[],
    confirmedOrder: ReorderLessonInput[],
): CourseStructureItem[] => {
    const lessonsById = new Map(
        items.flatMap((chapter) => chapter.lessons.map((lesson) => [lesson.id, lesson] as const)),
    )
    const confirmedIds = new Set(confirmedOrder.map((lesson) => lesson.id))
    const lessonsByChapter = new Map(items.map((chapter) => [chapter.id, [] as CourseStructureItem['lessons']]))

    for (const lesson of [...confirmedOrder].sort((left, right) => left.position - right.position)) {
        const currentLesson = lessonsById.get(lesson.id)
        const chapterLessons = lessonsByChapter.get(lesson.chapterId)

        if (currentLesson && chapterLessons) {
            chapterLessons.push(currentLesson)
        }
    }

    // Entity mới chưa được server xác nhận vẫn nằm trong chapter hiện tại.
    for (const chapter of items) {
        const chapterLessons = lessonsByChapter.get(chapter.id)
        if (!chapterLessons) continue

        chapterLessons.push(...chapter.lessons.filter((lesson) => !confirmedIds.has(lesson.id)))
    }

    return items.map((chapter) => ({
        ...chapter,
        lessons: lessonsByChapter.get(chapter.id) ?? chapter.lessons,
    }))
}
