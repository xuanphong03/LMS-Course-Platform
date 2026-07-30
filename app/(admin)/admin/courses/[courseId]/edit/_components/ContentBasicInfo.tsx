import EditCourseForm from '@/app/(admin)/admin/courses/[courseId]/edit/_components/EditCourseForm'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Giữ phần bố cục ở server để chỉ biểu mẫu có tương tác mới được đưa vào client bundle.
 */
export default function ContentBasicInfo({ data }: { data: AdminCourseSingularType }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Basic Info</CardTitle>
                <CardDescription>Edit basic information about the course</CardDescription>
            </CardHeader>
            <CardContent>
                <EditCourseForm data={data} />
            </CardContent>
        </Card>
    )
}
