import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { cn } from '@/lib/utils'
import { CheckIcon, PlayIcon } from 'lucide-react'
import Link from 'next/link'

interface LessonItemProps {
    lesson: {
        id: string
        title: string
        position: number
        description: string | null
    }
    slug: string
    isActive?: boolean
    isCompleted?: boolean
}

export default function LessonItem({ lesson, slug, isActive, isCompleted }: LessonItemProps) {
    return (
        <Link
            href={ROUTES.USER_DASHBOARD_LESSON_DETAIL(slug, lesson.id)}
            className={buttonVariants({
                variant: isCompleted ? 'secondary' : 'outline',
                className: cn(
                    'h-auto w-full justify-start p-2.5 transition-all',
                    isCompleted &&
                        'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 dark:border-green-700 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50',
                    isActive &&
                        !isCompleted &&
                        'bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary',
                ),
            })}
        >
            <div className='flex w-full min-w-0 items-center gap-2.5'>
                <div className='shrink-0'>
                    {isCompleted ? (
                        <div
                            className={cn(
                                'flex size-5 items-center justify-center rounded-full bg-green-600 dark:bg-green-600',
                            )}
                        >
                            <CheckIcon className={cn('size-2.5 text-white')} />
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'bg-background flex size-5 items-center justify-center rounded-full border-2',
                                isActive
                                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                                    : 'border-muted-foreground',
                            )}
                        >
                            <PlayIcon
                                className={cn(
                                    'size-2.5 fill-current',
                                    isActive ? 'text-primary' : 'text-muted-foreground',
                                )}
                            />
                        </div>
                    )}
                </div>
                <div className='min-w-0 flex-1 text-left'>
                    <p
                        className={cn(
                            'w-full truncate text-xs font-medium',
                            isCompleted
                                ? 'text-green-800 dark:text-green-200'
                                : isActive
                                  ? 'text-primary font-semibold'
                                  : 'text-foreground',
                        )}
                    >
                        {lesson.position + 1}. {lesson.title}
                    </p>
                    {isCompleted && (
                        <span className='text-xs font-medium text-green-700 dark:text-green-300'>Completed</span>
                    )}
                    {isActive && !isCompleted && (
                        <span className='text-primary text-xs font-medium'>Currently Watching</span>
                    )}
                </div>
            </div>
        </Link>
    )
}
