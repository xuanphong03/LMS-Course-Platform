import { AdminDashboardStatsType } from '@/app/data/admin/admin-get-dashboard-stats'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBook, IconPlaylistX, IconShoppingCart, IconUsers } from '@tabler/icons-react'

export async function SectionCards({ data }: { data: AdminDashboardStatsType }) {
    if (!data) return null
    const { totalSignUps, totalCustomers, totalCourses, totalLessons } = data

    return (
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2'>
            <MetricCard
                title='Total Sign Ups'
                value={totalSignUps}
                description='Registered users on the platform'
                icon={<IconUsers className='text-muted-foreground size-6' />}
            />
            <MetricCard
                title='Total Customers'
                value={totalCustomers}
                description='Users who have enrolled in courses'
                icon={<IconShoppingCart className='text-muted-foreground size-6' />}
            />
            <MetricCard
                title='Total Courses'
                value={totalCourses}
                description='Available courses on the platform'
                icon={<IconBook className='text-muted-foreground size-6' />}
            />
            <MetricCard
                title='Total Lessons'
                value={totalLessons}
                description='Total learning content available'
                icon={<IconPlaylistX className='text-muted-foreground size-6' />}
            />
        </div>
    )
}

function MetricCard({
    title,
    value,
    description,
    icon,
}: {
    title: string
    value: string | number
    description: string
    icon: React.ReactNode
}) {
    return (
        <Card className='@container/card'>
            <CardHeader className='flex flex-row items-center justify-between space-y-2 pb-2'>
                <div>
                    <CardDescription>{title}</CardDescription>
                    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        {value}
                    </CardTitle>
                </div>
                {icon}
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                <p className='text-muted-foreground'>{description}</p>
            </CardFooter>
        </Card>
    )
}
