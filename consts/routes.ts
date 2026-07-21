export const ROUTES = {
    HOME: '/',
    COURSES: '/courses',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_REQUEST: '/verify-request',
    DASHBOARD: '/dashboard',
    DASHBOARD_COURSES: '/dashboard/courses',
    DASHBOARD_COURSES_CREATE: '/dashboard/courses/create',
    DASHBOARD_COURSES_EDIT: (courseId: string) => `/dashboard/courses/${courseId}/edit`,
    DASHBOARD_COURSES_DELETE: (courseId: string) => `/dashboard/courses/${courseId}/delete`,
    COURSE_DETAIL: (courseId: string) => `/courses/${courseId}`,
    FORBIDDEN: '/forbidden',
    DASHBOARD_LESSONS_EDIT: (courseId: string, chapterId: string, lessonId: string) =>
        `/dashboard/courses/${courseId}/${chapterId}/${lessonId}`,
}
