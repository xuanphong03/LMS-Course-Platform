import { DashboardAppSidebar } from '@/app/dashboard/_components/DashboardAppSidebar'
import { requireUser } from '@/app/data/user/require-user'
import { SiteHeader } from '@/components/sidebar/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'User Dashboard',
    description: 'User area for managing courses and learning content in LMS Course Platform.',
    robots: {
        index: false,
        follow: false,
    },
}

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // Bảo vệ ở Server Component để request không có session không thể render dashboard,
    // kể cả khi middleware bị bỏ qua hoặc cookie chỉ là trạng thái tạm thời.
    await requireUser()

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <DashboardAppSidebar variant='inset' />
            <SidebarInset>
                <SiteHeader />
                <div className='flex flex-1 flex-col'>
                    <div className='@container/main flex flex-1 flex-col gap-2'>
                        <div className='flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6'>{children}</div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
