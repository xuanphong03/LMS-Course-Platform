'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import {
    isValidChapterOrder,
    isValidLessonOrder,
} from '@/app/(admin)/dashboard/courses/[courseId]/edit/_lib/course-structure-order.validation'
import { ROUTES } from '@/consts/routes'
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { CourseFormDataType, courseFormSchema } from '@/schemas/course-form.schema'
import { reorderChaptersSchema, reorderLessonsSchema } from '@/schemas/course-structure-order.schema'
import type { ReorderChaptersInput, ReorderLessonsInput } from '@/schemas/course-structure-order.schema'
import { request } from '@arcjet/next'
import { revalidatePath } from 'next/cache'

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

export async function editCourse(data: CourseFormDataType, courseId: string): Promise<ApiResponse> {
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

        const result = courseFormSchema.safeParse(data)
        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid data',
            }
        }

        await prisma.course.update({
            where: { id: courseId, userId: session.user.id },
            data: {
                ...result.data,
            },
        })

        return {
            status: 'success',
            message: 'Course updated successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to update course',
        }
    }
}

export async function reorderLessons(input: ReorderLessonsInput): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const parsedInput = reorderLessonsSchema.safeParse(input)
        if (!parsedInput.success) {
            return {
                status: 'error',
                message: 'Invalid lesson order',
            }
        }

        const { lessons, courseId } = parsedInput.data

        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                userId: session.user.id,
            },
            select: {
                chapters: {
                    select: {
                        id: true,
                        lessons: {
                            select: { id: true },
                        },
                    },
                },
            },
        })

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found',
            }
        }

        // Shape hợp lệ chưa đủ: IDs và chapter đích còn phải khớp dữ liệu tin cậy
        // vừa đọc từ database. Validation ngữ nghĩa được tách riêng để dễ kiểm thử.
        if (!isValidLessonOrder(course.chapters, lessons)) {
            return {
                status: 'error',
                message: 'Invalid lesson order',
            }
        }

        // Full snapshot phải được ghi nguyên tử: chỉ một update lỗi cũng phải rollback
        // toàn bộ order, nếu không các chapter có thể rơi vào trạng thái nửa cũ nửa mới.
        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: {
                    id: lesson.id,
                },
                data: {
                    position: lesson.position,
                    chapterId: lesson.chapterId,
                },
            }),
        )

        await prisma.$transaction(updates)

        revalidatePath(ROUTES.DASHBOARD_COURSES_EDIT(courseId))

        return {
            status: 'success',
            message: 'Lessons reordered successfully',
        }
    } catch (error) {
        console.error('Failed to reorder lessons', error)
        return {
            status: 'error',
            message: 'Failed to reorder lessons',
        }
    }
}

export async function reorderChapters(input: ReorderChaptersInput): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const parsedInput = reorderChaptersSchema.safeParse(input)
        if (!parsedInput.success) {
            return {
                status: 'error',
                message: 'Invalid chapter order',
            }
        }

        const { courseId, chapters } = parsedInput.data
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                userId: session.user.id,
            },
            select: {
                chapters: {
                    select: { id: true },
                },
            },
        })

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found',
            }
        }

        if (
            !isValidChapterOrder(
                course.chapters.map((chapter) => chapter.id),
                chapters,
            )
        ) {
            return {
                status: 'error',
                message: 'Invalid chapter order',
            }
        }

        // Cập nhật mọi position trong cùng transaction để không lưu thứ tự dở dang.
        const updates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: {
                    id: chapter.id,
                },
                data: {
                    position: chapter.position,
                },
            }),
        )

        await prisma.$transaction(updates)

        revalidatePath(ROUTES.DASHBOARD_COURSES_EDIT(courseId))

        return {
            status: 'success',
            message: 'Chapters reordered successfully',
        }
    } catch (error) {
        console.error('Failed to reorder chapters', error)
        return {
            status: 'error',
            message: 'Failed to reorder chapters',
        }
    }
}
