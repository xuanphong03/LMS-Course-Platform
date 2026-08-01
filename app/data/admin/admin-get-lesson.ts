import 'server-only'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

interface IAdminGetLessonProps {
    lessonId: string
    chapterId: string
}

export async function adminGetLesson({ chapterId, lessonId }: IAdminGetLessonProps) {
    await requireAdmin()

    const data = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
            chapterId: chapterId,
        },
        select: {
            title: true,
            videoKey: true,
            thumbnailKey: true,
            description: true,
            id: true,
            position: true,
        },
    })

    if (!data) {
        return notFound()
    }
    return data
}
export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>
