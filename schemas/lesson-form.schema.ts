import z from 'zod/v3'

export const lessonSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    courseId: z.string().uuid({ message: 'Invalid course id' }),
    chapterId: z.string().uuid({ message: 'Invalid chapter id' }),
    description: z.string().optional(),
    thumbnailKey: z.string().optional(),
    videoKey: z.string().optional(),
})

export type LessonSchemaType = z.infer<typeof lessonSchema>
