'use client'
import { CourseStructureType } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/CourseStructure'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { FileTextIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'

interface ChapterGroupProps {
    data: AdminCourseSingularType
    chapter: CourseStructureType
    setItems: Dispatch<SetStateAction<CourseStructureType[]>>
}

export default function LessonGroup({ data, chapter, setItems }: ChapterGroupProps) {
    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return
                setItems((items) => move(items, event))
            }}
        >
            {chapter.lessons.map((lessonItem) => (
                <SortableItem
                    id={lessonItem.id}
                    index={lessonItem.order}
                    data={{ type: 'lesson', chapterId: chapter.id }}
                    key={lessonItem.id}
                >
                    <div className='hover:bg-accent flex items-center justify-between rounded-sm p-2'>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='ghost'
                                size='icon'
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
                </SortableItem>
            ))}
        </DragDropProvider>
    )
}
