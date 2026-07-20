'use client'

import slugify from 'slugify'
import { editCourse } from '@/app/(admin)/dashboard/courses/[courseId]/edit/actions'
import RHFFileUploader from '@/components/forms/RHFFileUploader'
import RHFInputField from '@/components/forms/RHFInputField'
import RHFSelectField from '@/components/forms/RHFSelectField'
import RHFTextareaField from '@/components/forms/RHFTextareaField'
import RichTextEditor from '@/components/rich-text-editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/consts/routes'
import { tryCatch } from '@/hooks/try-catch'
import {
    courseCategories,
    CourseFormDataType,
    courseFormSchema,
    courseLevels,
    courseStatuses,
} from '@/schemas/course-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon, PlusIcon, SparkleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'

export default function EditCourseForm({ data }: { data: AdminCourseSingularType }) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    const form = useForm<CourseFormDataType>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            title: data?.title,
            slug: data?.slug,
            shortDescription: data?.shortDescription,
            description: data?.description,
            fileKey: data?.fileKey,
            category: data.category as CourseFormDataType['category'],
            level: data?.level,
            duration: data.duration,
            price: data.price,
            status: data?.status,
        },
    })

    const handleSubmitForm = (values: CourseFormDataType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(editCourse(values, data.id))
            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === 'success') {
                toast.success(result.message)
                form.reset()
                router.push(ROUTES.DASHBOARD_COURSES)
            } else if (result.status === 'error') {
                toast.error(result.message)
            }
        })
    }

    const handleGenerateSlug = () => {
        const courseTitle = form.getValues('title')
        if (!courseTitle) return
        const courseSlug = slugify(courseTitle)
        form.setValue('slug', courseSlug, { shouldValidate: true })
    }

    return (
        <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className='space-y-8 py-10'
        >
            <RHFInputField
                isRequired
                id='title'
                name='title'
                label='Title'
                placeholder='Enter course title...'
                control={form.control}
            />
            <Controller
                name='slug'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                            htmlFor='slug'
                            className="after:text-destructive after:content-['*']"
                        >
                            Slug
                        </FieldLabel>
                        <div className='flex items-center space-x-4'>
                            <Input
                                id='slug'
                                placeholder='Enter courses slug...'
                                {...field}
                            />
                            <Button
                                type='button'
                                onClick={handleGenerateSlug}
                            >
                                Generate slug <SparkleIcon size={16} />
                            </Button>
                        </div>
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                )}
            />
            <RHFTextareaField
                isRequired
                id='shortDescription'
                name='shortDescription'
                label='Short description'
                classNameTextarea='min-h-52'
                placeholder='Short description...'
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
                            placeholder='Write course description...'
                        />
                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                )}
            />
            <RHFFileUploader
                isRequired
                id='fileKey'
                name='fileKey'
                label='Thumbnail'
                control={form.control}
            />

            <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-6'>
                    <RHFSelectField
                        isRequired
                        id='category'
                        name='category'
                        label='Category'
                        selectItems={courseCategories}
                        placeholder='Select a category...'
                        control={form.control}
                    />
                </div>

                <div className='col-span-6'>
                    <RHFSelectField
                        isRequired
                        id='level'
                        name='level'
                        label='Level'
                        selectItems={courseLevels}
                        placeholder='Select a level...'
                        control={form.control}
                    />
                </div>
            </div>

            <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-6'>
                    <RHFInputField
                        isRequired
                        id='duration'
                        name='duration'
                        label='Duration (hours)'
                        placeholder='Enter courses duration...'
                        type='number'
                        control={form.control}
                    />
                </div>

                <div className='col-span-6'>
                    <RHFInputField
                        isRequired
                        id='price'
                        name='price'
                        label='Price ($)'
                        placeholder='Enter courses price...'
                        type='number'
                        control={form.control}
                    />
                </div>
            </div>
            <RHFSelectField
                isRequired
                id='status'
                name='status'
                label='Status'
                selectItems={courseStatuses}
                placeholder='Select a course status...'
                control={form.control}
            />

            <Button
                type='submit'
                disabled={pending}
            >
                {pending ? (
                    <>
                        Updating...{' '}
                        <LoaderIcon
                            size={16}
                            className='animate-spin'
                        />
                    </>
                ) : (
                    <>
                        Update course
                        <PlusIcon size={16} />
                    </>
                )}
            </Button>
        </form>
    )
}
