'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { ROUTES } from '@/consts/routes'
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { ApiResponse } from '@/lib/types'
import { CourseFormDataType, courseFormSchema } from '@/schemas/course-form.schema'
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

export type ReorderLessonInput = {
    id: string
    chapterId: string
    position: number
}
interface reorderLessonsProps {
    lessons: ReorderLessonInput[]
    courseId: string
}
export async function reorderLessons({ lessons, courseId }: reorderLessonsProps): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        if (!lessons || !lessons.length) {
            return {
                status: 'error',
                message: 'No lessons provided for reordering',
            }
        }

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

        // Không tin tưởng dữ liệu đầu vào từ Server Action. Chỉ chấp nhận chapter và
        // lesson thực sự thuộc khóa học đã được xác thực quyền truy cập ở trên.
        const validChapterIds = new Set(course.chapters.map((chapter) => chapter.id))
        const validLessonIds = new Set(course.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)))

        // Dùng Set để phát hiện ID lesson bị trùng trước khi tạo transaction; nếu không,
        // cùng một bản ghi có thể bị cập nhật nhiều lần với các vị trí xung đột nhau.
        const submittedLessonIds = new Set(lessons.map((lesson) => lesson.id))

        // Vị trí phải là số nguyên không âm và bắt đầu từ 0. Client chịu trách nhiệm tạo
        // thứ tự liên tục; tại boundary này server xác thực từng giá trị riêng lẻ.
        const hasInvalidLesson = lessons.some(
            (lesson) =>
                !validLessonIds.has(lesson.id) ||
                !validChapterIds.has(lesson.chapterId) ||
                !Number.isInteger(lesson.position) ||
                lesson.position < 0,
        )

        if (hasInvalidLesson || submittedLessonIds.size !== lessons.length) {
            return {
                status: 'error',
                message: 'Invalid lesson order',
            }
        }

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

        revalidatePath(`${ROUTES.DASHBOARD_COURSES_EDIT(courseId)}`)

        return {
            status: 'success',
            message: 'Lessons reordered successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to reorder lessons',
        }
    }
}

export type ReorderChapterInput = {
    id: string
    position: number
}
interface reorderChaptersProps {
    courseId: string
    chapters: ReorderChapterInput[]
}
export async function reorderChapters({ courseId, chapters }: reorderChaptersProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        if (!chapters || !chapters.length) {
            return {
                status: 'error',
                message: 'No chapters provided for reordering',
            }
        }

        const updates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: {
                    id: chapter.id,
                    courseId: courseId,
                },
                data: {
                    position: chapter.position,
                },
            }),
        )

        await prisma.$transaction(updates)

        revalidatePath(`${ROUTES.DASHBOARD_COURSES_EDIT(courseId)}`)

        return {
            status: 'success',
            message: 'Chapters reordered successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to reorder chapters',
        }
    }
}
