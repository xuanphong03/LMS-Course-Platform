import PublicCourseCard, { PublicCourseCardSkeleton } from '@/app/(public)/courses/_components/PublicCourseCard'
import { getAllCourses } from '@/app/data/course/get-all-courses'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Explore Courses',
    description: 'Explore online courses designed to help you achieve your learning goals.',
    alternates: {
        canonical: '/courses',
    },
}

export default function PublicCoursesPage() {
    return (
        <main className='relative pt-5 pb-32'>
            <div className='mx-auto max-w-340'>
                <div className='mb-10 flex flex-col space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tighter md:text-4xl'>Explore Courses</h1>
                    <p className='text-muted-foreground'>
                        Discover wide range of courses designed to help you archive your learning goals
                    </p>
                </div>
                <Suspense fallback={<LoadingSkeletonLayout />}>
                    <RenderCourses />
                </Suspense>
            </div>
        </main>
    )
}

async function RenderCourses() {
    const courses = await getAllCourses()
    return (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Array.isArray(courses) &&
                courses?.map((course) => (
                    <PublicCourseCard
                        key={course.id}
                        data={course}
                        className='col-span-1'
                    />
                ))}
        </div>
    )
}

function LoadingSkeletonLayout() {
    return (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 9 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}
