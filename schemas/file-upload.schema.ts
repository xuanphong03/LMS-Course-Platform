import z from 'zod/v3'

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, 'File is required'),
    contentType: z.string().min(1, 'Content type is required'),
    size: z.number().min(1, 'Size is required'),
    isImage: z.boolean(),
})
