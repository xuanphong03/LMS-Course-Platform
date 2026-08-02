import { DashboardCourseCardSkeleton } from '@/app/dashboard/_components/DashboardCourseCard'
import React from 'react'

export default function DashboardCourseCardSkeletonLayout() {
    return (
        <div
            aria-busy='true'
            className='grid grid-cols-1 gap-6 sm:grid-cols-2'
        >
            {Array.from({ length: 4 }, (_, index) => (
                <DashboardCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}
