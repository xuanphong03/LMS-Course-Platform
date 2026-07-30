'use client'

import { enrollInCourseAction } from '@/app/(public)/courses/[slug]/actions'
import { PublicCourseDetailType } from '@/app/data/course/get-singular-course'
import { Button } from '@/components/ui/button'
import { tryCatch } from '@/hooks/try-catch'
import { Loader } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function EnrollmentButton({ course }: { course: PublicCourseDetailType }) {
    const [pending, startTransition] = useTransition()

    const handleEnrollment = () => {
        startTransition(async () => {
            const { data: result } = await tryCatch(enrollInCourseAction({ courseId: course?.id as string }))

            if (!result) return

            if (result.status === 'success') {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <Button
            type='button'
            className='w-full'
            onClick={handleEnrollment}
            disabled={pending}
        >
            {pending ? (
                <>
                    <span>Enrolling...</span> <Loader className='size-4 animate-spin' />
                </>
            ) : (
                <span> Enroll Now!</span>
            )}
        </Button>
    )
}
