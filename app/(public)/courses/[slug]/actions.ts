'use server'

import { requireUser } from '@/app/data/user/require-user'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { ApiResponse } from '@/lib/types'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

interface EnrollInCourseActionProps {
    courseId: string
}

/**
 * Đảm bảo người dùng có Stripe Customer trước khi bắt đầu quy trình thanh toán.
 *
 * Lưu ý: action hiện chưa tạo Checkout Session hoặc Enrollment; vì vậy chỉ nên xem
 * đây là bước chuẩn bị thanh toán, không phải xác nhận người dùng đã mua khóa học.
 */
export async function enrollInCourseAction({ courseId }: EnrollInCourseActionProps): Promise<ApiResponse | never> {
    const { user } = await requireUser()

    let checkoutUrl: string

    try {
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
                    message: 'Your are already enrolled in this course',
                }
            }

            let enrollment = null
            if (existingEnrollment) {
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
                success_url: 'abc',
                cancel_url: 'abc',
                metadata: {
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

        checkoutUrl = result.checkoutUrl as string
    } catch (error) {
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

    redirect(checkoutUrl)
}
