'use client'

import VideoPlayer from '@/app/dashboard/[slug]/[lessonId]/_components/VideoPlayer'
import { maskCompleteLesson } from '@/app/dashboard/[slug]/[lessonId]/actions'
import { LessonContentType } from '@/app/data/course/get-lesson-content'
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
export default function LessonContent({ data }: LessonContentProps) {
    const { triggerConfetti } = useConfetti()
    const [pending, startTransition] = useTransition()

    const handleToggleLessonCompletion = () => {
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
        <div className='bg-background flex h-full flex-col pl-6'>
            <VideoPlayer
                thumbnailKey={data.thumbnailKey ?? ''}
                videoKey={data.videoKey ?? ''}
            />
            <div className='border-b py-4'>
                {data.lessonProgress.length > 0 ? (
                    <Button
                        type='button'
                        variant='outline'
                        disabled={pending}
                        onClick={handleToggleLessonCompletion}
                        className='bg-green-500/10 text-green-500 hover:text-green-600'
                    >
                        <CheckCircleIcon className='mr-2 size-4 text-green-500' />
                        <span>Complete</span>
                    </Button>
                ) : (
                    <Button
                        type='button'
                        variant='outline'
                        disabled={pending}
                        onClick={handleToggleLessonCompletion}
                    >
                        <CheckCircleIcon className='mr-2 size-4 text-green-500' />
                        <span>Mark as Complete</span>
                    </Button>
                )}
            </div>
            <div className='space-y-3 pt-3'>
                <h1 className='text-muted-foreground text-3xl font-bold'>{data.title}</h1>
                {data.description && <RenderTextEditor json={JSON.parse(data.description)} />}
            </div>
        </div>
    )
}
