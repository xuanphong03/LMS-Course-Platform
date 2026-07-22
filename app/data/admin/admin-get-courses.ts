import 'server-only'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { prisma } from '@/lib/db'

export async function adminGetCourses() {
    const session = await requireAdmin()

    const data = await prisma.course.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            shortDescription: true,
            category: true,
            level: true,
            duration: true,
            fileKey: true,
            slug: true,
        },
    })

    return data
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0]
