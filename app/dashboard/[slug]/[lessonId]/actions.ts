'use server'

import { requireUser } from '@/app/data/user/require-user'
import { ROUTES } from '@/consts/routes'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function maskCompleteLesson({
    lessonId,
    courseSlug,
}: {
    lessonId: string
    courseSlug: string
}): Promise<ApiResponse> {
    const session = await requireUser()

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lessonId,
                },
            },
            update: {
                completed: true,
            },
            create: {
                userId: session.user.id,
                lessonId: lessonId,
                completed: true,
            },
        })

        revalidatePath(ROUTES.USER_DASHBOARD_COURSE_DETAIL(courseSlug))

        return {
            status: 'success',
            message: 'Progress updated successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to update lesson completion status',
        }
    }
}
