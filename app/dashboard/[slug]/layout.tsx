export default function DashboardCourseDetailLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className='flex flex-1'>
            <aside className='border-border w-80 shrink-0 border-r'>
                <p>Sidebar</p>
            </aside>
            <div className='flex-1 overflow-hidden'>{children}</div>
        </div>
    )
}
