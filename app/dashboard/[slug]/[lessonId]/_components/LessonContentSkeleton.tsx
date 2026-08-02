import { Skeleton } from '@/components/ui/skeleton'

/**
 * Giữ cấu trúc và tỷ lệ chính của LessonContent để phần nội dung không bị nhảy
 * khi dữ liệu bài học được stream về từ Server Component.
 */
export default function LessonContentSkeleton() {
    return (
        <div className='bg-background flex h-full flex-col pl-6'>
            <Skeleton className='aspect-video w-full rounded-lg' />

            <div className='border-b py-4'>
                <Skeleton className='h-10 w-36 rounded-md' />
            </div>

            <div className='space-y-3 pt-3'>
                <Skeleton className='h-9 w-3/4' />

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
