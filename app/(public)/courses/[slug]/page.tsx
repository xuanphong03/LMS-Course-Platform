import CourseEnrollment from '@/app/(public)/courses/[slug]/_components/CourseEnrollment'
import CourseInformation from '@/app/(public)/courses/[slug]/_components/CourseInformation'
import { getSingularCourse } from '@/app/data/course/get-singular-course'
import { checkoutIfCourseBought } from '@/app/data/user/user-is-enrolled'
import { ROUTES } from '@/consts/routes'
import { env } from '@/lib/env'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconChevronRight, IconHome } from '@tabler/icons-react'

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
    const { slug } = await params

    const course = await getSingularCourse({
        slug,
    })

    if (!course) {
        return {
            title: 'Course Not Found',
            description: 'This course does not exist.',
        }
    }
    const thumbnailUrl = course?.fileKey
        ? `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${course.fileKey}`
        : ''

    return {
        title: course.title,
        description: course.shortDescription,
        alternates: {
            canonical: `/courses/${course.slug}`,
        },

        keywords: [course.title, 'online course', 'learning', course.category],

        openGraph: {
            title: course.title,
            description: course.shortDescription,
            url: `/courses/${course.slug}`,
            siteName: 'LMS Course Platform',
            type: 'article',
            images: [
                {
                    url: thumbnailUrl,
                    width: 1200,
                    height: 630,
                    alt: course.title,
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: course.title,
            description: course.shortDescription,
            images: [thumbnailUrl],
        },
    }
}

interface CourseDetailPageProps {
    params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
    const { slug } = await params
    const course = await getSingularCourse({ slug: slug })
    if (!course) {
        return notFound()
    }

    const isEnrolled = await checkoutIfCourseBought({ courseId: course.id })

    return (
        <main className='relative overflow-hidden pt-24 pb-24 sm:pt-32 sm:pb-32'>
            <div className='bg-primary/10 pointer-events-none absolute -top-48 left-1/3 size-128 rounded-full blur-3xl' />
            <div className='mx-auto max-w-340 px-5 sm:px-8'>
                <nav
                    aria-label='Breadcrumb'
                    className='text-muted-foreground flex items-center gap-2 text-sm'
                >
                    <Link
                        href={ROUTES.HOME}
                        className='hover:text-foreground inline-flex items-center gap-1.5 transition-colors'
                    >
                        <IconHome className='size-4' />
                        Home
                    </Link>
                    <IconChevronRight className='size-4' />
                    <Link
                        href={ROUTES.PUBLIC_COURSES}
                        className='hover:text-foreground transition-colors'
                    >
                        Courses
                    </Link>
                    <IconChevronRight className='size-4' />
                    <span className='text-foreground max-w-48 truncate'>{course.category}</span>
                </nav>

                <div className='relative mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14'>
                    <CourseInformation course={course} />
                    <CourseEnrollment
                        course={course}
                        isEnrolled={isEnrolled}
                    />
                </div>
            </div>
        </main>
    )
}
