import CourseSidebar from '@/app/dashboard/[slug]/_components/CourseSidebar'
import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data'

interface DashboardCourseDetailLayoutProps {
    params: Promise<{ slug: string }>
    children: React.ReactNode
}
export default async function DashboardCourseDetailLayout({ children, params }: DashboardCourseDetailLayoutProps) {
    const { slug } = await params
    const courseSidebarData = await getCourseSidebarData(slug)

    return (
        <div className='flex flex-1'>
            <div className='border-border w-80 shrink-0 border-r'>
                <CourseSidebar course={courseSidebarData.course} />
            </div>
            <div className='flex-1 overflow-hidden'>{children}</div>
        </div>
    )
}
