import type { CourseStructureItem } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ChapterGroup from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/ChapterGroup'
import NewChapterModal from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/NewChapterModal'

interface CourseStructureProps {
    courseId: string
    initialItems: CourseStructureItem[]
}

/**
 * Giữ card layout ở Server Component; chỉ modal và vùng DnD cần JavaScript mới
 * trở thành client islands, nhờ đó không mở rộng client bundle ra toàn bộ section.
 */
export default function CourseStructure({ courseId, initialItems }: CourseStructureProps) {
    return (
        <Card>
            <CardHeader className='border-border flex flex-row items-center justify-between border-b'>
                <CardTitle>Chapters</CardTitle>
                <NewChapterModal courseId={courseId} />
            </CardHeader>
            <CardContent className='space-y-(--card-spacing)'>
                <ChapterGroup
                    key={courseId}
                    courseId={courseId}
                    serverItems={initialItems}
                />
            </CardContent>
        </Card>
    )
}
