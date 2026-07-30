/**
 * Chỉ đưa dữ liệu cần hiển thị/sắp xếp qua client boundary để không tăng RSC payload
 * theo toàn bộ nội dung chi tiết của lesson.
 */
export interface CourseStructureLesson {
    id: string
    title: string
}

/** Không chứa UI state để RSC snapshot mới không bị local collection che khuất. */
export interface CourseStructureItem {
    id: string
    title: string
    lessons: CourseStructureLesson[]
}
