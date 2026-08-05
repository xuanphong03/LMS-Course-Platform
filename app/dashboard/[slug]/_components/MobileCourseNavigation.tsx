'use client'

import CourseSidebar from '@/app/dashboard/[slug]/_components/CourseSidebar'
import type { CourseSidebarDataType } from '@/app/data/course/get-course-sidebar-data'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ListIcon } from 'lucide-react'

interface MobileCourseNavigationProps {
    course: CourseSidebarDataType['course']
}

/**
 * Đưa curriculum vào sheet trên mobile để nội dung bài học được ưu tiên toàn
 * chiều rộng, nhưng người học vẫn có thể chuyển bài mà không cần quay lại.
 */
export default function MobileCourseNavigation({ course }: MobileCourseNavigationProps) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button
                        variant='outline'
                        className='h-auto w-full justify-between rounded-xl px-3 py-2.5 text-left'
                    />
                }
            >
                <span className='flex min-w-0 items-center gap-3'>
                    <span className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
                        <ListIcon className='size-4' />
                    </span>
                    <span className='min-w-0'>
                        <span className='text-muted-foreground block text-[10px] font-semibold tracking-[0.12em] uppercase'>
                            Course outline
                        </span>
                        <span className='mt-0.5 block truncate text-sm font-semibold'>{course.title}</span>
                    </span>
                </span>
                <span className='text-muted-foreground text-xs'>Browse lessons</span>
            </SheetTrigger>
            <SheetContent
                side='left'
                className='w-[min(90vw,22rem)] gap-0 p-0'
            >
                <SheetHeader className='border-border border-b pr-12'>
                    <SheetTitle>Course outline</SheetTitle>
                    <SheetDescription>Choose a lesson to continue learning.</SheetDescription>
                </SheetHeader>
                <div className='min-h-0 flex-1 overflow-y-auto p-4'>
                    <CourseSidebar course={course} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
