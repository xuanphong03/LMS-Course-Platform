import AdminCourseCard from '@/app/(admin)/admin/courses/_components/AdminCourseCard'
import AdminCourseEmpty from '@/app/(admin)/admin/courses/_components/AdminCourseEmpty'
import { AdminCourseSkeletonCard } from '@/app/(admin)/admin/courses/_components/AdminCourseSkeletonLayout'
import { adminGetDashboardStats } from '@/app/data/admin/admin-get-dashboard-stats'
import { adminGetEnrollmentStats } from '@/app/data/admin/admin-get-enrollment-stats'
import { adminGetRecentCourses } from '@/app/data/admin/admin-get-recent-courses'
import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { SectionCards } from '@/components/sidebar/section-cards'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'

import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Overview of LMS Course Platform activity and data.',
}

export default async function DashboardPage() {
    const [dashboardStats, enrollmentStats] = await Promise.all([adminGetDashboardStats(), adminGetEnrollmentStats()])
    return (
        <>
            <SectionCards data={dashboardStats} />
            <ChartAreaInteractive data={enrollmentStats} />
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold'>Recent Courses</h2>
                    <Link
                        href={ROUTES.ADMIN_COURSES}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        View All Courses
                    </Link>
                </div>
                <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
                    <RenderRecentCourses />
                </Suspense>
            </div>
        </>
    )
}

async function RenderRecentCourses() {
    const recentCourses = await adminGetRecentCourses()

    if (!Array.isArray(recentCourses) || !recentCourses.length) {
        return <AdminCourseEmpty />
    }

    return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {recentCourses.map((course) => (
                <AdminCourseCard
                    data={course}
                    key={course.id}
                />
            ))}
        </div>
    )
}

function RenderRecentCoursesSkeletonLayout() {
    return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {Array.from({ length: 2 }).map((_, index) => (
                <AdminCourseSkeletonCard key={index} />
            ))}
        </div>
    )
}
