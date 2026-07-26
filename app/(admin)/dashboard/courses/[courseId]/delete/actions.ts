'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { ROUTES } from '@/consts/routes'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export type DeleteCourseType = {
    courseId: string
}
export async function deleteCourse({ courseId }: DeleteCourseType): Promise<ApiResponse> {
    await requireAdmin()

    try {
        await prisma.course.delete({
            where: {
                id: courseId,
            },
        })

        revalidatePath(ROUTES.DASHBOARD_COURSES)

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
