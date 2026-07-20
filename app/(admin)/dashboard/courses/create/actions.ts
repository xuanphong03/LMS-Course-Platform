'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { CourseCreationFormDataType, courseCreationFormSchema } from '@/schemas/course-creation-form.schema'
import { request } from '@arcjet/next'

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

export async function CreateCourse(formData: CourseCreationFormDataType): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session?.user.id as string,
        })
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: 'You have been blocked due to rate limiting',
                }
            } else {
                return {
                    status: 'error',
                    message: 'You are a bot! If this is a mistake, contact our support',
                }
            }
        }

        const validation = courseCreationFormSchema.safeParse(formData)

        if (!validation.success) {
            return {
                status: 'error',
                message: 'Invalid form data',
            }
        }

        // Create new course
        await prisma.course.create({
            data: {
                ...formData,
                userId: session?.user?.id as string,
            },
        })

        return {
            status: 'success',
            message: 'Course created successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to create course',
        }
    }
}
