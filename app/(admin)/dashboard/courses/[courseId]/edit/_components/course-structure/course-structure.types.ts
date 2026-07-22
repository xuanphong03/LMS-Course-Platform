/**
 * View model tối thiểu của một lesson trong màn hình sắp xếp.
 * Các trường nội dung chi tiết được giữ ở Server Component để giảm RSC payload.
 */
export interface CourseStructureLesson {
    id: string
    title: string
}

/**
 * View model của chapter. `isOpen` là UI state, còn thứ tự được xác định duy nhất
 * bởi vị trí của chapter và lesson trong mảng tương ứng.
 */
export interface CourseStructureItem {
    id: string
    title: string
    isOpen: boolean
    lessons: CourseStructureLesson[]
}
