import LessonForm from '@/app/(admin)/admin/courses/[courseId]/[chapterId]/[lessonId]/_components/LessonForm'
import { adminGetLesson } from '@/app/data/admin/admin-get-lesson'

interface LessonDetailPageProps {
    params: Promise<{ courseId: string; chapterId: string; lessonId: string }>
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
    const { courseId, chapterId, lessonId } = await params
    const data = await adminGetLesson({ chapterId, lessonId })
    return (
        <>
            <LessonForm
                data={data}
                courseId={courseId}
                chapterId={chapterId}
            />
        </>
    )
}
