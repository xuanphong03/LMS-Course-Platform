import PublicCourseCard, { PublicCourseCardSkeleton } from '@/app/(public)/courses/_components/PublicCourseCard'
import CoursesHero from '@/app/(public)/courses/_components/CoursesHero'
import { getAllCourses } from '@/app/data/course/get-all-courses'
import { ArrowUpRight, LibraryBig } from 'lucide-react'
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
        <main className='relative overflow-hidden pt-24 pb-24 sm:pt-36 sm:pb-32'>
            <div className='mx-auto max-w-340 px-5 sm:px-8'>
                <CoursesHero />
                <div
                    id='course-grid'
                    className='mt-20 sm:mt-24'
                >
                    <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
                        <div>
                            <div className='text-primary inline-flex items-center gap-2 text-sm font-medium'>
                                <LibraryBig className='size-4' />
                                Curated for progress
                            </div>
                            <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>Explore all courses</h2>
                            <p className='text-muted-foreground mt-3 max-w-xl leading-7'>Choose a focused path and keep building your next useful skill.</p>
                        </div>
                        <span className='text-muted-foreground inline-flex items-center gap-2 text-sm'>
                            Browse at your own pace
                            <ArrowUpRight className='size-4' />
                        </span>
                    </div>
                    <Suspense fallback={<LoadingSkeletonLayout />}>
                        <RenderCourses />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}

async function RenderCourses() {
    const courses = await getAllCourses()

    if (!courses.length) {
        return (
            <div className='bg-muted/30 border-border/70 text-muted-foreground mt-10 rounded-3xl border border-dashed p-12 text-center'>
                New courses are being prepared. Check back soon.
            </div>
        )
    }

    return (
        <>
            <p className='text-muted-foreground mt-8 text-sm'>{courses.length} courses available</p>
            <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {courses.map((course) => (
                    <PublicCourseCard
                        key={course.id}
                        data={course}
                        className='col-span-1'
                    />
                ))}
            </div>
        </>
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
