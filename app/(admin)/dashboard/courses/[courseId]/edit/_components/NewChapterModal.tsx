'use client'
import { createChapter } from '@/app/(admin)/dashboard/courses/[courseId]/edit/actions'
import RHFInputField from '@/components/forms/RHFInputField'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { tryCatch } from '@/hooks/try-catch'
import { chapterSchema, ChapterSchemaType } from '@/schemas/chapter-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, PlusIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface NewChapterModalProps {
    courseId: string
}

/**
 * Client island độc lập cho dialog và form state; Server Action chịu trách nhiệm
 * mutation và trả RSC payload mới nên component không tự quản lý danh sách chapter.
 */
export default function NewChapterModal({ courseId }: NewChapterModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: '',
            courseId: courseId,
        },
    })

    const handleSubmitForm = (values: ChapterSchemaType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createChapter(values))

            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === 'success') {
                toast.success(result.message)
                form.reset()
                setIsOpen(false)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    form.reset()
                }
                setIsOpen(open)
            }}
        >
            <DialogTrigger
                render={
                    <Button
                        size='sm'
                        type='button'
                        variant='outline'
                        className='gap-2'
                    >
                        <PlusIcon className='size-4' /> <span>New Chapter</span>
                    </Button>
                }
            />

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Create new chapter</DialogTitle>
                    <DialogDescription>What would you like to name your chapter?</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                    className='space-y-4'
                >
                    <RHFInputField
                        isRequired
                        id='name'
                        name='name'
                        label='Name'
                        placeholder='Enter chapter name...'
                        control={form.control}
                    />

                    <DialogFooter>
                        <Button
                            type='submit'
                            disabled={pending}
                        >
                            {pending ? (
                                <>
                                    <span>Creating new chapter...</span> <LoaderIcon className='size-4 animate-spin' />
                                </>
                            ) : (
                                <span>Create new chapter</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
