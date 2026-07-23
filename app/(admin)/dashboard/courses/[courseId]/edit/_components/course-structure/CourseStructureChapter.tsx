import LessonGroup from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/LessonGroup'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import type { CourseStructureItem } from './course-structure.types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react'
import NewLessonModal from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/NewLessonModal'
import DeleteChapter from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/DeleteChapter'

interface CourseStructureChapterProps {
    courseId: string
    chapter: CourseStructureItem
    index: number
    isOpen: boolean
    isDragDisabled: boolean
    onToggle: (chapterId: string) => void
}

/**
 * Tách presentation của một chapter khỏi DnD lifecycle để state và persistence chỉ
 * có một nơi quản lý trong ChapterGroup; component này không mở client boundary riêng.
 */
export function CourseStructureChapter({
    courseId,
    chapter,
    index,
    isOpen,
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
                        open={isOpen}
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
                                    {isOpen ? (
                                        <ChevronDownIcon className='size-4' />
                                    ) : (
                                        <ChevronUpIcon className='size-4' />
                                    )}
                                </CollapsibleTrigger>
                                <p className='hover:text-primary cursor-pointer pl-2'>{chapter.title}</p>
                            </div>
                            <DeleteChapter
                                courseId={courseId}
                                chapterId={chapter.id}
                            />
                        </div>
                        <CollapsibleContent>
                            <div className='p-1'>
                                <LessonGroup
                                    courseId={courseId}
                                    chapter={chapter}
                                    isDragDisabled={isDragDisabled}
                                />
                                <div className='p-2'>
                                    <NewLessonModal
                                        courseId={courseId}
                                        chapterId={chapter.id}
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            )}
        </SortableItem>
    )
}
