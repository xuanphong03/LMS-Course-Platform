'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { ReactNode, Ref } from 'react'

interface SortItemProps {
    id: string
    index: number
    type: 'chapter' | 'lesson'
    accept: 'chapter' | 'lesson'
    group?: string
    data?: {
        type: 'chapter' | 'lesson'
        chapterId?: string
    }
    children: (props: { handleRef: Ref<HTMLButtonElement> }) => ReactNode
}
export default function SortableItem({ id, index, type, accept, group, data, children }: SortItemProps) {
    const { ref, handleRef } = useSortable({
        id,
        index,
        type,
        accept,
        group,
        data,
        transition: {
            duration: 250, // Animation duration in ms
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Animation easing
        },
    })
    return <div ref={ref}>{children({ handleRef })}</div>
}
