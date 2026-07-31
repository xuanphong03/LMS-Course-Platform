import { adminGetCourse } from '@/app/data/admin/admin-get-course'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentBasicInfo, ContentCourseStructure } from '@/app/(admin)/admin/courses/[courseId]/edit/_components'
import { Metadata } from 'next'

export async function generateMetadata({ params }: iAppProps): Promise<Metadata> {
    const { courseId } = await params

    const course = await adminGetCourse(courseId)

    return {
        title: `Edit Course - ${course.title}`,
        description: `Manage and update ${course.title} information, content, and course structure.`,
        robots: {
            index: false,
            follow: false,
        },
    }
}

interface iAppProps {
    params: Promise<{ courseId: string }>
}

/**
 * Nạp course một lần ở Server Component để hai tab dùng chung cùng một snapshot dữ liệu,
 * tránh tạo thêm luồng fetch và trạng thái đồng bộ ở phía client.
 */
export default async function EditCoursePage({ params }: iAppProps) {
    const { courseId } = await params
    const data = await adminGetCourse(courseId)

    return (
        <div>
            <h1 className='mb-8 text-3xl font-bold'>
                Edit course: <span className='text-primary underline'>{data.title}</span>
            </h1>

            <Tabs defaultValue='basic-info'>
                <TabsList className='w-full'>
                    <TabsTrigger value='basic-info'>Basic Info</TabsTrigger>
                    <TabsTrigger value='course-structure'>Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value='basic-info'>
                    <ContentBasicInfo data={data} />
                </TabsContent>
                <TabsContent value='course-structure'>
                    <ContentCourseStructure data={data} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
