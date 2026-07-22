import CourseStructure from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/CourseStructure'
import type { CourseStructureItem } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.types'
import type { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContentCourseStructure({ data }: { data: AdminCourseSingularType }) {
    // Chỉ chuyển dữ liệu cần thiết qua Client Component boundary để giảm RSC payload
    // và không làm UI kéo thả phụ thuộc vào toàn bộ model của trang chỉnh sửa course.
    const initialItems: CourseStructureItem[] = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        isOpen: true,
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
                    key={data.id}
                    courseId={data.id}
                    initialItems={initialItems}
                />
            </CardContent>
        </Card>
    )
}
