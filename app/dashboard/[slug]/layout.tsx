import CourseSidebar from '@/app/dashboard/[slug]/_components/CourseSidebar'
import MobileCourseNavigation from '@/app/dashboard/[slug]/_components/MobileCourseNavigation'
import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Course Learning',
    description: 'Learn at your own pace and track your progress through the course lessons.',
}

interface DashboardCourseDetailLayoutProps {
    params: Promise<{ slug: string }>
    children: React.ReactNode
}
export default async function DashboardCourseDetailLayout({ children, params }: DashboardCourseDetailLayoutProps) {
    const { slug } = await params
    const courseSidebarData = await getCourseSidebarData(slug)

    return (
        <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
            <div className='border-border bg-background border-b px-4 py-3 md:hidden'>
                <MobileCourseNavigation course={courseSidebarData.course} />
            </div>
            <div className='flex min-h-0 min-w-0 flex-1'>
                <div className='border-border hidden w-80 shrink-0 border-r md:block'>
                    <CourseSidebar course={courseSidebarData.course} />
                </div>
                <div className='min-w-0 flex-1 overflow-y-auto'>{children}</div>
            </div>
        </div>
    )
}
