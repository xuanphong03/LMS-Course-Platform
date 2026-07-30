import 'server-only'

import type { ReorderChapterInput, ReorderLessonInput } from '@/schemas/course-structure-order.schema'

interface CourseChapterIdentity {
    id: string
    lessons: { id: string }[]
}

type IdLookup = Record<string, true>

/** Tạo bảng tra cứu ID không kế thừa prototype để mọi key đều được xử lý như dữ liệu. */
const createIdLookup = (ids: string[]): IdLookup =>
    ids.reduce<IdLookup>(
        (lookup, id) => {
            lookup[id] = true
            return lookup
        },
        Object.create(null) as IdLookup,
    )

/**
 * Kiểm tra payload chứa đúng toàn bộ ID hợp lệ và mỗi ID chỉ xuất hiện một lần.
 * Lookup object giữ phép tra cứu O(1) và dùng chung cho mọi loại entity.
 */
const hasExactIds = (validIds: string[], submittedIds: string[]) => {
    if (validIds.length !== submittedIds.length) return false

    const validIdLookup = createIdLookup(validIds)
    const submittedIdLookup = Object.create(null) as IdLookup

    for (const id of submittedIds) {
        if (!validIdLookup[id] || submittedIdLookup[id]) return false
        submittedIdLookup[id] = true
    }

    return true
}

/**
 * Một danh sách position hợp lệ phải là permutation liên tục của `0..n-1`.
 * Zod đã loại số âm và số thập phân; hàm này chịu trách nhiệm phát hiện trùng và gap.
 */
const hasContiguousPositions = (positions: number[]) => {
    const occupiedPositions = Array<boolean>(positions.length).fill(false)

    for (const position of positions) {
        if (position >= positions.length || occupiedPositions[position]) return false
        occupiedPositions[position] = true
    }

    return true
}

/**
 * Xác thực ngữ nghĩa mà schema không thể biết: payload phải chứa chính xác toàn bộ
 * chapter thuộc course và mỗi chapter xuất hiện đúng một lần.
 */
export const isValidChapterOrder = (validChapterIds: string[], chapters: ReorderChapterInput[]) => {
    const hasExactChapterIds = hasExactIds(
        validChapterIds,
        chapters.map((chapter) => chapter.id),
    )

    return hasExactChapterIds && hasContiguousPositions(chapters.map((chapter) => chapter.position))
}

/**
 * Xác thực full snapshot lesson: không thiếu/thừa/trùng ID, chapter đích phải thuộc
 * course và position trong từng chapter phải tạo thành dãy liên tục `0..n-1`.
 */
export const isValidLessonOrder = (courseChapters: CourseChapterIdentity[], lessons: ReorderLessonInput[]) => {
    const validLessonIds = courseChapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id))
    const hasExactLessonIds = hasExactIds(
        validLessonIds,
        lessons.map((lesson) => lesson.id),
    )

    if (!hasExactLessonIds) return false

    const positionsByChapter = Object.fromEntries(
        courseChapters.map((chapter) => [chapter.id, [] as number[]]),
    ) as Record<string, number[]>

    for (const lesson of lessons) {
        if (!Object.hasOwn(positionsByChapter, lesson.chapterId)) return false
        positionsByChapter[lesson.chapterId].push(lesson.position)
    }

    return Object.values(positionsByChapter).every(hasContiguousPositions)
}
