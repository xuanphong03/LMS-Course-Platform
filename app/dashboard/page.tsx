import SectionEnrolledCourses from '@/app/dashboard/_components/SectionEnrolledCourses'
import SectionUnenrolledCourses from '@/app/dashboard/_components/SectionUnenrolledCourses'
import { getAllCourses } from '@/app/data/course/get-all-courses'
import { getEnrolledCourses } from '@/app/data/user/get-enrolled-courses'

export default async function DashboardPage() {
    const [allCourses, enrolledCourses] = await Promise.all([getAllCourses(), getEnrolledCourses()])

    const unenrolledCourses =
        allCourses.filter(
            (course) => !enrolledCourses.some(({ course: enrolledCourse }) => course.id === enrolledCourse.id),
        ) || []

    return (
        <>
            <h1 className='sr-only'>My Learning Dashboard</h1>
            <SectionEnrolledCourses data={enrolledCourses} />
            <SectionUnenrolledCourses data={unenrolledCourses} />
        </>
    )
}
