import EmptyCourseLayout from '@/app/_components/EmptyCourseLayout'
import CourseProgressCard from '@/app/dashboard/_components/CourseProgressCard'
import { EnrolledCourseType } from '@/app/data/user/get-enrolled-courses'
import { ROUTES } from '@/consts/routes'

export default function SectionEnrolledCourses({ data }: { data: EnrolledCourseType[] }) {
    return (
        <section>
            <div className='mb-5 flex flex-col gap-2'>
                <h2 className='text-3xl font-bold'>Enrolled Courses</h2>
                <p className='text-muted-foreground'>Here you can see all the courses you are currently enrolled in.</p>
            </div>

            {!data.length ? (
                <EmptyCourseLayout
                    title='No courses purchased'
                    description="You haven't purchased any courses yet. Explore our course catalog and enroll in a course to get started!"
                    buttonText='Browse Courses'
                    buttonLink={ROUTES.PUBLIC_COURSES}
                />
            ) : (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    {data.map(({ course }) => (
                        <CourseProgressCard
                            key={course.id}
                            data={course}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
