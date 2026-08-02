import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data'
import { ROUTES } from '@/consts/routes'
import { redirect } from 'next/navigation'

interface DashboardCourseDetailProps {
    params: Promise<{ slug: string }>
}

export default async function DashboardCourseDetailPage({ params }: DashboardCourseDetailProps) {
    const { slug } = await params

    const course = await getCourseSidebarData(slug)
    const firstChapter = course.course.chapters[0]
    const firstLesson = firstChapter.lessons[0]

    if (firstLesson) {
        redirect(ROUTES.USER_DASHBOARD_LESSON_DETAIL(slug, firstLesson.id))
    }
    return (
        <div className='flex h-full items-center justify-center'>
            <h2 className='mb-2 text-2xl font-semibold'>No lessons available</h2>
            <p className='text-muted-foreground'>This course does not have any course</p>
        </div>
    )
}
