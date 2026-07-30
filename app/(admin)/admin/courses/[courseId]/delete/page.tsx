import DeleteCourse from '@/app/(admin)/admin/courses/[courseId]/delete/_components/DeleteCourse'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import Link from 'next/link'
import React from 'react'

export default function DeleteCoursePage() {
    return (
        <div className='mx-auto w-full max-w-xl'>
            <Card className='mt-32'>
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this course?</CardTitle>
                    <CardDescription>This action cannot be undone</CardDescription>
                </CardHeader>
                <CardContent className='flex items-center justify-between'>
                    <Link
                        href={ROUTES.ADMIN_COURSES}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Cancel
                    </Link>
                    <DeleteCourse />
                </CardContent>
            </Card>
        </div>
    )
}
