'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { ROUTES } from '@/consts/routes'
import arcjet, { fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { request } from '@arcjet/next'

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    }),
)

export type DeleteCourseType = {
    courseId: string
}
export async function deleteCourse({ courseId }: DeleteCourseType): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string,
        })
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: 'You have been blocked due to rate limiting',
                }
            } else {
                return {
                    status: 'error',
                    message: 'You are a bot! If this is a mistake, contact our support',
                }
            }
        }

        await prisma.course.delete({
            where: {
                id: courseId,
            },
        })

        revalidatePath(ROUTES.ADMIN_COURSES)

        return {
            status: 'success',
            message: 'Delete course successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to delete course',
        }
    }
}
