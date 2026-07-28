import { PublicCourseDetailType } from '@/app/data/course/get-singular-course'
import Image from 'next/image'
import { IconChartBar, IconCategory, IconClock, IconChevronDown, IconPlayerPlay } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import RenderTextEditor from '@/components/rich-text-editor/RenderTextEditor'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { env } from '@/lib/env'

interface CourseInformationProps {
    course: PublicCourseDetailType
}

export default function CourseInformation({ course }: CourseInformationProps) {
    const courseThumbnail = course?.fileKey
        ? `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${course.fileKey}`
        : ''

    const totalCourses = course?.chapters?.length || 0
    const totalLessons = course?.chapters?.reduce((total, chapter) => total + (chapter?.lessons?.length || 0), 0) || 0

    return (
        <>
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
                        <span>{course?.level}</span>
                    </Badge>
                    <Badge className='flex items-center gap-x-1 px-4 py-2.5'>
                        <IconCategory className='size-4' />
                        <span>{course?.category}</span>
                    </Badge>
                    <Badge className='flex items-center gap-x-1 px-4 py-2.5'>
                        <IconClock className='size-4' />
                        <span>{course?.duration} hours</span>
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
                    <div className='flex items-center space-x-2'>
                        <span>
                            {totalCourses} {totalCourses > 1 ? 'Chapters' : 'Chapter'}
                        </span>
                        <span>|</span>
                        <span>
                            {totalLessons} {totalCourses > 1 ? 'Lessons' : 'Lesson'}
                        </span>
                    </div>
                </div>
                {Array.isArray(course?.chapters) && course?.chapters?.length && (
                    <Accordion
                        multiple
                        className='space-y-4'
                        defaultValue={[course.chapters[0].id]}
                    >
                        {Array.isArray(course?.chapters) &&
                            course?.chapters?.map((chapter, chapterIndex) => (
                                <AccordionItem
                                    key={chapter.id}
                                    value={chapter.id}
                                    className='not-last:border-0'
                                >
                                    <Card className='gap-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-md'>
                                        <AccordionTrigger className="py-0 hover:cursor-pointer hover:no-underline **:data-[slot='accordion-trigger-icon']:hidden">
                                            <CardContent className='hover:bg-muted/50 w-full p-6 transition-colors'>
                                                <div className='flex w-full items-center justify-between'>
                                                    <div className='flex items-center gap-4'>
                                                        <span className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full font-semibold'>
                                                            {chapterIndex + 1}
                                                        </span>
                                                        <div className='space-y-1 text-left'>
                                                            <h3 className='text-xl font-semibold'>{chapter.title}</h3>
                                                            <p className='text-muted-foreground text-sm'>
                                                                {chapter?.lessons?.length || 0}{' '}
                                                                {chapter?.lessons?.length > 1 ? 'Lessons' : 'Lesson'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-3'>
                                                        <Badge
                                                            variant='outline'
                                                            className='text-xs'
                                                        >
                                                            {chapter?.lessons?.length || 0}{' '}
                                                            {chapter?.lessons?.length ? 'Lessons' : 'Lesson'}
                                                        </Badge>
                                                        <IconChevronDown className='text-muted-foreground size-5' />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </AccordionTrigger>
                                        <AccordionContent className='pb-0'>
                                            <div className='bg-muted/20 border-t'>
                                                <div className='space-y-3 p-6 pt-4'>
                                                    {Array.isArray(chapter?.lessons) &&
                                                        chapter?.lessons?.map((lesson, lessonIndex) => (
                                                            <div
                                                                key={lesson.id}
                                                                className='hover:bg-accent flex items-center gap-4 rounded-lg p-3 transition-colors'
                                                            >
                                                                <div className='bg-background border-primary/20 flex size-8 items-center justify-center rounded-full border-2'>
                                                                    <IconPlayerPlay className='text-muted-foreground group-hover:text-primary size-4 transition-colors' />
                                                                </div>
                                                                <div className='flex-1 space-y-1'>
                                                                    <p className='text-sm font-medium'>
                                                                        {lesson.title}
                                                                    </p>
                                                                    <p className='text-muted-foreground text-xs'>
                                                                        Lesson {lessonIndex + 1}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            ))}
                    </Accordion>
                )}
            </div>
        </>
    )
}
