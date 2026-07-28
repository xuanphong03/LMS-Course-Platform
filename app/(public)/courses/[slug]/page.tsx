import { getSingularCourse } from '@/app/data/course/get-singular-course'
import { Badge } from '@/components/ui/badge'
import { env } from '@/lib/env'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { IconChartBar, IconCategory, IconClock } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import RenderTextEditor from '@/components/rich-text-editor/RenderTextEditor'

interface CourseDetailPageProps {
    params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
    const { slug } = await params
    const course = await getSingularCourse({ slug: slug })

    if (!course) {
        return notFound()
    }

    const courseThumbnail = course?.fileKey
        ? `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${course.fileKey}`
        : ''

    return (
        <main className='relative py-5'>
            <div className='mx-auto grid max-w-340 grid-cols-1 gap-8 md:grid-cols-3'>
                <div className='col-span-full md:col-span-2'>
                    <div className='relative overflow-hidden rounded-xl shadow-lg'>
                        <Image
                            priority
                            width={1200}
                            height={800}
                            src={courseThumbnail}
                            alt={course?.title || ''}
                            className='h-auto w-full'
                        />
                        <div className='absolute top-0 left-0 h-full w-full bg-linear-to-t from-black/20 to-transparent'></div>
                    </div>
                    <div className='mt-8 space-y-6'>
                        <div className='space-y-4'>
                            <h1 className='text-4xl font-bold tracking-tight'>{course?.title}</h1>
                            <p className='text-muted-foreground line-clamp-2 text-lg leading-relaxed'>
                                {course?.shortDescription}
                            </p>
                        </div>
                        <div className='flex flex-wrap gap-3'>
                            <Badge className='flex items-center gap-x-1 px-4 py-2.5'>
                                <IconChartBar className='size-4' />
                                <span>{course.level}</span>
                            </Badge>
                            <Badge className='flex items-center gap-x-1 px-4 py-2.5'>
                                <IconCategory className='size-4' />
                                <span>{course.category}</span>
                            </Badge>
                            <Badge className='flex items-center gap-x-1 px-4 py-2.5'>
                                <IconClock className='size-4' />
                                <span>{course.duration} hours</span>
                            </Badge>
                        </div>
                        <Separator className='my-8' />
                        {course?.description && (
                            <div className='space-y-6'>
                                <h2 className='text-3xl font-semibold tracking-tight capitalize'>Course description</h2>
                                <RenderTextEditor json={JSON.parse(course.description)} />
                            </div>
                        )}
                    </div>

                    <div className='mt-12 space-y-6'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-3xl font-semibold tracking-tight capitalize'>Course content</h2>
                            <div className=''>
                                {course?.chapters?.length || 0} Chapters |{' '}
                                {course?.chapters?.reduce(
                                    (total, chapter) => total + (chapter?.lessons?.length || 0),
                                    0,
                                ) || 0}{' '}
                                Lessons
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-full md:col-span-1'></div>
            </div>
        </main>
    )
}
