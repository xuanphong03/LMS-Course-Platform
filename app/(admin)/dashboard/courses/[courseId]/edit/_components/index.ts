import ContentBasicInfo from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/ContentBasicInfo'
import ContentCourseStructure from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/ContentCourseStructure'

// Barrel phía server chỉ export các entry point mà page sử dụng. Các module DnD
// được import bên dưới client boundary để không vô tình mở rộng client graph.
export { ContentBasicInfo, ContentCourseStructure }
