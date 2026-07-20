import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet'
import { env } from '@/lib/env'
import { S3 } from '@/lib/S3Client'
import { v4 as uuidv4 } from 'uuid'
import { fileUploadSchema } from '@/schemas/file-upload.schema'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { requireAdmin } from '@/app/data/admin/require-admin'

const aj = arcjet
    .withRule(
        detectBot({
            mode: 'LIVE',
            allow: [],
        }),
    )
    .withRule(
        fixedWindow({
            mode: 'LIVE',
            window: '1m',
            max: 5,
        }),
    )

export async function POST(request: Request) {
    const session = await requireAdmin()
    try {
        const decision = await aj.protect(request, {
            fingerprint: session?.user.id as string,
        })

        if (decision.isDenied()) {
            return NextResponse.json({ error: 'Dude not good' }, { status: 429 })
        }

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
