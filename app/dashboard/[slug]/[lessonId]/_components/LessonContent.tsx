'use client'

import VideoPlayer from '@/app/dashboard/[slug]/[lessonId]/_components/VideoPlayer'
import { maskCompleteLesson } from '@/app/dashboard/[slug]/[lessonId]/actions'
import type { LessonContentType } from '@/app/data/course/get-lesson-content'
import RenderTextEditor from '@/components/rich-text-editor/RenderTextEditor'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { useConfetti } from '@/hooks/use-confetti'
import { CheckCircleIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface LessonContentProps {
    data: LessonContentType
}

/**
 * Client Component vì cần điều khiển video lesson, trạng thái pending và cập nhật
 * tiến độ học ngay trong tương tác của người dùng.
 */
export default function LessonContent({ data }: LessonContentProps) {
    const { triggerConfetti } = useConfetti()
    const [pending, startTransition] = useTransition()
    const isCompleted = data.lessonProgress.some((progress) => progress.completed)

    const handleMaskCompleteLesson = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                maskCompleteLesson({ lessonId: data.id, courseSlug: data.chapter.course.slug }),
            )

            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === 'success') {
                toast.success(result.message)
                triggerConfetti()
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <div className='bg-background flex min-h-full flex-col gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-6'>
            <VideoPlayer
                thumbnailKey={data.thumbnailKey ?? ''}
                videoKey={data.videoKey ?? ''}
            />
            <div className='border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between'>
                <div className='min-w-0'>
                    <p className='text-primary text-xs font-semibold tracking-[0.12em] uppercase'>Current lesson</p>
                    <h1 className='text-foreground mt-1 text-2xl leading-tight font-bold tracking-tight sm:text-3xl'>
                        {data.title}
                    </h1>
                </div>
                {isCompleted ? (
                    <Button
                        type='button'
                        variant='outline'
                        className='border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 w-full shrink-0 sm:w-auto'
                    >
                        <CheckCircleIcon className='mr-2 size-4' />
                        <span>Completed</span>
                    </Button>
                ) : (
                    <Button
                        type='button'
                        variant='outline'
                        disabled={pending}
                        onClick={handleMaskCompleteLesson}
                        className='w-full shrink-0 sm:w-auto'
                    >
                        <CheckCircleIcon className='text-primary mr-2 size-4' />
                        <span>Mark as Complete</span>
                    </Button>
                )}
            </div>
            <div className='prose prose-neutral dark:prose-invert max-w-3xl space-y-3 pb-8'>
                {data.description && <RenderTextEditor json={parseDescription(data.description)} />}
            </div>
        </div>
    )
}

function parseDescription(description: string) {
    try {
        return JSON.parse(description)
    } catch {
        // Một description lỗi không nên làm mất toàn bộ nội dung video của bài học.
        return { type: 'doc', content: [] }
    }
}
