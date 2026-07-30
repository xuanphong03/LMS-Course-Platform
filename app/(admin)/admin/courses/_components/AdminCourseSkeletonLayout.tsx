import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminCourseSkeletonLayout() {
    return (
        <div
            aria-busy='true'
            className='grid grid-cols-1 gap-8 sm:grid-cols-2'
        >
            {Array.from({ length: 4 }, (_, index) => (
                <AdminCourseSkeletonCard key={index} />
            ))}
        </div>
    )
}

export function AdminCourseSkeletonCard() {
    return (
        <Card className='group relative gap-0 overflow-hidden py-0'>
            <div className='relative'>
                <Skeleton className='aspect-video h-full w-full rounded-none rounded-t-lg' />
                <Skeleton className='absolute top-2 right-2 size-9 rounded-md' />
            </div>

            <CardContent className='p-4'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='mt-2 h-10 w-full' />

                <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2'>
                    <Skeleton className='h-6 w-24' />
                    <Skeleton className='h-6 w-24' />
                    <Skeleton className='h-6 w-20' />
                </div>

                <Skeleton className='mt-4 h-10 w-full' />
            </CardContent>
        </Card>
    )
}
