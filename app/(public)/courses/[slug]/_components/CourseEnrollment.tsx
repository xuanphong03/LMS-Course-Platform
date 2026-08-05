import EnrollmentButton from '@/app/(public)/courses/[slug]/_components/EnrollmentButton'
import { PublicCourseDetailType } from '@/app/data/course/get-singular-course'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import { IconBook2, IconChartBar, IconCheck, IconClock, IconLock } from '@tabler/icons-react'
import Link from 'next/link'

interface CourseEnrollmentProps {
    course: NonNullable<PublicCourseDetailType>
    isEnrolled: boolean
}

const courseBenefits = ['Full lifetime access', 'Access on mobile and desktop', 'Certificate of completion']

/**
 * Giữ CTA thanh toán luôn trong tầm nhìn trên desktop, đồng thời gom giá,
 * quyền lợi và thông tin tin cậy vào một vùng duy nhất để giảm phân tán quyết định.
 */
export default function CourseEnrollment({ course, isEnrolled }: CourseEnrollmentProps) {
    const totalLessons = course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(course.price || 0)

    return (
        <aside className='lg:sticky lg:top-28'>
            <Card className='border-primary/20 overflow-hidden rounded-3xl py-0 shadow-xl shadow-primary/10'>
                <div className='bg-primary h-1.5 w-full' />
                <CardContent className='p-6 sm:p-7'>
                    <div className='flex items-start justify-between gap-4'>
                        <div>
                            <p className='text-primary text-sm font-semibold'>Start learning</p>
                            <h2 className='mt-2 text-2xl font-bold tracking-tight'>Your next useful skill.</h2>
                        </div>
                        <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl'>
                            <IconBook2 className='size-5' />
                        </div>
                    </div>

                    <div className='mt-7 flex items-end justify-between gap-4'>
                        <span className='text-muted-foreground text-sm'>One-time payment</span>
                        <span className='text-primary text-3xl font-bold tracking-tight'>{formattedPrice}</span>
                    </div>

                    <div className='border-border/70 bg-muted/30 mt-6 divide-y rounded-2xl border'>
                        <CourseDetailRow
                            icon={<IconClock className='size-4' />}
                            label='Course duration'
                            value={`${course.duration} ${course.duration === 1 ? 'hour' : 'hours'}`}
                        />
                        <CourseDetailRow
                            icon={<IconChartBar className='size-4' />}
                            label='Course level'
                            value={course.level}
                        />
                        <CourseDetailRow
                            icon={<IconBook2 className='size-4' />}
                            label='Total lessons'
                            value={`${totalLessons} ${totalLessons === 1 ? 'lesson' : 'lessons'}`}
                        />
                    </div>

                    <div className='mt-7 space-y-3'>
                        <p className='text-sm font-semibold'>This course includes</p>
                        <ul className='space-y-3'>
                            {courseBenefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className='flex items-center gap-3 text-sm'
                                >
                                    <span className='bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full'>
                                        <IconCheck className='size-3.5' />
                                    </span>
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='mt-7'>
                        {isEnrolled ? (
                            <Link
                                href={ROUTES.USER_DASHBOARD}
                                className={buttonVariants({ className: 'h-12 w-full rounded-xl text-sm font-semibold' })}
                            >
                                Continue learning
                            </Link>
                        ) : (
                            <EnrollmentButton course={course} />
                        )}
                    </div>

                    <div className='text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs'>
                        <IconLock className='size-3.5' />
                        Secure checkout powered by Stripe
                    </div>
                </CardContent>
            </Card>
        </aside>
    )
}

function CourseDetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className='flex items-center gap-3 px-4 py-3'>
            <span className='text-primary'>{icon}</span>
            <span className='text-muted-foreground flex-1 text-sm'>{label}</span>
            <span className='text-foreground text-right text-sm font-semibold capitalize'>{value}</span>
        </div>
    )
}
