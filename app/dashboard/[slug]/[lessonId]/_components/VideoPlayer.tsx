'use client'

import { useConstruct } from '@/hooks/use-construct'
import { VideoOffIcon } from 'lucide-react'

interface VideoPlayerProps {
    thumbnailKey: string
    videoKey: string
}

export default function VideoPlayer({ thumbnailKey, videoKey }: VideoPlayerProps) {
    const thumbnailUrl = useConstruct(thumbnailKey)
    const videoUrl = useConstruct(videoKey)

    if (!videoKey) {
        return (
            <div className='bg-muted flex aspect-video flex-col items-center justify-center rounded-lg'>
                <VideoOffIcon className='text-muted-foreground mx-auto mb-4 size-16' />
                <p className='text-muted-foreground'>This lesson does not have a video yet</p>
            </div>
        )
    }
    return (
        <div className='relative aspect-video overflow-hidden rounded-lg bg-black'>
            <video
                className='h-full w-full object-cover'
                controls
                poster={thumbnailUrl}
                controlsList='nodownload'
                preload='metadata'
            >
                <source
                    src={videoUrl}
                    type='video/mp4'
                />
                <source
                    src={videoUrl}
                    type='video/webm'
                />
                <source
                    src={videoUrl}
                    type='video/ogg'
                />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}
