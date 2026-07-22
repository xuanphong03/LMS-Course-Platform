import z from 'zod/v3'

/** Một lesson trong full snapshot dùng để lưu lại thứ tự của course. */
const reorderLessonInputSchema = z
    .object({
        id: z.string().min(1),
        chapterId: z.string().min(1),
        position: z.number().int().nonnegative(),
    })
    .strict()

/** Một chapter trong full snapshot dùng để lưu lại thứ tự của course. */
const reorderChapterInputSchema = z
    .object({
        id: z.string().min(1),
        position: z.number().int().nonnegative(),
    })
    .strict()

/** Kiểm tra shape dữ liệu đầu vào của Server Action reorder lesson. */
export const reorderLessonsSchema = z
    .object({
        courseId: z.string().min(1),
        lessons: z.array(reorderLessonInputSchema).min(1),
    })
    .strict()

/** Kiểm tra shape dữ liệu đầu vào của Server Action reorder chapter. */
export const reorderChaptersSchema = z
    .object({
        courseId: z.string().min(1),
        chapters: z.array(reorderChapterInputSchema).min(1),
    })
    .strict()

// Type được suy ra trực tiếp từ schema để client payload và server validation
// không duy trì hai định nghĩa độc lập có thể bị lệch nhau theo thời gian.
export type ReorderLessonInput = z.infer<typeof reorderLessonInputSchema>
export type ReorderChapterInput = z.infer<typeof reorderChapterInputSchema>
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>
export type ReorderChaptersInput = z.infer<typeof reorderChaptersSchema>
