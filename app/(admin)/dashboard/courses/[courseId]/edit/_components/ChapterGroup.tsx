'use client'
import { CourseStructureType } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/CourseStructure'
import LessonGroup from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/LessonGroup'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface ChapterGroupProps {
    data: AdminCourseSingularType
    items: CourseStructureType[]
    setItems: Dispatch<SetStateAction<CourseStructureType[]>>
}

export default function ChapterGroup({ data, items, setItems }: ChapterGroupProps) {
    const handleToggleChapter = (chapterId: string) => {
        setItems(items.map((chapter) => (chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)))
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return
                setItems((items) => move(items, event))
            }}
        >
            {items.map((chapterItem) => (
                <SortableItem
                    data={{ type: 'chapter' }}
                    key={chapterItem.id}
                    id={chapterItem.id}
                    index={chapterItem.order}
                >
                    <Card>
                        <Collapsible
                            open={chapterItem.isOpen}
                            onOpenChange={() => handleToggleChapter(chapterItem.id)}
                        >
                            <div className='border-border flex items-center justify-between border-b p-3'>
                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant='ghost'
                                        className='cursor-grab opacity-60 hover:opacity-100'
                                    >
                                        <GripVerticalIcon className='size-4' />
                                    </Button>
                                    <CollapsibleTrigger
                                        render={
                                            <Button
                                                variant='ghost'
                                                className='flex items-center'
                                            />
                                        }
                                    >
                                        {chapterItem.isOpen ? (
                                            <ChevronDownIcon className='size-4' />
                                        ) : (
                                            <ChevronUpIcon className='size-4' />
                                        )}
                                    </CollapsibleTrigger>
                                    <p className='hover:text-primary cursor-pointer pl-2'>{chapterItem.title}</p>
                                </div>
                                <Button variant='outline'>
                                    <TrashIcon className='size-4' />
                                </Button>
                            </div>
                            <CollapsibleContent>
                                <div className='p-1'>
                                    <LessonGroup
                                        data={data}
                                        setItems={setItems}
                                        chapter={chapterItem}
                                    />
                                    <div className='p-2'>
                                        <Button
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
                </SortableItem>
            ))}
        </DragDropProvider>
    )
}
