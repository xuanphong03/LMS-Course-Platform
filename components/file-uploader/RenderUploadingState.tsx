interface RenderUploadingStateProps {
    progress: number
    file: File
}

export default function RenderUploadingState({ progress, file }: RenderUploadingStateProps) {
    return (
        <div className='flex flex-col items-center justify-center text-center'>
            <p className='text-foreground mt-2 text-sm font-medium'>Uploading... {progress}%</p>
            <p className='text-foreground mt-1 max-w-xs truncate text-sm'>{file.name}</p>
        </div>
    )
}
