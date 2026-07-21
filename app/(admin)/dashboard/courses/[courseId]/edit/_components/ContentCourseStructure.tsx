import CourseStructure from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/CourseStructure'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContentCourseStructure({ data }: { data: AdminCourseSingularType }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Course structure</CardTitle>
                <CardDescription>Here you can update your course structure</CardDescription>
            </CardHeader>
            <CardContent>
                <CourseStructure data={data} />
            </CardContent>
        </Card>
    )
}
