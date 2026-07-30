import EnrollmentButton from '@/app/(public)/courses/[slug]/_components/EnrollmentButton'
import { PublicCourseDetailType } from '@/app/data/course/get-singular-course'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import { IconBook, IconCategory, IconChartBar, IconClock } from '@tabler/icons-react'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'

interface CourseEnrollmentProps {
    course: PublicCourseDetailType
    isEnrolled: boolean
}

const courseBenefits: { title: string }[] = [
    { title: 'Full lifetime access' },
    { title: 'Access on mobile and desktop' },
    { title: 'Certificate of completion' },
]

export default function CourseEnrollment({ course, isEnrolled }: CourseEnrollmentProps) {
    const totalLessons = course?.chapters?.reduce((total, chapter) => total + (chapter?.lessons?.length || 0), 0) || 0

    return (
        <div className='sticky top-24'>
            <Card className='py-0'>
                <CardContent className='p-6'>
                    <div className='mb-6 flex items-center justify-between'>
                        <span className='text-lg font-medium'>Price:</span>
                        <span className='text-primary text-xl font-bold'>
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(course?.price || 0)}
                        </span>
                    </div>

                    <div className='bg-muted mb-6 space-y-3 rounded-lg p-4'>
                        <h4 className='font-medium'> What you will get:</h4>

                        {/* Duration */}
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full'>
                                    <IconClock className='size-4' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium capitalize'>Course duration</p>
                                    <p className='text-muted-foreground text-sm'>
                                        {course?.duration} {(course?.duration || 0) > 1 ? 'hours' : 'hour'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Level */}
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full'>
                                    <IconChartBar className='size-4' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium capitalize'>Course level</p>
                                    <p className='text-muted-foreground text-sm'>{course?.level}</p>
                                </div>
                            </div>
                        </div>
                        {/* Category */}
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full'>
                                    <IconCategory className='size-4' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium capitalize'>Course category</p>
                                    <p className='text-muted-foreground text-sm'>{course?.category}</p>
                                </div>
                            </div>
                        </div>
                        {/* Total Lesson */}
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full'>
                                    <IconBook className='size-4' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium capitalize'>Total lessons</p>
                                    <p className='text-muted-foreground text-sm'>
                                        {totalLessons} {totalLessons > 1 ? 'Lessons' : 'Lesson'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mb-6 space-y-3'>
                        <h4>This course includes:</h4>
                        <ul className='space-y-2'>
                            {courseBenefits?.map((item, index) => (
                                <li
                                    key={index}
                                    className='flex items-center gap-2 text-sm'
                                >
                                    <div className='rounded-full bg-green-500/10 p-1 text-green-500'>
                                        <CheckIcon className='size-3' />
                                    </div>
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isEnrolled ? (
                        <Link
                            href={ROUTES.DASHBOARD}
                            className={buttonVariants({ className: 'w-full' })}
                        >
                            Watch Course
                        </Link>
                    ) : (
                        <EnrollmentButton course={course} />
                    )}
                    <p className='text-muted-foreground mt-3 text-center text-xs'>30-day money-back guarantee</p>
                </CardContent>
            </Card>
        </div>
    )
}
