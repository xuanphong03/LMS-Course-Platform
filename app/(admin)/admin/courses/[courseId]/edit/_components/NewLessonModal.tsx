import { createLesson } from '@/app/(admin)/admin/courses/[courseId]/edit/actions'
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
import { lessonSchema, LessonSchemaType } from '@/schemas/lesson-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, PlusIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface NewLessonModalProps {
    courseId: string
    chapterId: string
}

/**
 * Quản lý dialog/form tạo lesson bên trong client graph của ChapterGroup.
 * Danh sách lesson vẫn lấy từ RSC snapshot để tránh duy trì thêm local collection.
 */
export default function NewLessonModal({ courseId, chapterId }: NewLessonModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: '',
            courseId: courseId,
            chapterId: chapterId,
            description: '',
            thumbnailKey: '',
            videoKey: '',
        },
    })

    const handleSubmitForm = (values: LessonSchemaType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createLesson(values))

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
                        type='button'
                        variant='outline'
                        className='w-full gap-2'
                    >
                        <PlusIcon className='size-4' /> <span>New Lesson</span>
                    </Button>
                }
            />

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Create new lesson</DialogTitle>
                    <DialogDescription>What would you like to name your lesson?</DialogDescription>
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
                        placeholder='Enter lesson name...'
                        control={form.control}
                    />

                    <DialogFooter>
                        <Button
                            type='submit'
                            disabled={pending}
                        >
                            {pending ? (
                                <>
                                    <span>Creating new lesson...</span> <LoaderIcon className='size-4 animate-spin' />
                                </>
                            ) : (
                                <span>Create new lesson</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
