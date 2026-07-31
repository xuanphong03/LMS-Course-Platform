'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import {
    isValidChapterOrder,
    isValidLessonOrder,
} from '@/app/(admin)/admin/courses/[courseId]/edit/_lib/course-structure-order.validation'
import { ROUTES } from '@/consts/routes'
import arcjet, { fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { ApiResponse } from '@/lib/types'
import { CourseFormDataType, courseFormSchema } from '@/schemas/course-form.schema'
import { reorderChaptersSchema, reorderLessonsSchema } from '@/schemas/course-structure-order.schema'
import type { ReorderChaptersInput, ReorderLessonsInput } from '@/schemas/course-structure-order.schema'
import { request } from '@arcjet/next'
import { revalidatePath } from 'next/cache'
import { chapterSchema, ChapterSchemaType } from '@/schemas/chapter-form.schema'
import { lessonSchema, LessonSchemaType } from '@/schemas/lesson-form.schema'

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    }),
)

/**
 * Cập nhật thông tin course thuộc admin hiện tại.
 *
 * Luồng: xác thực admin → chống abuse → validate dữ liệu → kiểm tra ownership
 * → cập nhật Product trên Stripe → cập nhật course trong database.
 */
export async function editCourse(data: CourseFormDataType, courseId: string): Promise<ApiResponse> {
    // Server Action vẫn phải xác thực lại quyền vì client có thể gửi request thủ công.
    const session = await requireAdmin()

    try {
        // Chặn request spam/bot trước khi gọi Stripe và ghi database.
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

        // Validate tại server để không lưu dữ liệu sai dù client đã có validation riêng.
        const result = courseFormSchema.safeParse(data)
        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid data',
            }
        }

        // Gộp ownership vào điều kiện truy vấn để admin chỉ có thể cập nhật course của mình.
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                userId: session.user.id,
            },
            select: {
                id: true,
                stripePriceId: true,
                stripeProductId: true,
            },
        })

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found',
            }
        }

        // Price vẫn cần được đọc để kiểm tra giá hiện tại, nhưng Product được lấy trực tiếp
        // từ stripeProductId nhằm tránh phụ thuộc vào quan hệ Price → Product.
        const price = await stripe.prices.retrieve(course.stripePriceId)
        const productId = course.stripeProductId
        const nextAmount = result.data.price * 100
        let stripePriceId = course.stripePriceId

        if (price.unit_amount !== nextAmount) {
            // Stripe không cho sửa unit_amount của Price đã tạo; phải tạo Price mới để giữ lịch sử
            // giao dịch cũ bất biến, sau đó chuyển Product sang Price mới.
            const nextPrice = await stripe.prices.create({
                product: productId,
                currency: price.currency,
                unit_amount: nextAmount,
            })

            stripePriceId = nextPrice.id
        }

        // Stripe Product lưu thông tin hiển thị ở bước thanh toán; cập nhật nó cùng lúc với course
        // để tên/mô tả trong hệ thống và trên Stripe không bị lệch nhau.
        await stripe.products.update(productId, {
            name: result.data.title,
            description: result.data.shortDescription,
            ...(stripePriceId !== course.stripePriceId ? { default_price: stripePriceId } : {}),
        })

        // Chỉ ghi database sau khi Stripe cập nhật thành công để tránh course trỏ tới dữ liệu thanh toán cũ.
        await prisma.course.update({
            where: { id: course.id, userId: session.user.id },
            data: {
                ...result.data,
                stripePriceId,
            },
        })

        if (stripePriceId !== course.stripePriceId) {
            // Price cũ không bị xóa để bảo toàn lịch sử Stripe, chỉ ngừng cho phép dùng trong checkout mới.
            await stripe.prices.update(course.stripePriceId, { active: false })
        }

        return {
            status: 'success',
            message: 'Course updated successfully',
        }
    } catch {
        // Trả thông báo tổng quát vì lỗi có thể chứa thông tin nhạy cảm từ Stripe hoặc database.
        return {
            status: 'error',
            message: 'Failed to update course',
        }
    }
}

/**
 * Lưu full snapshot vị trí và chapter đích của toàn bộ lesson trong course.
 *
 * Luồng: Validate shape → Xác thực quyền sở hữu → Đối chiếu identity trong database
 * → Ghi nguyên tử → Revalidate trang chỉnh sửa.
 */
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

        revalidatePath(ROUTES.ADMIN_COURSES_EDIT(courseId))

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

/**
 * Lưu full snapshot thứ tự chapter của course.
 *
 * Luồng: Validate shape → Xác thực quyền sở hữu → Đối chiếu identity trong database
 * → Ghi nguyên tử → Revalidate trang chỉnh sửa.
 */
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

        // Một lỗi update phải rollback toàn bộ để database không lưu order nửa cũ nửa mới.
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

        revalidatePath(ROUTES.ADMIN_COURSES_EDIT(courseId))

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

