import 'server-only'
import { requireUser } from '@/app/data/user/require-user'
import { prisma } from '@/lib/db'

export async function getEnrolledCourses() {
    const session = await requireUser()

    const data = await prisma.enrollment.findMany({
        where: {
            userId: session.user.id,
            status: 'Active',
        },
        select: {
            course: {
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    description: true,
                    shortDescription: true,
                    level: true,
                    fileKey: true,
                    price: true,
                    category: true,
                    slug: true,
                    chapters: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            lessons: {
                                select: {
                                    id: true,
                                    title: true,
                                    position: true,
                                    lessonProgress: {
                                        where: {
                                            userId: session.user.id,
                                        },
                                        select: {
                                            id: true,
                                            lessonId: true,
                                            completed: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    return data
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0]
