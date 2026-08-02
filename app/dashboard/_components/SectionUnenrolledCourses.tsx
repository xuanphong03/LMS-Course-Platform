import PublicCourseCard from '@/app/(public)/courses/_components/PublicCourseCard'
import EmptyCourseLayout from '@/app/_components/EmptyCourseLayout'
import { PublicCourseType } from '@/app/data/course/get-all-courses'
import { ROUTES } from '@/consts/routes'

export default function SectionUnenrolledCourses({ data }: { data: PublicCourseType[] }) {
    return (
        <section className='mt-10'>
            <div className='mb-5 flex flex-col gap-2'>
                <h2 className='text-3xl font-bold'>Available Courses</h2>
                <p className='text-muted-foreground'>Here you can see all the courses available for enrollment.</p>
            </div>

            {!data.length ? (
                <EmptyCourseLayout
                    title='No courses available'
                    description='You have already enrolled in all available courses.'
                    buttonText='Browse Courses'
                    buttonLink={ROUTES.PUBLIC_COURSES}
                />
            ) : (
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    {data.map((course) => (
                        <PublicCourseCard
                            key={course.id}
                            data={course}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
