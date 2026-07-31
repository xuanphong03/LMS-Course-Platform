'use server'

import { requireAdmin } from '@/app/data/admin/require-admin'
import { ROUTES } from '@/consts/routes'
import arcjet, { fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { ApiResponse } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { request } from '@arcjet/next'

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    }),
)

export type DeleteCourseType = {
    courseId: string
}

/**
 * Xóa course của admin và Product tương ứng trên Stripe.
 *
 * Luồng: xác thực quyền → chống abuse → kiểm tra ownership → deactivate Price và xóa Product trên Stripe
 * → xóa course trong database → làm mới cache danh sách.
 */
export async function deleteCourse({ courseId }: DeleteCourseType): Promise<ApiResponse> {
    // requireAdmin đảm bảo action không thể bị gọi bởi user thông thường.
    const session = await requireAdmin()

    try {
        // Rate limit và bot detection phải chạy trước thao tác Stripe/database để request bất thường
        // không tạo thêm chi phí hoặc làm thay đổi dữ liệu.
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

        // Kiểm tra ownership ngay trong query, thay vì chỉ kiểm tra role, để admin không thể xóa
        // course thuộc tài khoản admin khác.
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

        // Price cũ được deactivate trước để không còn được dùng trong checkout mới trước khi xóa Product.
        try {
            if (course.stripePriceId) {
                await stripe.prices.update(course.stripePriceId, { active: false })
            }
        } catch (error) {
            // Stripe cleanup không được chặn việc xóa dữ liệu nội bộ; lỗi vẫn được log để xử lý thủ công.
            console.error('Failed to deactivate Stripe Price while deleting course', {
                courseId: course.id,
                stripePriceId: course.stripePriceId,
                error,
            })
        }

        try {
            // Product ID được lưu trực tiếp trong Course nên không phụ thuộc vào Price còn tồn tại.
            if (course.stripeProductId) {
                await stripe.products.del(course.stripeProductId)
            }
        } catch (error) {
            // Product có thể ở khác Stripe mode hoặc đã bị xóa; không giữ lại course chỉ vì cleanup thất bại.
            console.error('Failed to delete Stripe Product while deleting course', {
                courseId: course.id,
                stripeProductId: course.stripeProductId,
                error,
            })
        }

        // Database cascade đã xóa toàn bộ chapter, lesson và enrollment liên quan theo course.
        await prisma.course.delete({
            where: {
                id: course.id,
            },
        })

        // Danh sách course là Server Component nên cần vô hiệu hóa cache sau mutation.
        revalidatePath(ROUTES.ADMIN_COURSES)

        return {
            status: 'success',
            message: 'Delete course successfully',
        }
    } catch (error) {
        // Không để lỗi Stripe hoặc database lộ chi tiết nội bộ ra client.
        console.error('Failed to delete course', error)
        return {
            status: 'error',
            message: 'Failed to delete course',
        }
    }
}
