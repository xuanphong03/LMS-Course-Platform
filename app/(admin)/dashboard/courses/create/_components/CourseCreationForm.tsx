'use client'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    courseCategories,
    CourseCreationFormDataType,
    CourseCreationFormInputType,
    courseCreationFormSchema,
    courseLevels,
    courseStatuses,
} from '@/schemas/course-creation-form.schema'
import { LoaderIcon, PlusIcon, SparkleIcon } from 'lucide-react'
import slugify from 'slugify'
import RHFInputField from '@/components/forms/RHFInputField'
import RHFTextareaField from '@/components/forms/RHFTextareaField'
import RHFSelectField from '@/components/forms/RHFSelectField'
import RichTextEditor from '@/components/rich-text-editor/RichTextEditor'
import RHFFileUploader from '@/components/forms/RHFFileUploader'
import { useTransition } from 'react'
import { tryCatch } from '@/lib/try-catch'
import { CreateCourse } from '@/app/(admin)/dashboard/courses/create/actions'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/consts/routes'

export default function CourseCreationForm() {
    const router = useRouter()
    const [isCreateCoursePending, startCreateCourseTransition] = useTransition()

    const form = useForm<CourseCreationFormInputType, unknown, CourseCreationFormDataType>({
        resolver: zodResolver(courseCreationFormSchema),
        defaultValues: {
            title: '',
            slug: '',
            shortDescription: '',
            description: '',
            fileKey: '',
            category: courseCategories[0],
            level: 'Beginner',
            duration: 1,
            price: 2,
            status: 'Draft',
        },
    })

    const handleSubmitForm = (values: CourseCreationFormDataType) => {
        startCreateCourseTransition(async () => {
            const { data: result, error } = await tryCatch(CreateCourse(values))
            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === 'success') {
                toast.success(result.message)
                form.reset()
                router.push(ROUTES.COURSES)
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
                disabled={isCreateCoursePending}
            >
                {isCreateCoursePending ? (
                    <>
                        Creating...{' '}
                        <LoaderIcon
                            size={16}
                            className='animate-spin'
                        />
                    </>
                ) : (
                    <>
                        Create new course
                        <PlusIcon size={16} />
                    </>
                )}
            </Button>
        </form>
    )
}
