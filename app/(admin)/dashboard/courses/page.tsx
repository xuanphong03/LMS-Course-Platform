import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function CoursesPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Your courses</h1>
                <Link
                    href={ROUTES.DASHBOARD_COURSES_CREATE}
                    className={buttonVariants()}
                >
                    <PlusIcon /> New Course
                </Link>
            </div>
        </>
    )
}
