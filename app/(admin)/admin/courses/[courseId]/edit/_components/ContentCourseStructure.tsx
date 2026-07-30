import CourseStructure from '@/app/(admin)/admin/courses/[courseId]/edit/_components/CourseStructure'
import type { CourseStructureItem } from '@/app/(admin)/admin/courses/[courseId]/edit/_components/course-structure/course-structure.types'
import type { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Giữ bước chuyển Prisma result thành view model ở phía server để client boundary
 * chỉ nhận dữ liệu cần cho DnD, thay vì phụ thuộc vào toàn bộ course model.
 */
export default function ContentCourseStructure({ data }: { data: AdminCourseSingularType }) {
    const initialItems: CourseStructureItem[] = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
        })),
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course structure</CardTitle>
                <CardDescription>Here you can update your course structure</CardDescription>
            </CardHeader>
            <CardContent>
                <CourseStructure
                    courseId={data.id}
                    initialItems={initialItems}
                />
            </CardContent>
        </Card>
    )
}
