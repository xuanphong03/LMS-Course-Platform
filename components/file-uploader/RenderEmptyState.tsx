import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CloudUploadIcon } from 'lucide-react'

export default function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className='text-center'>
            <div className='bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full'>
                <CloudUploadIcon className={cn('text-muted-foreground size-6', isDragActive && 'text-primary')} />
            </div>
            <p className='text-foreground text-base font-semibold'>
                Drop your file here or <span className='text-primary cursor-pointer font-bold'>click to upload</span>
            </p>
            <Button
                type='button'
                className='mt-4'
            >
                Select file
            </Button>
        </div>
    )
}
