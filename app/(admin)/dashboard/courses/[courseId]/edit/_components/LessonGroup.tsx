'use client'
import type { CourseStructureItem } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.types'
import { getLessonGroupId } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/course-structure/course-structure.utils'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { FileTextIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'

interface LessonGroupProps {
    courseId: string
    chapter: CourseStructureItem
    isDragDisabled: boolean
}

export default function LessonGroup({ courseId, chapter, isDragDisabled }: LessonGroupProps) {
    const groupId = getLessonGroupId(chapter.id)
    const { ref } = useDroppable({
        id: groupId,
        type: 'lesson-list',
        accept: 'lesson',
        collisionPriority: CollisionPriority.Low,
        data: { chapterId: chapter.id },
    })

    return (
        <div
            ref={ref}
            // Tạo vùng đệm ở hai mép để người dùng có thể thả rõ ràng vào đầu/cuối
            // danh sách, đồng thời giữ một vùng thả đủ lớn khi chapter chưa có lesson.
            className='min-h-12 py-1'
        >
            {chapter.lessons.map((lessonItem, lessonIndex) => (
                <SortableItem
                    id={lessonItem.id}
                    index={lessonIndex}
                    type='lesson'
                    accept='lesson'
                    group={groupId}
                    disabled={isDragDisabled}
                    data={{ type: 'lesson', chapterId: chapter.id }}
                    key={lessonItem.id}
                >
                    {({ handleRef }) => (
                        <div className='hover:bg-accent flex items-center justify-between rounded-sm p-2'>
                            <div className='flex items-center gap-2'>
                                <Button
                                    size='icon'
                                    type='button'
                                    variant='ghost'
                                    ref={handleRef}
                                    disabled={isDragDisabled}
                                    className='cursor-grab opacity-60 hover:opacity-100 disabled:cursor-not-allowed'
                                >
                                    <GripVerticalIcon className='size-4' />
                                </Button>
                                <FileTextIcon className='size-4' />
                                <Link href={ROUTES.DASHBOARD_LESSONS_EDIT(courseId, chapter.id, lessonItem.id)}>
                                    {lessonItem.title}
                                </Link>
                            </div>
                            <Button
                                type='button'
                                size='icon'
                                variant='outline'
                            >
                                <TrashIcon className='size-4' />
                            </Button>
                        </div>
                    )}
                </SortableItem>
            ))}
        </div>
    )
}
