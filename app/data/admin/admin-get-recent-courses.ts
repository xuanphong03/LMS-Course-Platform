import 'server-only'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { prisma } from '@/lib/db'

export async function adminGetRecentCourses() {
    await requireAdmin()
    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 2,
        select: {
            id: true,
            title: true,
            shortDescription: true,
            duration: true,
            level: true,
            price: true,
            fileKey: true,
            slug: true,
            category: true,
        },
    })
    return data
}

export type AdminRecentCoursesType = Awaited<ReturnType<typeof adminGetRecentCourses>>
