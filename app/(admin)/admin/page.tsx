import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { DataTable } from '@/components/sidebar/data-table'
import { SectionCards } from '@/components/sidebar/section-cards'

import data from '@/app/(admin)/data.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Overview of LMS Course Platform activity and data.',
}

export default function DashboardPage() {
    return (
        <>
            <SectionCards />
            <ChartAreaInteractive />
            <DataTable data={data} />
        </>
    )
}
