import { PublicCourseDetailType } from '@/app/data/course/get-singular-course'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import RenderTextEditor from '@/components/rich-text-editor/RenderTextEditor'
import { env } from '@/lib/env'
import { IconBook2, IconChartBar, IconClock, IconPlayerPlay, IconSparkles } from '@tabler/icons-react'
import type { JSONContent } from '@tiptap/react'
import Image from 'next/image'

interface CourseInformationProps {
    course: NonNullable<PublicCourseDetailType>
}

/**
 * Hiển thị phần nội dung chính của khóa học theo thứ tự người học cần biết:
 * hình ảnh và giá trị khóa học → thông tin nhanh → mô tả → curriculum.
 */
export default function CourseInformation({ course }: CourseInformationProps) {
    const courseThumbnail = course.fileKey
        ? `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${course.fileKey}`
        : ''
    const totalChapters = course.chapters.length
    const totalLessons = course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
    const descriptionContent = parseDescription(course.description)

    return (
        <div className='space-y-14'>
            <section className='space-y-8'>
                <div className='border-border/70 bg-card shadow-primary/5 relative overflow-hidden rounded-4xl border shadow-xl'>
                    <Image
                        priority
                        width={1200}
                        height={800}
                        src={courseThumbnail}
                        alt={course.title}
                        className='aspect-video w-full object-cover'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent' />
                    <div className='absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4 sm:right-7 sm:bottom-7 sm:left-7'>
                        <div>
                            <p className='text-xs font-semibold text-white/70'>Course preview</p>
                            <p className='mt-1 text-lg font-semibold text-white sm:text-xl'>
                                Build a skill that stays with you.
                            </p>
                        </div>
                        <div className='hidden size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-sm sm:flex'>
                            <IconPlayerPlay className='size-5 fill-current' />
                        </div>
                    </div>
                </div>

                <div className='space-y-5'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <Badge className='rounded-full px-3 py-1'>{course.category}</Badge>
                        <Badge
                            variant='outline'
                            className='rounded-full px-3 py-1'
                        >
                            {course.level}
                        </Badge>
                    </div>
                    <h1 className='max-w-4xl text-4xl leading-[1.05] font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl'>
                        {course.title}
                    </h1>
                    <p className='text-muted-foreground max-w-3xl text-lg leading-8'>{course.shortDescription}</p>
                </div>

                <div className='border-border/70 bg-border/60 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4'>
                    <CourseStat
                        icon={<IconClock className='size-5' />}
                        label='Duration'
                        value={`${course.duration} ${course.duration === 1 ? 'hour' : 'hours'}`}
                    />
                    <CourseStat
                        icon={<IconBook2 className='size-5' />}
                        label='Lessons'
                        value={`${totalLessons} ${totalLessons === 1 ? 'lesson' : 'lessons'}`}
                    />
                    <CourseStat
                        icon={<IconChartBar className='size-5' />}
                        label='Level'
                        value={course.level}
                    />
                    <CourseStat
                        icon={<IconSparkles className='size-5' />}
                        label='Format'
                        value='Self-paced'
                    />
                </div>
            </section>

            {descriptionContent ? (
                <section className='max-w-3xl space-y-5'>
                    <div>
                        <p className='text-primary text-sm font-semibold'>The learning path</p>
                        <h2 className='mt-2 text-3xl font-bold tracking-tight sm:text-4xl'>A clearer way forward.</h2>
                    </div>
                    <div className='text-muted-foreground leading-8'>
                        <RenderTextEditor json={descriptionContent} />
                    </div>
                </section>
            ) : null}

            {totalChapters > 0 ? (
                <section className='space-y-6'>
                    <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
                        <div>
                            <p className='text-primary text-sm font-semibold'>Inside the course</p>
                            <h2 className='mt-2 text-3xl font-bold tracking-tight sm:text-4xl'>
                                Follow the curriculum.
                            </h2>
                        </div>
                        <p className='text-muted-foreground text-sm'>
                            {totalChapters} {totalChapters === 1 ? 'chapter' : 'chapters'} · {totalLessons}{' '}
                            {totalLessons === 1 ? 'lesson' : 'lessons'}
                        </p>
                    </div>

                    <Accordion
                        multiple
                        className='gap-3'
                        defaultValue={[course.chapters[0].id]}
                    >
                        {course.chapters.map((chapter, chapterIndex) => (
                            <AccordionItem
                                key={chapter.id}
                                value={chapter.id}
                                className='border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm'
                            >
                                <AccordionTrigger className='px-5 py-5 hover:no-underline sm:px-6'>
                                    <div className='flex min-w-0 items-center gap-4 pr-4'>
                                        <span className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold'>
                                            {String(chapterIndex + 1).padStart(2, '0')}
                                        </span>
                                        <span className='flex-1 text-left'>
                                            <span className='text-foreground block text-base font-semibold sm:text-lg'>
                                                {chapter.title}
                                            </span>
                                            <span className='text-muted-foreground mt-1 block text-xs'>
                                                {chapter.lessons.length}{' '}
                                                {chapter.lessons.length === 1 ? 'lesson' : 'lessons'}
                                            </span>
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className='pb-0'>
                                    <div className='border-border/70 bg-muted/20 border-t px-5 py-4 sm:px-6'>
                                        <div className='space-y-2'>
                                            {chapter.lessons.map((lesson, lessonIndex) => (
                                                <div
                                                    key={lesson.id}
                                                    className='group hover:bg-background flex items-center gap-3 rounded-xl px-3 py-3 transition-colors'
                                                >
                                                    <span className='bg-background border-border/70 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold'>
                                                        {String(lessonIndex + 1).padStart(2, '0')}
                                                    </span>
                                                    <span className='text-foreground flex-1 text-sm font-medium'>
                                                        {lesson.title}
                                                    </span>
                                                    <IconPlayerPlay className='text-muted-foreground group-hover:text-primary size-4 transition-colors' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            ) : null}
        </div>
    )
}

function parseDescription(description: string): JSONContent | null {
    try {
        return JSON.parse(description) as JSONContent
    } catch {
        // Không để một description cũ hoặc bị lỗi làm hỏng toàn bộ trang detail khóa học.
        return null
    }
}

function CourseStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className='bg-card flex min-w-0 flex-col gap-2 px-4 py-4 sm:px-5'>
            <span className='text-primary'>{icon}</span>
            <span className='text-muted-foreground text-xs'>{label}</span>
            <span className='text-foreground truncate text-sm font-semibold capitalize'>{value}</span>
        </div>
    )
}
