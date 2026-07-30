'use server'

import { requireUser } from '@/app/data/user/require-user'
import arcjet, { fixedWindow } from '@/lib/arcjet'
import { prisma } from '@/lib/db'
import { env } from '@/lib/env'
import { stripe } from '@/lib/stripe'
import { ApiResponse } from '@/lib/types'
import { request } from '@arcjet/next'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

// Giới hạn số lần khởi tạo checkout trong mỗi phút để giảm double-click, spam request
// và chi phí phát sinh khi phải tạo Stripe Customer/Checkout Session.
const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    }),
)

/**
 * Khởi tạo một lần thanh toán cho khóa học và chuyển người dùng sang Stripe Checkout.
 *
 * Luồng: xác thực user → kiểm tra khóa học → lấy/tạo Stripe Customer → tạo hoặc
 * cập nhật Enrollment ở trạng thái Pending → tạo Checkout Session → redirect sang Stripe.
 * Enrollment chỉ được xem là hoàn tất sau khi webhook xác nhận thanh toán thành công.
 */
export async function enrollInCourseAction({ courseId }: { courseId: string }): Promise<ApiResponse | null> {
    // Không cho phép tạo checkout session nếu request không gắn với user đã đăng nhập.
    const { user } = await requireUser()

    // Server Action vẫn phải kiểm tra lại dữ liệu vì client có thể gửi request thủ công hoặc bị stale UI.
    if (!courseId) {
        return {
            status: 'error',
            message: 'Course id is required',
        }
    }

    let checkoutUrl: string
    try {
        // request() cung cấp thông tin request để Arcjet đánh giá; fingerprint theo user.id
        // giúp giới hạn theo tài khoản thay vì chỉ theo IP, phù hợp với người dùng đăng nhập.
        const req = await request()
        const decision = await aj.protect(req, { fingerprint: user.id })
        if (decision.isDenied()) {
            // Dừng trước mọi thao tác database/Stripe để request bị giới hạn không tạo giao dịch dở dang.
            return {
                status: 'error',
                message: 'You have been blocked',
            }
        }

        // Lấy giá từ database thay vì tin dữ liệu từ client để tránh thay đổi số tiền thanh toán.
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
            },
        })

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found',
            }
        }

        let stripeCustomerId: string
        // Tái sử dụng Customer giúp mỗi user chỉ có một hồ sơ Stripe và giữ lịch sử thanh toán liên tục.
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        })

        if (userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId?.stripeCustomerId
        } else {
            // Customer được tạo trước Checkout để Stripe gắn giao dịch với đúng tài khoản nội bộ.
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id,
                },
            })

            stripeCustomerId = customer.id
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                },
            })
        }

        const result = await prisma.$transaction(async (tx) => {
            // Một user không nên có nhiều Enrollment cho cùng khóa học; unique key cũng bảo vệ
            // trường hợp người dùng double-click hoặc gửi nhiều request đồng thời.
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    courseId_userId: {
                        userId: user.id,
                        courseId: courseId,
                    },
                },
                select: {
                    id: true,
                    status: true,
                },
            })

            if (existingEnrollment?.status === 'Active') {
                return {
                    status: 'success',
                    message: 'You are already enrolled in this course',
                }
            }

            let enrollment = null
            if (existingEnrollment) {
                // Enrollment Pending/Cancel được dùng lại để tránh tạo bản ghi rác sau mỗi lần thanh toán lại.
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amount: course.price,
                        status: 'Pending',
                        updatedAt: new Date(),
                    },
                })
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: 'Pending',
                    },
                })
            }

            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: 'price_1TysZEHwG10eF5gHSxSEwpYo',
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    // Metadata là cầu nối để webhook xác định user, course và Enrollment cần cập nhật.
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                },
            })

            return {
                enrollment: enrollment,
                checkoutUrl: checkoutSession.url,
            }
        })

        const checkoutSessionUrl = result.checkoutUrl
        if (typeof checkoutSessionUrl !== 'string') {
            return {
                status: 'success',
                message: 'You are already enrolled in this course',
            }
        }

        checkoutUrl = checkoutSessionUrl
    } catch (error) {
        // Không trả chi tiết lỗi Stripe cho client vì có thể làm lộ thông tin nội bộ của payment provider.
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: 'error',
                message: 'Payment system error. Please try again',
            }
        }
        return {
            status: 'error',
            message: 'Failed to enroll in course',
        }
    }

    // Chuyển hướng sang trang thanh toán
    redirect(checkoutUrl)
}
