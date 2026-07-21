'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { ReactNode } from 'react'

interface SortItemProps {
    id: string
    index: number
    data?: {
        type: 'chapter' | 'lesson'
        chapterId?: string
    }
    children: ReactNode
}
export default function SortableItem({ id, index, data, children }: SortItemProps) {
    const { ref } = useSortable({
        id,
        index,
        data,
        transition: {
            duration: 150,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
    })
    return <div ref={ref}>{children}</div>
}
