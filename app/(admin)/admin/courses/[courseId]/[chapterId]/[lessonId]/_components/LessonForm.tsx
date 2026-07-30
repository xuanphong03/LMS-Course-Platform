'use client'

import { updateLesson } from '@/app/(admin)/admin/courses/[courseId]/[chapterId]/[lessonId]/actions'
import { AdminLessonType } from '@/app/data/admin/admin-get-lesson'
import RHFFileUploader from '@/components/forms/RHFFileUploader'
import RHFInputField from '@/components/forms/RHFInputField'
import RichTextEditor from '@/components/rich-text-editor/RichTextEditor'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { ROUTES } from '@/consts/routes'
import { tryCatch } from '@/hooks/try-catch'
import { lessonSchema, LessonSchemaType } from '@/schemas/lesson-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, LoaderIcon } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ILessonFormProps {
    data: AdminLessonType
    courseId: string
    chapterId: string
}

export default function LessonForm({ data, courseId, chapterId }: ILessonFormProps) {
    const [pending, startTransition] = useTransition()

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: data.title,
            courseId: courseId,
            chapterId: chapterId,
            description: data.description ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
            videoKey: data.videoKey ?? undefined,
        },
    })

    const handleSubmitForm = (values: LessonSchemaType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(updateLesson({ data: values, lessonId: data.id }))

            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === 'success') {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <div>
            <Link
                href={ROUTES.ADMIN_COURSES_EDIT(courseId)}
                className={buttonVariants({ variant: 'outline', className: 'mb-6' })}
            >
                <ArrowLeftIcon /> <span>Back</span>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson configuration</CardTitle>
                    <CardDescription>Configure the video and description for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(handleSubmitForm)}
                        className='space-y-6'
                    >
                        <RHFInputField
                            isRequired
                            id='name'
                            name='name'
                            label='Lesson name'
                            placeholder='Enter lesson name...'
                            control={form.control}
                        />
                        <Controller
                            name='description'
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='description'>Description</FieldLabel>
                                    <RichTextEditor
                                        id='description'
                                        name={field.name}
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        invalid={fieldState.invalid}
                                        placeholder='Write lesson description...'
                                    />
                                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                </Field>
                            )}
                        />
                        <RHFFileUploader
                            isRequired
                            id='thumbnailKey'
                            name='thumbnailKey'
                            label='Thumbnail file'
                            control={form.control}
                        />

                        <RHFFileUploader
                            isRequired
                            id='videoKey'
                            name='videoKey'
                            label='Video file'
                            fileType='video'
                            control={form.control}
                        />

                        <Button
                            type='submit'
                            disabled={pending}
                        >
                            {pending ? (
                                <>
                                    <span>Updating lesson...</span> <LoaderIcon className='size-4 animate-spin' />
                                </>
                            ) : (
                                <span>Update lesson</span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
