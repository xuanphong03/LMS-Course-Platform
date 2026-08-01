import 'server-only'
import { requireAdmin } from '@/app/data/admin/require-admin'
import { prisma } from '@/lib/db'

export async function adminGetEnrollmentStats() {
    await requireAdmin()

    const thirtyDayAgo = new Date()
    thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30)

    const enrollments = await prisma.enrollment.findMany({
        where: {
            createdAt: {
                gte: thirtyDayAgo,
            },
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    })

    const last30days: { date: string; enrollments: number }[] = []

    for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        last30days.push({
            date: date.toISOString().split('T')[0],
            enrollments: 0,
        })
    }

    enrollments.forEach((enrollment) => {
        const enrollmentDate = enrollment.createdAt.toISOString().split('T')[0]
        const dayIndex = last30days.findIndex((day) => day.date === enrollmentDate)
        if (dayIndex !== -1) {
            last30days[dayIndex].enrollments++
        }
    })

    return last30days
}
export type AdminEnrollmentStatsType = Awaited<ReturnType<typeof adminGetEnrollmentStats>>
