import { requireUser } from '@/app/data/user/require-user'
import { prisma } from '@/lib/db'
import 'server-only'

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
                            lessons: {
                                select: {
                                    id: true,
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
