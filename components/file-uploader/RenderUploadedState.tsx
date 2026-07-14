import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LoaderIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface RenderUploadedStateProps {
    previewUrl: string
    isDeleting: boolean
    onRemoveFile: () => void
}

export default function RenderUploadedState({ previewUrl, isDeleting, onRemoveFile }: RenderUploadedStateProps) {
    return (
        <div>
            <Image
                alt='Uploaded file'
                src={previewUrl}
                fill
                className='object-contain p-2'
            />
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
