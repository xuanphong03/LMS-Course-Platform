import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'

export default function RenderErrorState() {
    return (
        <div className='text-center'>
            <div className='bg-destructive/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full'>
                <ImageIcon className='text-destructive size-6' />
            </div>
            <p className='text-foreground text-base font-semibold'>File upload failed</p>
            <p className='text-foreground text-base font-semibold'>Something went wrong</p>
            <Button
                type='button'
                className='mt-4'
            >
                Retry file selection
            </Button>
        </div>
    )
}
