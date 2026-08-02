'use client'

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/consts/routes'
import { cn } from '@/lib/utils'
import { CirclePlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: React.ReactNode
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupContent className='flex flex-col gap-2'>
                {pathname.startsWith(ROUTES.ADMIN) && (
                    <SidebarMenu>
                        <SidebarMenuItem className='flex items-center gap-2'>
                            <SidebarMenuButton
                                tooltip='Quick Create'
                                className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
                                render={<Link href={ROUTES.ADMIN_COURSES_CREATE} />}
                            >
                                <CirclePlusIcon />
                                <span>Quick Create</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}

                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                render={
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            pathname === item.url &&
                                                'bg-accent text-accent-foreground !hover:text-accent-foreground !hover:bg-accent',
                                        )}
                                    />
                                }
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
