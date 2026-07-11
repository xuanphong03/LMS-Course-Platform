import CourseCreationForm from '@/app/(admin)/dashboard/courses/create/CourseCreationForm'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CourseCreationPage() {
    return (
        <>
            <div className='flex items-center space-x-4'>
                <Link
                    href={ROUTES.DASHBOARD_COURSES}
                    className={buttonVariants({
                        size: 'icon',
                        variant: 'outline',
                    })}
                >
                    <ArrowLeft className='size-4' />
                </Link>

                <h1>Create Course</h1>
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
