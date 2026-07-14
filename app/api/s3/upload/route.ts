import { env } from '@/lib/env'
import { v4 as uuidv4 } from 'uuid'
import { fileUploadSchema } from '@/schemas/file-upload.schema'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '@/lib/S3Client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = fileUploadSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const { fileName, contentType } = validation.data
        const uniqueKey = `${uuidv4()}-${fileName}`
        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            Key: uniqueKey,
        })
        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 360, // URL will expired in 6 minutes
        })
        const response = {
            presignedUrl,
            key: uniqueKey,
        }
        return NextResponse.json(response)
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to generate presigned URL',
            },
            { status: 500 },
        )
    }
}
