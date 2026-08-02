import { requireUser } from '@/app/data/user/require-user'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import 'server-only'

export async function getLessonContent({ lessonId }: { lessonId: string }) {
    const session = await requireUser()
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            position: true,
            chapter: {
                select: {
                    courseId: true,
                    course: {
                        select: {
                            slug: true,
                        },
                    },
                },
            },
            lessonProgress: {
                where: {
                    userId: session.user.id,
                },
                select: {
                    id: true,
                    completed: true,
                },
            },
        },
    })

    if (!lesson) {
        return notFound()
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            courseId_userId: {
                courseId: lesson.chapter.courseId,
                userId: session.user.id,
            },
        },
        select: {
            status: true,
        },
    })

    if (!enrollment || enrollment.status !== 'Active') {
        return notFound()
    }

    return lesson
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>
