'use client'
import LessonItem from '@/app/dashboard/[slug]/_components/LessonItem'
import { CourseSidebarDataType } from '@/app/data/course/get-course-sidebar-data'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import useCourseProgress from '@/hooks/use-course-progress'
import { ChevronDownIcon, PlayIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface CourseSidebarProps {
    course: CourseSidebarDataType['course']
}

export default function CourseSidebar({ course }: CourseSidebarProps) {
    const pathname = usePathname()
    const currentLessonId = pathname.split('/').pop()
    const { totalLessons, completedLessons, progressPercentage } = useCourseProgress({ courseData: course })

    return (
        <aside className='flex h-full flex-col'>
            <div className='border-border border-b pr-4 pb-4'>
                <div className='mb-3 flex items-center gap-3'>
                    <div className='bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg'>
                        <PlayIcon className='text-primary size-6' />
                    </div>

                    <div className='min-w-0 flex-1'>
                        <h1 className='truncate text-base leading-tight font-semibold'>{course.title}</h1>
                        <p className='text-muted-foreground mt-1 text-xs'>{course.category}</p>
                    </div>
                </div>
                <div className='space-y-2'>
                    <div className='flex justify-between text-xs'>
                        <span className='text-muted-foreground'>Progress</span>
                        <span className='font-medium'>
                            {completedLessons}/{totalLessons} Lessons
                        </span>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className='h-1.5'
                    />
                    <p className='text-muted-foreground text-xs'>{progressPercentage}% Completed</p>
                </div>
            </div>

            <div className='space-y-3 py-4 pr-4'>
                {course.chapters.map((chapter, index) => (
                    <Collapsible
                        key={chapter.id}
                        defaultOpen={index === 0}
                    >
                        <CollapsibleTrigger
                            render={
                                <Button
                                    variant='outline'
                                    className='flex h-auto w-full items-center gap-2 p-3'
                                />
                            }
                        >
                            <div className='shrink-0'>
                                <ChevronDownIcon className='text-primary size-4' />
                            </div>
                            <div className='min-w-0 flex-1 text-left'>
                                <p className='text-foreground line-clamp-1 truncate text-sm font-semibold'>
                                    Chapter {chapter.position + 1}: {chapter.title}
                                </p>
                                <p className='text-muted-foreground truncate text-xs font-medium'>
                                    {chapter.lessons.length} lessons
                                </p>
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className='mt-3 space-y-3 border-l-2 pl-6'>
                            {chapter.lessons.map((lesson) => (
                                <LessonItem
                                    key={lesson.id}
                                    lesson={lesson}
                                    slug={course.slug}
                                    isActive={lesson.id === currentLessonId}
                                    isCompleted={
                                        lesson.lessonProgress.find((progress) => progress.lessonId === lesson.id)
                                            ?.completed || false
                                    }
                                />
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </aside>
    )
}
