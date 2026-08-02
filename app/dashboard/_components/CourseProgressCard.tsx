'use client'
import { EnrolledCourseType } from '@/app/data/user/get-enrolled-courses'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/consts/routes'
import { useConstruct } from '@/hooks/use-construct'
import useCourseProgress from '@/hooks/use-course-progress'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface CourseProgressCardProps {
    data: EnrolledCourseType['course']
    className?: string
}

export default function CourseProgressCard({ data, className }: CourseProgressCardProps) {
    const thumbnailUrl = useConstruct(data.fileKey) ?? ''
    const { totalLessons, completedLessons, progressPercentage } = useCourseProgress({ courseData: data })

    return (
        <article className={cn('group', className)}>
            <Card className='relative h-full gap-0 py-0'>
                <Badge className='absolute top-2 right-2 z-10'>{data.level}</Badge>
                <Link
                    href={ROUTES.USER_DASHBOARD_COURSE_DETAIL(data.slug)}
                    className='relative inline-block aspect-video overflow-hidden rounded-t-xl'
                >
                    <Image
                        alt={data?.title}
                        width={600}
                        height={400}
                        src={thumbnailUrl}
                        className='h-full w-full object-cover transition-transform group-hover:scale-105'
                    />
                    <div className='absolute top-0 left-0 h-full w-full bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100'></div>
                </Link>
                <CardContent className='flex flex-1 flex-col justify-between p-4'>
                    <div>
                        <h4>
                            <Link
                                className='group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline'
                                href={ROUTES.USER_DASHBOARD_COURSE_DETAIL(data.slug)}
                            >
                                {data?.title}
                            </Link>
                        </h4>
                        <p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight'>
                            {data?.shortDescription}
                        </p>

                        <div className='mt-5 space-y-4'>
                            <div className='mb-1 flex items-center justify-between text-sm'>
                                <span>Progress:</span>
                                <p className='font-medium'>{progressPercentage}%</p>
                            </div>
                            <Progress
                                value={progressPercentage}
                                className='h-1.5'
                            />
                            <p className='text-muted-foreground text-xs'>
                                {completedLessons} of {totalLessons} lessons completed
                            </p>
                        </div>
                    </div>
                    <Link
                        href={ROUTES.USER_DASHBOARD_COURSE_DETAIL(data.slug)}
                        className={buttonVariants({ className: 'mt-4 w-full capitalize' })}
                    >
                        Learn more
                    </Link>
                </CardContent>
            </Card>
        </article>
    )
}

export function DashboardCourseCardSkeleton() {
    return (
        <Card className='group relative gap-0 py-0'>
            <div className='absolute top-2 right-2 z-10 flex items-center'>
                <Skeleton className='h-6 w-20 rounded-full' />
            </div>

            <div className='relative h-fit w-full'>
                <Skeleton className='aspect-video w-full rounded-t-xl' />
            </div>

            <CardContent className='p-4'>
                <div className='space-y-2'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-3/4' />
                </div>
                <div className='mt-4 flex items-center gap-x-5'>
                    <div className='flex items-center gap-x-2'>
                        <Skeleton className='size-6 rounded-md' />
                        <Skeleton className='h-4 w-8' />
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <Skeleton className='size-6 rounded-md' />
                        <Skeleton className='h-4 w-8' />
                    </div>
                </div>
                <Skeleton className='mt-4 h-10 w-full rounded-md' />
            </CardContent>
        </Card>
    )
}
