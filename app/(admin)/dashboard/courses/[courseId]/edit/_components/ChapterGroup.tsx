'use client'
import { CourseStructureType } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/CourseStructure'
import LessonGroup, { getLessonGroupId } from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/LessonGroup'
import SortableItem from '@/app/(admin)/dashboard/courses/[courseId]/edit/_components/SortableItem'
import { reorderChapters, reorderLessons } from '@/app/(admin)/dashboard/courses/[courseId]/edit/actions'
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'

interface ChapterGroupProps {
    data: AdminCourseSingularType
    items: CourseStructureType[]
    setItems: Dispatch<SetStateAction<CourseStructureType[]>>
}

export default function ChapterGroup({ data, items, setItems }: ChapterGroupProps) {
    const itemsSnapshot = useRef(items)
    const latestItems = useRef(items)
    const [, startTransition] = useTransition()

    const handleToggleChapter = (chapterId: string) => {
        setItems(items.map((chapter) => (chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)))
    }

    const handleDragStart = (event: DragStartEvent) => {
        // Lưu trạng thái trước khi kéo để có thể khôi phục nếu người dùng hủy
        // thao tác hoặc quá trình đồng bộ thứ tự với server thất bại.
        if (event.operation.source) {
            itemsSnapshot.current = latestItems.current
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        // Chapter chỉ được chốt thứ tự khi thả; riêng lesson phải cập nhật trạng thái
        // ngay khi đi qua danh sách khác để React luôn đồng bộ với DOM của dnd-kit.
        if (event.operation.source?.type !== 'lesson') return

        setItems((currentItems) => {
            // Chuyển cấu trúc chapter lồng nhau thành Record<groupId, lessons>
            // để hàm move xử lý thống nhất cả đổi thứ tự và chuyển khác chapter.
            const currentLessonGroups = Object.fromEntries(
                currentItems.map((chapter) => [getLessonGroupId(chapter.id), chapter.lessons]),
            )
            const nextLessonGroups = move(currentLessonGroups, event)

            // move trả lại cùng tham chiếu khi vị trí không đổi; bỏ qua lần kết xuất thừa.
            if (nextLessonGroups === currentLessonGroups) return currentItems

            // Đưa kết quả về cấu trúc trạng thái ban đầu và chuẩn hóa lại order từ 0.
            const nextItems = currentItems.map((chapter) => ({
                ...chapter,
                lessons: nextLessonGroups[getLessonGroupId(chapter.id)].map((lesson, lessonIndex) => ({
                    ...lesson,
                    order: lessonIndex,
                })),
            }))

            latestItems.current = nextItems
            return nextItems
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { source } = event.operation

        // Lesson đã được cập nhật trong onDragOver nên khi hủy phải khôi phục
        // bản chụp trạng thái; dnd-kit tự hoàn tác phần hiển thị lạc quan của chapter.
        if (event.canceled) {
            if (source?.type === 'lesson') {
                latestItems.current = itemsSnapshot.current
                setItems(itemsSnapshot.current)
            }

            return
        }

        if (!isSortable(source)) return

        if (source.type === 'lesson') {
            // Tạo dữ liệu gửi từ trạng thái cuối cùng sau khi thả. Mỗi lesson cần cả
            // chapterId và position để server hỗ trợ di chuyển khác chapter.
            const currentLessons = latestItems.current.flatMap((chapter) =>
                chapter.lessons.map((lesson, position) => ({
                    id: lesson.id,
                    chapterId: chapter.id,
                    position,
                })),
            )
            const previousLessonPositions = new Map(
                itemsSnapshot.current.flatMap((chapter) =>
                    chapter.lessons.map((lesson, position) => [lesson.id, `${chapter.id}:${position}`] as const),
                ),
            )
            const hasChanged = currentLessons.some(
                (lesson) => previousLessonPositions.get(lesson.id) !== `${lesson.chapterId}:${lesson.position}`,
            )

            // Không gọi Server Action nếu lesson được thả lại vị trí ban đầu.
            if (!hasChanged) return

            // Chỉ đồng bộ cơ sở dữ liệu một lần sau khi thao tác kéo đã hoàn tất.
            startTransition(() => {
                const reorderPromise = reorderLessons({ courseId: data.id, lessons: currentLessons }).then((result) => {
                    if (result.status === 'error') throw new Error(result.message)
                    return result.message
                })

                toast.promise(reorderPromise, {
                    loading: 'Reordering lessons',
                    success: (message) => message,
                    error: (error) => {
                        latestItems.current = itemsSnapshot.current
                        setItems(itemsSnapshot.current)
                        return error instanceof Error ? error.message : 'Failed to reorder lessons'
                    },
                })
            })

            return
        }

        const { initialIndex, index } = source

        if (source.type === 'chapter') {
            // Chapter là một danh sách phẳng nên chỉ cần cập nhật trạng thái khi thả,
            // thay vì kết xuất lại liên tục trong onDragOver như lesson.
            if (initialIndex === index) return

            const nextItems = [...latestItems.current]
            const [movedChapter] = nextItems.splice(initialIndex, 1)

            if (!movedChapter) return

            nextItems.splice(index, 0, movedChapter)

            const reorderedItems = nextItems.map((chapter, chapterIndex) => ({
                ...chapter,
                order: chapterIndex,
            }))
            const chapters = reorderedItems.map((chapter, position) => ({
                id: chapter.id,
                position,
            }))

            latestItems.current = reorderedItems
            setItems(reorderedItems)

            // Lưu thứ tự chapter sau khi cập nhật lạc quan trên trạng thái cục bộ;
            // nếu action thất bại, hàm xử lý lỗi sẽ khôi phục bản chụp trạng thái.
            startTransition(() => {
                const reorderPromise = reorderChapters({ courseId: data.id, chapters }).then((result) => {
                    if (result.status === 'error') throw new Error(result.message)
                    return result.message
                })

                toast.promise(reorderPromise, {
                    loading: 'Reordering chapters',
                    success: (message) => message,
                    error: (error) => {
                        latestItems.current = itemsSnapshot.current
                        setItems(itemsSnapshot.current)
                        return error instanceof Error ? error.message : 'Failed to reorder chapters'
                    },
                })
            })

            return
        }
    }

    useEffect(() => {
        latestItems.current = items
    }, [items])

    return (
        <DragDropProvider
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {items.map((chapterItem, chapterIndex) => (
                <SortableItem
                    data={{ type: 'chapter' }}
                    key={chapterItem.id}
                    id={chapterItem.id}
                    index={chapterIndex}
                    type='chapter'
                    accept='chapter'
                >
                    {({ handleRef }) => (
                        <Card>
                            <Collapsible
                                open={chapterItem.isOpen}
                                onOpenChange={() => handleToggleChapter(chapterItem.id)}
                            >
                                <div className='border-border flex items-center justify-between border-b p-3'>
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
                    )}
                </SortableItem>
            ))}
        </DragDropProvider>
    )
}
