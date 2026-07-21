'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import ChapterGroup from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/ChapterGroup'

export type LessonType = {
    id: string
    title: string
    order: number
}

export type CourseStructureType = {
    id: string
    title: string
    order: number
    isOpen: boolean
    lessons: LessonType[]
}

export default function CourseStructure({ data }: { data: AdminCourseSingularType }) {
    const [items, setItems] = useState<CourseStructureType[]>(
        () =>
            data?.chapters?.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: true, // Default chapters is open
                lessons:
                    chapter?.lessons?.map((lesson) => ({
                        id: lesson.id,
                        title: lesson.title,
                        order: lesson.position,
                    })) ?? [],
            })) ?? [],
    )

    return (
        <Card>
            <CardHeader className='border-border flex flex-row items-center justify-between border-b'>
                <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent>
                <ChapterGroup
                    data={data}
                    items={items}
                    setItems={setItems}
                />
            </CardContent>
        </Card>
    )
}
