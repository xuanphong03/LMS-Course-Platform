import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LoaderIcon, XIcon } from 'lucide-react'
import Image from 'next/image'

interface RenderUploadedStateProps {
    previewUrl: string
    isDeleting: boolean
    onRemoveFile: () => void
    fileType: 'image' | 'video'
}

export default function RenderUploadedState({
    previewUrl,
    isDeleting,
    onRemoveFile,
    fileType,
}: RenderUploadedStateProps) {
    return (
        <div className='group relative flex h-full w-full items-center justify-center'>
            {fileType === 'image' ? (
                <Image
                    alt='Uploaded file'
                    src={previewUrl}
                    fill
                    className='object-contain p-2'
                />
            ) : (
                <video
                    controls
                    src={previewUrl}
                    className='h-full w-full rounded-md'
                />
            )}
            <Button
                size='icon'
                variant='destructive'
                className={cn('absolute top-4 right-4')}
                onClick={() => {
                    if (!onRemoveFile) return
                    onRemoveFile()
                }}
                disabled={isDeleting}
            >
                {isDeleting ? <LoaderIcon className='size-4 animate-spin' /> : <XIcon className='size-4' />}
            </Button>
        </div>
    )
}
