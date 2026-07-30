'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { lessonSchema, LessonSchemaType } from '@/schemas/lesson-form.schema'

type UpdateLessonDataType = {
    data: LessonSchemaType
    lessonId: string
}
export async function updateLesson({ data, lessonId }: UpdateLessonDataType): Promise<ApiResponse> {
    await requireAdmin()

    try {
        const results = lessonSchema.safeParse(data)
        if (!results.success) {
            return {
                status: 'error',
                message: 'Invalid data',
            }
        }

        await prisma.lesson.update({
            where: {
                id: lessonId,
            },
            data: {
                title: results.data.name,
                description: results.data.description,
                thumbnailKey: results.data.thumbnailKey,
                videoKey: results.data.videoKey,
            },
        })

        return {
            status: 'success',
            message: 'Lesson updated successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to update lesson',
        }
    }
}
