'use client'

import { closestCorners } from '@dnd-kit/collision'
import { useSortable } from '@dnd-kit/react/sortable'
import type { ReactNode, Ref } from 'react'

interface SortItemProps {
    id: string
    index: number
    type: 'chapter' | 'lesson'
    accept: 'chapter' | 'lesson'
    group?: string
    disabled?: boolean
    data?: {
        type: 'chapter' | 'lesson'
        chapterId?: string
    }
    children: (props: { handleRef: Ref<HTMLButtonElement> }) => ReactNode
}
export default function SortableItem({
    id,
    index,
    type,
    accept,
    group,
    disabled = false,
    data,
    children,
}: SortItemProps) {
    const { ref, handleRef } = useSortable({
        id,
        index,
        type,
        accept,
        group,
        // Khóa entity ở tầng dnd-kit để cả pointer và keyboard sensor đều không
        // thể khởi tạo drag trong lúc thứ tự đang được đồng bộ với server.
        disabled,
        data,
        // closestCorners bắt mục đầu/cuối sớm hơn khi kéo sát mép danh sách dọc,
        // giúp việc đưa item lên đầu hoặc xuống cuối ít bị mất mục tiêu thả.
        collisionDetector: closestCorners,
        transition: {
            duration: 200,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            // Tiếp tục tạo hiệu ứng chuyển động khi trạng thái được khôi phục sau lỗi hoặc bị hủy.
            idle: true,
        },
    })
    return <div ref={ref}>{children({ handleRef })}</div>
}
