'use client'

import { deleteChapter } from '@/app/(admin)/admin/courses/[courseId]/edit/actions'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface DeleteChapterProps {
    courseId: string
    chapterId: string
}

export default function DeleteChapter({ courseId, chapterId }: DeleteChapterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    const handleDeleteChapter = async () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteChapter({ courseId, chapterId }))
            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }
            if (result.status === 'success') {
                toast.success(result.message)
                setIsOpen(false)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <AlertDialogTrigger
                render={
                    <Button
                        size='icon'
                        type='button'
                        variant='outline'
                    >
                        <TrashIcon className='size-4' />
                    </Button>
                }
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this chapter
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        type='button'
                        disabled={pending}
                        onClick={handleDeleteChapter}
                    >
                        {pending ? (
                            <>
                                <span>Deleting</span> <LoaderIcon className='size-4 animate-spin' />
                            </>
                        ) : (
                            <span>Delete</span>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
