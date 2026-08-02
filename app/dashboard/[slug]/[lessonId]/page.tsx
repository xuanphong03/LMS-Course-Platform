import CourseContent from '@/app/dashboard/[slug]/[lessonId]/_components/CourseContent'
import LessonSkeleton from '@/app/dashboard/[slug]/[lessonId]/_components/LessonSkeleton'
import { getLessonContent } from '@/app/data/course/get-lesson-content'
import { Suspense } from 'react'

interface LessonContentProps {
    params: Promise<{ lessonId: string }>
}
export default async function LessonContentPage({ params }: LessonContentProps) {
    const { lessonId } = await params

    return (
        <Suspense fallback={<LessonSkeleton />}>
            <LessonContentLoader lessonId={lessonId} />
        </Suspense>
    )
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
    const data = await getLessonContent({ lessonId })
    return <CourseContent data={data} />
}
