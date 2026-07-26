'use client'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadedState,
    RenderUploadingState,
} from '@/components/file-uploader'
import { ENDPOINTS } from '@/consts/endpoints'
import { useConstruct } from '@/hooks/use-construct'

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
    fileTypeAccepted: 'image' | 'video'
}
export default function Uploader({ id, value, onChange, fileTypeAccepted = 'image' }: UploaderProps) {
    const fileUrl = useConstruct(value || '')
    const uploadAbortControllerRef = useRef<AbortController | null>(null)
    const deleteAbortControllerRef = useRef<AbortController | null>(null)
    const xhrRef = useRef<XMLHttpRequest | null>(null)
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: fileTypeAccepted,
        key: value,
        objectUrl: value ? fileUrl : undefined,
    })

    const handleUploadFile = useCallback(
        async (file: File) => {
            const abortController = new AbortController()
            uploadAbortControllerRef.current?.abort()
            xhrRef.current?.abort()
            uploadAbortControllerRef.current = abortController

            try {
                setFileState((prevState) => ({
                    ...prevState,
                    uploading: true,
                    progress: 0,
                }))
                // 1. Get presigned URL
                const presignedResponse = await fetch(ENDPOINTS.UPLOAD_FILE_S3, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                        isImage: fileTypeAccepted === 'image',
                    }),
                    signal: abortController.signal,
                })

                if (!presignedResponse.ok) {
                    const errorResponse = (await presignedResponse.json().catch(() => null)) as {
                        message?: string
                    } | null
                    toast.error(errorResponse?.message ?? 'Failed to get presigned URL')
                    setFileState((prevState) => ({
                        ...prevState,
                        uploading: false,
                        progress: 0,
                        error: true,
                        objectUrl: undefined,
                    }))

                    if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                        URL.revokeObjectURL(fileState.objectUrl)
                    }

                    return
                }

                const { presignedUrl, key } = (await presignedResponse.json()) as { presignedUrl: string; key: string }

                await new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhrRef.current = xhr
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
                        xhrRef.current = null
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
                        xhrRef.current = null
                        reject(new Error('Upload failed. Check Tigris CORS settings for PUT and Content-Type.'))
                    }
                    xhr.onabort = () => {
                        xhrRef.current = null
                        reject(new DOMException('Upload aborted', 'AbortError'))
                    }
                    xhr.open('PUT', presignedUrl)
                    xhr.setRequestHeader('Content-Type', file.type)
                    xhr.send(file)
                })
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return

                toast.error(error instanceof Error ? error.message : 'Something went wrong')
                setFileState((prevState) => ({
                    ...prevState,
                    progress: 0,
                    error: true,
                    uploading: false,
                    objectUrl: undefined,
                }))

                if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                    URL.revokeObjectURL(fileState.objectUrl)
                }
            } finally {
                if (uploadAbortControllerRef.current === abortController) {
                    uploadAbortControllerRef.current = null
                }
            }
        },
        [fileState.objectUrl, fileTypeAccepted, onChange],
    )

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
                fileType: fileTypeAccepted,
            }))

            handleUploadFile(file)
        },
        [fileState.objectUrl, fileTypeAccepted, handleUploadFile],
    )

    const handleOnDropRejected = useCallback((fileRejections: FileRejection[]) => {
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

        const abortController = new AbortController()
        deleteAbortControllerRef.current?.abort()
        deleteAbortControllerRef.current = abortController

        try {
            setFileState((prevState) => ({
                ...prevState,
                isDeleting: true,
            }))

            const response = await fetch(ENDPOINTS.DELETE_FILE_S3, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: fileState.key }),
                signal: abortController.signal,
            })

            if (!response.ok) {
                toast.error('Failed to remove file from storage')

                setFileState((prevState) => ({
                    ...prevState,
                    isDeleting: false,
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
                fileType: fileTypeAccepted,
                id: null,
                isDeleting: false,
            }))

            toast.success('File removed successfully')
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return

            toast.error('Error removing file. Please try again')
            setFileState((prev) => ({
                ...prev,
                isDeleting: false,
                error: true,
            }))
        } finally {
            if (deleteAbortControllerRef.current === abortController) {
                deleteAbortControllerRef.current = null
            }
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
                    fileType={fileState.fileType}
                />
            )
        }
        return <RenderEmptyState isDragActive={isDragActive} />
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => handleOnDrop(acceptedFiles),
        onDropRejected: handleOnDropRejected,
        accept: fileTypeAccepted === 'image' ? { 'image/*': [] } : { 'video/*': [] },
        maxFiles: 1,
        multiple: false,
        maxSize: fileTypeAccepted === 'image' ? 1024 * 1024 : 5 * 1024 * 1024, // 1Mb calculation with image and 5Mb with video
        disabled: fileState.uploading || !!fileState.objectUrl,
    })

    useEffect(() => {
        return () => {
            // Preview có thể đổi trước khi request kết thúc; hủy cả request và XHR
            // để callback không tiếp tục giữ File/state sau vòng đời hiện tại.
            uploadAbortControllerRef.current?.abort()
            deleteAbortControllerRef.current?.abort()
            xhrRef.current?.abort()
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
