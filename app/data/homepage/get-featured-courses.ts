import { prisma } from '@/lib/db'

export async function getFeaturedCourses() {
    const data = await prisma.course.findMany({
        where: {
            status: 'Publish',
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            title: true,
            price: true,
            description: true,
            shortDescription: true,
            slug: true,
            fileKey: true,
            id: true,
            level: true,
            duration: true,
            category: true,
        },
        take: 3,
    })

    return data
}

export type FeaturedCourseType = Awaited<ReturnType<typeof getFeaturedCourses>>[0]
