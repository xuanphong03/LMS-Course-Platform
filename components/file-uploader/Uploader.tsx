'use client'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadedState,
    RenderUploadingState,
} from '@/components/file-uploader'

interface UploaderState {
    id: string | null
    file: File | null
    uploading: boolean
    progress: number
    key?: string
    isDeleting: boolean
    error: boolean
    objectUrl?: string
    fileType: 'image' | 'video'
}

interface UploaderProps {
    id: string
    value?: string
    onChange?: (value: string) => void
}
export default function Uploader({ id, value, onChange }: UploaderProps) {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: 'image',
        key: value,
    })

    const handleUploadFile = async (file: File) => {
        try {
            setFileState((prevState) => ({
                ...prevState,
                uploading: true,
                progress: 0,
            }))
            // 1. Get presigned URL
            const presignedResponse = await fetch('/api/s3/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            })

            if (!presignedResponse.ok) {
                const errorResponse = (await presignedResponse.json().catch(() => null)) as { message?: string } | null
                toast.error(errorResponse?.message ?? 'Failed to get presigned URL')
                setFileState((prevState) => ({ ...prevState, uploading: false, progress: 0, error: true }))
                return
            }

            const { presignedUrl, key } = (await presignedResponse.json()) as { presignedUrl: string; key: string }

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100
                        setFileState((prevState) => ({
                            ...prevState,
                            progress: Math.round(percentageCompleted),
                        }))
                    }
                }
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status == 204) {
                        setFileState((prevState) => ({
                            ...prevState,
                            progress: 100,
                            uploading: false,
                            key: key,
                        }))
                        onChange?.(key)
                        toast.success('File uploaded successfully 🎉')
                        resolve()
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`))
                    }
                }
                xhr.onerror = () => {
                    reject(new Error('Upload failed. Check Tigris CORS settings for PUT and Content-Type.'))
                }
                xhr.open('PUT', presignedUrl)
                xhr.setRequestHeader('Content-Type', file.type)
                xhr.send(file)
            })
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong')
            setFileState((prevState) => ({
                ...prevState,
                progress: 0,
                error: true,
                uploading: false,
            }))
        }
    }

    const handleOnDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return
            const file = acceptedFiles[0]

            if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                URL.revokeObjectURL(fileState.objectUrl)
            }

            setFileState((prevState) => ({
                ...prevState,
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: 'image',
            }))

            handleUploadFile(file)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fileState.objectUrl],
    )

    const handleOnDropRejected = useCallback((fileRejections: FileRejection[]) => {
        console.log(fileRejections)
        if (!fileRejections.length) return
        const tooManyFiles = fileRejections.find((rejection) => rejection.errors[0].code === 'too-many-files')
        const fileSizeTooBig = fileRejections.find((rejection) => rejection.errors[0].code === 'file-too-large')

        if (tooManyFiles) {
            toast.error('Too many files are selected, max is 1 file')
        }

        if (fileSizeTooBig) {
            toast.error('File size exceeds the limit')
        }
    }, [])

    const handleRemoveFile = async () => {
        if (fileState.isDeleting || !fileState.objectUrl) return

        try {
            setFileState((prevState) => ({
                ...prevState,
                isDeleting: true,
            }))

            const response = await fetch('/api/s3/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: fileState.key }),
            })

            if (!response.ok) {
                toast.error('Failed to remove file from storage')

                setFileState((prevState) => ({
                    ...prevState,
                    isDeleting: true,
                    error: true,
                }))

                return
            }

            if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                URL.revokeObjectURL(fileState.objectUrl)
            }

            onChange?.('')

            setFileState(() => ({
                file: null,
                uploading: false,
                progress: 0,
                objectUrl: undefined,
                error: false,
                fileType: 'image',
                id: null,
                isDeleting: false,
            }))

            toast.success('File removed successfully')
        } catch {
            toast.error('Error removing file. Please try again')
            setFileState((prev) => ({
                ...prev,
                isDeleting: false,
                error: true,
            }))
        }
    }

    const handleRenderContent = (isDragActive: boolean) => {
        if (fileState.uploading) {
            return (
                <RenderUploadingState
                    progress={fileState.progress}
                    file={fileState.file as File}
                />
            )
        }
        if (fileState.error) {
            return <RenderErrorState />
        }
        if (fileState.objectUrl) {
            return (
                <RenderUploadedState
                    previewUrl={fileState.objectUrl}
                    isDeleting={fileState.isDeleting}
                    onRemoveFile={handleRemoveFile}
                />
            )
        }
        return <RenderEmptyState isDragActive={isDragActive} />
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => handleOnDrop(acceptedFiles),
        onDropRejected: handleOnDropRejected,
        accept: { 'image/*': [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 1024 * 1024, // 1 Mb calculation
        disabled: fileState.uploading || !!fileState.objectUrl,
    })

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                URL.revokeObjectURL(fileState.objectUrl)
            }
        }
    }, [fileState.objectUrl])

    return (
        <Card
            {...getRootProps()}
            className={cn(
                'relative h-64 w-full rounded-md border-2 border-dashed ring-0 transition-colors duration-200 ease-in-out outline-none',
                isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary',
            )}
        >
            <CardContent className='flex h-full flex-col items-center justify-center'>
                <input
                    id={id}
                    {...getInputProps()}
                />
                {handleRenderContent(isDragActive)}
            </CardContent>
        </Card>
    )
}
