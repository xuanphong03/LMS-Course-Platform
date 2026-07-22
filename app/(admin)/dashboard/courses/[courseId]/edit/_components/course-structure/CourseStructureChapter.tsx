'use client'

import LessonGroup from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/LessonGroup'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import type { CourseStructureItem } from './course-structure.types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'

interface CourseStructureChapterProps {
    courseId: string
    chapter: CourseStructureItem
    index: number
    isDragDisabled: boolean
    onToggle: (chapterId: string) => void
}

/**
 * Render một sortable chapter và toàn bộ lesson bên trong.
 * Component này chỉ phụ trách presentation; state và persistence nằm ở ChapterGroup.
 */
export function CourseStructureChapter({
    courseId,
    chapter,
    index,
    isDragDisabled,
    onToggle,
}: CourseStructureChapterProps) {
    return (
        <SortableItem
            data={{ type: 'chapter' }}
            id={chapter.id}
            index={index}
            type='chapter'
            accept='chapter'
            disabled={isDragDisabled}
        >
            {({ handleRef }) => (
                <Card>
                    <Collapsible
                        open={chapter.isOpen}
                        onOpenChange={() => onToggle(chapter.id)}
                    >
                        <div className='border-border flex items-center justify-between border-b p-3'>
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
                                <CollapsibleTrigger
                                    render={
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            className='flex items-center'
                                        />
                                    }
                                >
                                    {chapter.isOpen ? (
                                        <ChevronDownIcon className='size-4' />
                                    ) : (
                                        <ChevronUpIcon className='size-4' />
                                    )}
                                </CollapsibleTrigger>
                                <p className='hover:text-primary cursor-pointer pl-2'>{chapter.title}</p>
                            </div>
                            <Button
                                type='button'
                                variant='outline'
                            >
                                <TrashIcon className='size-4' />
                            </Button>
                        </div>
                        <CollapsibleContent>
                            <div className='p-1'>
                                <LessonGroup
                                    courseId={courseId}
                                    chapter={chapter}
                                    isDragDisabled={isDragDisabled}
                                />
                                <div className='p-2'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        className='w-full'
                                    >
                                        Create new lesson
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            )}
        </SortableItem>
    )
}
