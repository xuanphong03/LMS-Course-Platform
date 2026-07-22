import 'server-only'

import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'

interface CourseChapterIdentity {
    id: string
    lessons: { id: string }[]
}

/**
 * Một danh sách position hợp lệ phải là permutation liên tục của `0..n-1`.
 * Zod đã loại số âm và số thập phân; hàm này chịu trách nhiệm phát hiện trùng và gap.
 */
const hasContiguousPositions = (positions: number[]) => {
    const uniquePositions = new Set(positions)

    return uniquePositions.size === positions.length && positions.every((position) => position < positions.length)
}

/**
 * Xác thực ngữ nghĩa mà schema không thể biết: payload phải chứa chính xác toàn bộ
 * chapter thuộc course và mỗi chapter xuất hiện đúng một lần.
 */
export const isValidChapterOrder = (validChapterIds: string[], chapters: ReorderChapterInput[]) => {
    const validIds = new Set(validChapterIds)
    const submittedIds = new Set(chapters.map((chapter) => chapter.id))
    const hasExactChapterSet =
        submittedIds.size === chapters.length &&
        submittedIds.size === validIds.size &&
        validChapterIds.every((chapterId) => submittedIds.has(chapterId)) &&
        chapters.every((chapter) => validIds.has(chapter.id))

    return hasExactChapterSet && hasContiguousPositions(chapters.map((chapter) => chapter.position))
}

/**
 * Xác thực full snapshot lesson: không thiếu/thừa/trùng ID, chapter đích phải thuộc
 * course và position trong từng chapter phải tạo thành dãy liên tục `0..n-1`.
 */
export const isValidLessonOrder = (courseChapters: CourseChapterIdentity[], lessons: ReorderLessonInput[]) => {
    const validChapterIds = new Set(courseChapters.map((chapter) => chapter.id))
    const validLessonIds = new Set(courseChapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)))
    const submittedLessonIds = new Set(lessons.map((lesson) => lesson.id))
    const hasExactLessonSet =
        submittedLessonIds.size === lessons.length &&
        submittedLessonIds.size === validLessonIds.size &&
        [...validLessonIds].every((lessonId) => submittedLessonIds.has(lessonId)) &&
        lessons.every((lesson) => validLessonIds.has(lesson.id) && validChapterIds.has(lesson.chapterId))

    if (!hasExactLessonSet) return false

    const positionsByChapter = new Map([...validChapterIds].map((chapterId) => [chapterId, [] as number[]]))
    for (const lesson of lessons) {
        positionsByChapter.get(lesson.chapterId)?.push(lesson.position)
    }

    return [...positionsByChapter.values()].every(hasContiguousPositions)
}
