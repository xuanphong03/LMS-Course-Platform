import CourseCreationForm from '@/app/(admin)/admin/courses/create/_components/CourseCreationForm'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Create Course',
    description: 'Create a new course and provide basic information for your LMS platform.',
}

export default function CourseCreationPage() {
    return (
        <>
            <div className='flex items-center space-x-4'>
                <Link
                    href={ROUTES.ADMIN_COURSES}
                    className={buttonVariants({
                        size: 'icon',
                        variant: 'outline',
                    })}
                >
                    <ArrowLeft className='size-4' />
                </Link>

                <h2>Create Course</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic information</CardTitle>
                    <CardDescription>Provide basic information about the course</CardDescription>
                </CardHeader>
                <CardContent>
                    <CourseCreationForm />
                </CardContent>
            </Card>
        </>
    )
}
