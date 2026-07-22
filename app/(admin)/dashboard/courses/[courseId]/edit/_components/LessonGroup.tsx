'use client'
import { CourseStructureType } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/CourseStructure'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { FileTextIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'

interface ChapterGroupProps {
    data: AdminCourseSingularType
    chapter: CourseStructureType
}

export const getLessonGroupId = (chapterId: string) => `lesson-list-${chapterId}`

export default function LessonGroup({ data, chapter }: ChapterGroupProps) {
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
            className='min-h-2'
        >
            {chapter.lessons.map((lessonItem, lessonIndex) => (
                <SortableItem
                    id={lessonItem.id}
                    index={lessonIndex}
                    type='lesson'
                    accept='lesson'
                    group={groupId}
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
                                    className='cursor-grab opacity-60 hover:opacity-100'
                                >
                                    <GripVerticalIcon className='size-4' />
                                </Button>
                                <FileTextIcon className='size-4' />
                                <Link href={ROUTES.DASHBOARD_LESSONS_EDIT(data.id, chapter.id, lessonItem.id)}>
                                    {lessonItem.title}
                                </Link>
                            </div>
                            <Button
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
