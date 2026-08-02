import Link from 'next/link'
import { Metadata } from 'next'
import { PlusIcon } from 'lucide-react'
import { ROUTES } from '@/consts/routes'
import { buttonVariants } from '@/components/ui/button'
import { adminGetCourses } from '@/app/data/admin/admin-get-courses'
import AdminCourseList from '@/app/(admin)/admin/courses/_components/AdminCourseList'
import { Suspense } from 'react'
import AdminCourseSkeletonLayout from '@/app/(admin)/admin/courses/_components/AdminCourseSkeletonLayout'
import EmptyCourseLayout from '@/app/_components/EmptyCourseLayout'

export const metadata: Metadata = {
    title: 'Course Management',
    description: 'Manage, create, and organize your courses from the admin dashboard.',
}

export default function CoursesPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold capitalize'>Your courses</h1>
                <Link
                    href={ROUTES.ADMIN_COURSES_CREATE}
                    className={buttonVariants()}
                >
                    <PlusIcon /> New Course
                </Link>
            </div>
            <Suspense fallback={<AdminCourseSkeletonLayout />}>
                <RenderCourses />
            </Suspense>
        </>
    )
}

async function RenderCourses() {
    const data = await adminGetCourses()

    return (
        <>
            {!data?.length ? (
                <EmptyCourseLayout
                    title='No courses available'
                    description='There are currently no courses created. Please create a new course to get started!'
                    buttonText='Create Course'
                    buttonLink={ROUTES.ADMIN_COURSES_CREATE}
                />
            ) : (
                <AdminCourseList data={data} />
            )}
        </>
    )
}
