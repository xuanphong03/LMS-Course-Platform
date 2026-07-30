'use client'
import { deleteCourse } from '@/app/(admin)/admin/courses/[courseId]/delete/actions'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { tryCatch } from '@/hooks/try-catch'
import { LoaderIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function DeleteCourse() {
    const router = useRouter()
    const { courseId } = useParams<{ courseId: string }>()
    const [pending, startTransition] = useTransition()

    const handleDeleteCourse = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteCourse({ courseId }))
            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === 'success') {
                toast.success(result.message)
                router.push(ROUTES.ADMIN_COURSES)
            } else if (result.status === 'error') {
                toast.error(result.message)
            }
        })
    }

    return (
        <Button
            disabled={pending}
            variant='destructive'
            onClick={handleDeleteCourse}
        >
            {pending ? (
                <>
                    <span>Deleting course...</span> <LoaderIcon className='size-4 animate-spin' />
                </>
            ) : (
                <span>Delete course</span>
            )}
        </Button>
    )
}
