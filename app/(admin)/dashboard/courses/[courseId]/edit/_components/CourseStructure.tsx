'use client'
import type { CourseStructureItem } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import ChapterGroup from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/ChapterGroup'

interface CourseStructureProps {
    courseId: string
    initialItems: CourseStructureItem[]
}

export default function CourseStructure({ courseId, initialItems }: CourseStructureProps) {
    // Parent key component theo courseId, vì vậy state được khởi tạo lại khi chuyển course
    // nhưng không bị RSC revalidation cùng course ghi đè lên optimistic order đang hiển thị.
    const [items, setItems] = useState(initialItems)

    return (
        <Card>
            <CardHeader className='border-border flex flex-row items-center justify-between border-b'>
                <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent className='space-y-(--card-spacing)'>
                <ChapterGroup
                    courseId={courseId}
                    items={items}
                    setItems={setItems}
                />
            </CardContent>
        </Card>
    )
}
