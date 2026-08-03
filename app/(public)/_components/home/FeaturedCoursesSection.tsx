import PublicCourseCard, { PublicCourseCardSkeleton } from '@/app/(public)/courses/_components/PublicCourseCard'
import { getFeaturedCourses } from '@/app/data/homepage/get-featured-courses'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

/**
 * Section dữ liệu động được đặt trong Suspense để phần Hero và layout tĩnh vẫn
 * có thể hiển thị trong lúc truy vấn danh sách khóa học hoàn tất.
 */
export function FeaturedCoursesSection() {
    return (
        <section className='bg-muted/20 relative py-24 sm:py-28'>
            <div className='mx-auto max-w-340 px-5 sm:px-8'>
                <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
                    <div className='max-w-2xl'>
                        <p className='bg-primary/10 text-primary sm:animate-in sm:fade-in inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase sm:duration-700'>
                            Start learning
                        </p>
                        <h2 className='sm:animate-in sm:fade-in sm:slide-in-from-bottom-3 mt-3 text-3xl font-bold tracking-tight sm:text-4xl sm:delay-100 sm:duration-700'>
                            Explore courses made for progress
                        </h2>
                        <p className='text-muted-foreground sm:animate-in sm:fade-in sm:slide-in-from-bottom-3 mt-4 leading-7 sm:delay-200 sm:duration-700'>
                            Find a course that matches your interests and take the next step with a clear learning path.
                        </p>
                    </div>
                    <Link
                        href={ROUTES.PUBLIC_COURSES}
                        className={buttonVariants({
                            variant: 'outline',
                            className: 'sm:animate-in sm:fade-in w-fit rounded-full sm:delay-300 sm:duration-700',
                        })}
                    >
                        View all courses
                        <ArrowRight />
                    </Link>
                </div>
                <Suspense fallback={<FeaturedCoursesSkeleton />}>
                    <FeaturedCourses />
                </Suspense>
            </div>
        </section>
    )
}

async function FeaturedCourses() {
    const courses = await getFeaturedCourses()

    if (!courses.length) {
        return (
            <div className='bg-muted/30 text-muted-foreground mt-10 rounded-2xl border border-dashed p-10 text-center'>
                New courses are coming soon. Check back shortly.
            </div>
        )
    }

    return (
        <div className='sm:animate-in sm:fade-in sm:slide-in-from-bottom-4 mt-10 grid grid-cols-1 gap-6 sm:delay-300 sm:duration-700 md:grid-cols-3'>
            {courses.map((course, index) => (
                <div
                    key={course.id}
                    className='sm:animate-in sm:fade-in sm:slide-in-from-bottom-4 sm:duration-700'
                    style={{ animationDelay: `${350 + index * 120}ms` }}
                >
                    <PublicCourseCard
                        data={course}
                        className='h-full'
                    />
                </div>
            ))}
        </div>
    )
}

function FeaturedCoursesSkeleton() {
    return (
        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}
