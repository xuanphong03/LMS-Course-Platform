import z from 'zod/v3'

export const courseLevels = ['Beginner', 'Intermediate', 'Advanced'] as const
export const courseStatuses = ['Draft', 'Publish', 'Archive'] as const
export const courseCategories = [
    'Development',
    'Business',
    'Finance',
    'IT & Software',
    'Office productivity',
    'Personal development',
    'Marketing',
    'Health & Fitness',
    'Teaching & Academics',
    'Design',
] as const

export const courseFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters.').max(100, 'Title must be at most 100 characters.'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    description: z.string().max(2500, 'Description must be at most 2500 characters.'),
    shortDescription: z
        .string()
        .min(3, 'Short description must be at least 3 characters')
        .max(200, 'Short description must be at most 200 characters.'),
    fileKey: z.string().min(1, 'Please upload a thumbnail'),
    price: z.coerce.number().min(1),
    duration: z.coerce.number().min(1, 'Duration mus be at least 1 hour').max(500, 'Duration mus be at most 500 hours'),
    level: z.enum(courseLevels, { message: 'Course level is required' }),
    category: z.enum(courseCategories, { message: 'Course category is required' }),
    status: z.enum(courseStatuses, { message: 'Course status is required' }),
})

export type CourseFormDataType = z.infer<typeof courseFormSchema>
