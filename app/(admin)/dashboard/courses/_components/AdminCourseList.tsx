import AdminCourseCard from '@/app/(admin)/dashboard/courses/_components/AdminCourseCard'
import { AdminCourseType } from '@/app/data/admin/admin-get-courses'
import React from 'react'

interface AdminCourseListProps {
    data: AdminCourseType[]
}

export default function AdminCourseList({ data }: AdminCourseListProps) {
    return (
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2'>
            {Array.isArray(data) &&
                data?.map((item) => (
                    <AdminCourseCard
                        key={item.id}
                        data={item}
                    />
                ))}
        </div>
    )
}
