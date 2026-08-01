import 'server-only'
import { requireAdmin } from '@/app/data/admin/require-admin'
import { prisma } from '@/lib/db'

export async function adminGetDashboardStats() {
    await requireAdmin()

    const [totalSignUps, totalCustomers, totalCourses, totalLessons] = await Promise.all([
        // total sign ups
        prisma.user.count(),
        // total customers
        prisma.user.count({
            where: {
                enrollment: {
                    some: {},
                },
            },
        }),
        // total courses
        prisma.course.count(),
        // total lessons
        prisma.lesson.count(),
    ])

    return {
        totalSignUps,
        totalCustomers,
        totalCourses,
        totalLessons,
    }
}

export type AdminDashboardStatsType = Awaited<ReturnType<typeof adminGetDashboardStats>>
