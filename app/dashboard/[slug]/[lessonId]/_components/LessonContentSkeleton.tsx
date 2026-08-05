import { Skeleton } from '@/components/ui/skeleton'

/**
 * Giữ cấu trúc và tỷ lệ chính của LessonContent để phần nội dung không bị nhảy
 * khi dữ liệu bài học được stream về từ Server Component.
 */
export default function LessonContentSkeleton() {
    return (
        <div className='bg-background flex min-h-full flex-col gap-6 px-4 py-4 sm:gap-8 sm:px-6 sm:py-6'>
            <Skeleton className='aspect-video w-full rounded-xl' />

            <div className='border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between'>
                <div className='space-y-2'>
                    <Skeleton className='h-3 w-24 rounded-md' />
                    <Skeleton className='h-9 w-64 rounded-md' />
                </div>
                <Skeleton className='h-10 w-full rounded-md sm:w-36' />
            </div>

            <div className='max-w-3xl space-y-3'>
                <div className='space-y-2 pt-1'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                    <Skeleton className='h-4 w-2/3' />
                </div>
            </div>
        </div>
    )
}
