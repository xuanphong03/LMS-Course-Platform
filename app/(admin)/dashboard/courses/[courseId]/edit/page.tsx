import { adminGetCourse } from '@/app/data/admin/admin-get-course'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentBasicInfo, ContentCourseStructure } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components'

type Params = Promise<{ courseId: string }>
interface iAppProps {
    params: Params
}

export default async function EditCoursePage({ params }: iAppProps) {
    const { courseId } = await params
    const data = await adminGetCourse(courseId)

    return (
        <div>
            <h1 className='mb-8 text-3xl font-bold'>
                Edit course: <span className='text-primary underline'>{data.title}</span>
            </h1>

            <Tabs defaultValue=''>
                <TabsList className='w-full'>
                    <TabsTrigger value='basic-info'>Basic Info</TabsTrigger>
                    <TabsTrigger value='course-structure'>Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value='basic-info'>
                    <ContentBasicInfo data={data} />
                </TabsContent>
                <TabsContent value='course-structure'>
                    <ContentCourseStructure />
                </TabsContent>
            </Tabs>
        </div>
    )
}
