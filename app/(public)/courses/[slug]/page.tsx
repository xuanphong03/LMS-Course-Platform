import CourseEnrollment from '@/app/(public)/courses/[slug]/_components/CourseEnrollment'
import CourseInformation from '@/app/(public)/courses/[slug]/_components/CourseInformation'
import { getSingularCourse } from '@/app/data/course/get-singular-course'
import { env } from '@/lib/env'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

        keywords: [course.title, 'online course', 'learning', course.category],

        openGraph: {
            title: course.title,
            description: course.shortDescription,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
            siteName: 'LMS Platform',
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

    return (
        <main className='relative py-5'>
            <div className='mx-auto grid max-w-340 grid-cols-1 gap-8 md:grid-cols-3'>
                <div className='col-span-full md:col-span-2'>
                    <CourseInformation course={course} />
                </div>
                <div className='col-span-full md:col-span-1'>
                    <CourseEnrollment course={course} />
                </div>
            </div>
        </main>
    )
}
