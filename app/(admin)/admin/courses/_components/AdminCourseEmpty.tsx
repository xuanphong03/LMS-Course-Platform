import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminCourseEmpty() {
    return (
        <div className='relative w-full'>
            <Image
                alt='Empty course'
                width={1024}
                height={920}
                src='/images/empty-image.png'
                className='mx-auto h-auto w-140'
            />
            <div className='absolute top-80 left-1/2 -translate-x-1/2'>
                <div className='flex flex-col items-center space-y-2'>
                    <p className='text-2xl font-medium'>No courses available</p>
                    <p className='text-foreground text-sm'>
                        There are currently no courses created. Please create a new course to get started!
                    </p>
                    <Link
                        href={ROUTES.ADMIN_COURSES_CREATE}
                        className={buttonVariants()}
                    >
                        <PlusIcon /> New Course
                    </Link>
                </div>
            </div>
        </div>
    )
}
