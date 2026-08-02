import { CourseSidebarDataType } from '@/app/data/course/get-course-sidebar-data'
import { useMemo } from 'react'

interface CourseProgressProps {
    courseData: CourseSidebarDataType['course']
}

interface CourseProgressResponse {
    totalLessons: number
    completedLessons: number
    progressPercentage: number
}

export default function useCourseProgress({ courseData }: CourseProgressProps): CourseProgressResponse {
    return useMemo(() => {
        let totalLessons = 0
        let completedLessons = 0

        courseData.chapters.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                totalLessons++

                // Kiểm tra khoá học hoàn thành chưa
                const isCompleted = lesson.lessonProgress.some(
                    (progress) => progress.lessonId === lesson.id && progress.completed,
                )
                if (isCompleted) {
                    completedLessons++
                }
            })
        })

        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
        return {
            totalLessons,
            completedLessons,
            progressPercentage,
        }
    }, [courseData])
}
