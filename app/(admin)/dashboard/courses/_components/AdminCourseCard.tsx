import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { AdminCourseType } from '@/app/data/admin/admin-get-courses'
import { useConstruct } from '@/hooks/use-construct'
import Link from 'next/link'
import { ROUTES } from '@/consts/routes'
import {
    ArrowRightIcon,
    EyeIcon,
    MoreVerticalIcon,
    PencilIcon,
    SchoolIcon,
    TagIcon,
    TimerIcon,
    TrashIcon,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface iAppProps {
    data: AdminCourseType
    className?: string
}

export default function AdminCourseCard({ data, className }: iAppProps) {
    const thumbnailUrl = useConstruct(data.fileKey)

    return (
        <Card className={cn('group relative gap-0 py-0', className)}>
            {/* Absolute dropdown */}
            <div className='absolute top-2 right-2 z-5'>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                size='icon'
                                variant='secondary'
                            >
                                <MoreVerticalIcon className='size-4' />
                            </Button>
                        }
                    />
                    <DropdownMenuContent
                        align='end'
                        className='w-40'
                    >
                        <DropdownMenuItem render={<Link href={ROUTES.DASHBOARD_COURSES_EDIT(data.id)} />}>
                            <PencilIcon className='mr-2 size-4' /> Edit course
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href={ROUTES.COURSE_DETAIL(data.id)} />}>
                            <EyeIcon className='mr-2 size-4' /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={<Link href={ROUTES.DASHBOARD_COURSES_DELETE(data.id)} />}>
                            <TrashIcon className='text-destructive mr-2 size-4' /> Delete course
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Content */}
            <Link
                className='relative inline-block overflow-hidden rounded-t-lg after:absolute after:inset-0 after:bg-black/25 after:opacity-0 after:transition-opacity group-hover:after:opacity-100'
                href={ROUTES.DASHBOARD_COURSES_EDIT(data.id)}
            >
                <Image
                    alt={data.title}
                    src={thumbnailUrl || ''}
                    width={600}
                    height={400}
                    className='aspect-video h-full w-full object-cover transition-transform group-hover:scale-105'
                />
            </Link>

            <CardContent className='p-4'>
                <h4 className='group-hover:text-primary line-clamp-2 text-lg leading-snug font-medium transition-colors'>
                    <Link href={ROUTES.DASHBOARD_COURSES_EDIT(data.id)}>{data.title}</Link>
                </h4>
                <p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-snug'>{data.shortDescription}</p>
                <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2'>
                    <div className='flex items-center gap-x-2'>
                        <TagIcon className='text-primary bg-primary/10 size-6 rounded-md p-1' />
                        <span>{data.category}</span>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <SchoolIcon className='text-primary bg-primary/10 size-6 rounded-md p-1' />
                        <span>{data.level}</span>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <TimerIcon className='text-primary bg-primary/10 size-6 rounded-md p-1' />
                        <span>{data.duration}h</span>
                    </div>
                </div>
                <Link
                    href={ROUTES.DASHBOARD_COURSES_EDIT(data.id)}
                    className={buttonVariants({ className: 'mt-4 w-full' })}
                >
                    Edit course <ArrowRightIcon className='size-4' />
                </Link>
            </CardContent>
        </Card>
    )
}
