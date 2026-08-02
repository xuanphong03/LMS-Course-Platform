export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_REQUEST: '/verify-request',
    ADMIN: '/admin',
    ADMIN_COURSES: '/admin/courses',
    ADMIN_COURSES_CREATE: '/admin/courses/create',
    ADMIN_COURSES_EDIT: (courseId: string) => `/admin/courses/${courseId}/edit`,
    ADMIN_COURSES_DELETE: (courseId: string) => `/admin/courses/${courseId}/delete`,
    FORBIDDEN: '/forbidden',
    ADMIN_LESSONS_EDIT: (courseId: string, chapterId: string, lessonId: string) =>
        `/admin/courses/${courseId}/${chapterId}/${lessonId}`,
    PUBLIC_COURSES: '/courses',
    PUBLIC_COURSE_DETAIL: (courseSlug: string) => `/courses/${courseSlug}`,
    USER_DASHBOARD: '/dashboard',
    USER_DASHBOARD_COURSE_DETAIL: (courseSlug: string) => `/dashboard/${courseSlug}`,
    USER_DASHBOARD_LESSON_DETAIL: (courseSlug: string, lessonId: string) => `/dashboard/${courseSlug}/${lessonId}`,
}
