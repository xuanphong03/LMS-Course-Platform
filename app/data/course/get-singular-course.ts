import { prisma } from '@/lib/db'
import { cache } from 'react'

export const getSingularCourse = cache(async ({ slug }: { slug: string }) => {
    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            description: true,
            shortDescription: true,
            fileKey: true,
            price: true,
            duration: true,
            level: true,
            category: true,
            slug: true,
            chapters: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            position: 'asc',
                        },
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    })
    if (!course) {
        return null
    }
    return course
})

export type PublicCourseDetailType = Awaited<ReturnType<typeof getSingularCourse>>
