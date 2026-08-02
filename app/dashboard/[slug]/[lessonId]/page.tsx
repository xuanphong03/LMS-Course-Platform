import LessonContent from '@/app/dashboard/[slug]/[lessonId]/_components/LessonContent'
import LessonContentSkeleton from '@/app/dashboard/[slug]/[lessonId]/_components/LessonContentSkeleton'
import { getLessonContent } from '@/app/data/course/get-lesson-content'
import { Suspense } from 'react'

interface LessonContentProps {
    params: Promise<{ lessonId: string }>
}
export default async function LessonContentPage({ params }: LessonContentProps) {
    const { lessonId } = await params

    return (
        <Suspense fallback={<LessonContentSkeleton />}>
            <LessonContentLoader lessonId={lessonId} />
        </Suspense>
    )
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
    const data = await getLessonContent({ lessonId })
    return <LessonContent data={data} />
}