/**
 * Tạo chapter ở cuối course thuộc admin hiện tại.
 *
 * Luồng: Validate dữ liệu → Xác thực quyền sở hữu course → Tính position kế tiếp
 * → Tạo chapter → Revalidate trang chỉnh sửa.
 */
export async function createChapter(values: ChapterSchemaType): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const result = chapterSchema.safeParse(values)

        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid data',
            }
        }

        const course = await prisma.course.findFirst({
            where: {
                id: result.data.courseId,
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        })

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found',
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPosition = await tx.chapter.findFirst({
                where: {
                    courseId: result.data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                },
            })

            await tx.chapter.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPosition?.position ?? -1) + 1,
                },
            })
        })

        revalidatePath(ROUTES.ADMIN_COURSES_EDIT(result.data.courseId))

        return {
            status: 'success',
            message: 'Chapter created successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to create chapter',
        }
    }
}

/**
 * Tạo lesson ở cuối chapter thuộc course của admin hiện tại.
 *
 * Luồng: Validate dữ liệu → Xác thực quan hệ course/chapter và quyền sở hữu
 * → Tính position kế tiếp → Tạo lesson → Revalidate trang chỉnh sửa.
 */
export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const result = lessonSchema.safeParse(values)

        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid data',
            }
        }

        const chapter = await prisma.chapter.findFirst({
            where: {
                id: result.data.chapterId,
                course: {
                    id: result.data.courseId,
                    userId: session.user.id,
                },
            },
            select: {
                id: true,
            },
        })

        if (!chapter) {
            return {
                status: 'error',
                message: 'Chapter not found',
            }
        }

        await prisma.$transaction(async (tx) => {
            const maxPosition = await tx.lesson.findFirst({
                where: {
                    chapterId: result.data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                },
            })

            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    thumbnailKey: result.data.thumbnailKey,
                    videoKey: result.data.videoKey,
                    chapterId: result.data.chapterId,
                    position: (maxPosition?.position ?? -1) + 1,
                },
            })
        })

        revalidatePath(ROUTES.ADMIN_COURSES_EDIT(result.data.courseId))

        return {
            status: 'success',
            message: 'Lesson created successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to create lesson',
        }
    }
}

interface DeleteLessonProps {
    courseId: string
    chapterId: string
    lessonId: string
}

export async function deleteLesson({ courseId, chapterId, lessonId }: DeleteLessonProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const chapterTarget = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
            select: {
                lessons: {
                    orderBy: {
                        position: 'asc',
                    },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        })
        if (!chapterTarget) {
            return {
                status: 'error',
                message: 'Chapter not found',
            }
        }

        const lessonTarget = chapterTarget.lessons.find((lesson) => lesson.id === lessonId)
        if (!lessonTarget) {
            return {
                status: 'error',
                message: 'Lesson not found',
            }
        }

        const remainingLessons = chapterTarget.lessons.filter((lesson) => lesson.id !== lessonId)
        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: { id: lesson.id },
                data: { position: index },
            })
        })
        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId,
                },
            }),
        ])

        revalidatePath(ROUTES.ADMIN_COURSES_EDIT(courseId))

        return {
            status: 'success',
            message: 'Lesson deleted and positions reordered successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to delete lesson',
        }
    }
}

interface DeleteChapterProps {
    courseId: string
    chapterId: string
}

export async function deleteChapter({ courseId, chapterId }: DeleteChapterProps): Promise<ApiResponse> {
    await requireAdmin()
    try {
        const courseTarget = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                chapters: {
                    orderBy: {
                        position: 'asc',
                    },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        })
        if (!courseTarget) {
            return {
                status: 'error',
                message: 'Course not found',
            }
        }

        const chapterTarget = courseTarget.chapters.find((chapter) => chapter.id === chapterId)
        if (!chapterTarget) {
            return {
                status: 'error',
                message: 'Chapter not found',
            }
        }

        const remainingChapters = courseTarget.chapters.filter((chapter) => chapter.id !== chapterId)
        const updates = remainingChapters.map((chapter, index) => {
            return prisma.chapter.update({
                where: { id: chapter.id },
                data: { position: index },
            })
        })
        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId,
                },
            }),
        ])

        revalidatePath(ROUTES.ADMIN_COURSES_EDIT(courseId))

        return {
            status: 'success',
            message: 'Chapter deleted and positions reordered successfully',
        }
    } catch {
        return {
            status: 'error',
            message: 'Failed to delete chapter',
        }
    }
}
