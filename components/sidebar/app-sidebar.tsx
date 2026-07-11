'use client'

import * as React from 'react'

import { NavMain } from '@/components/sidebar/nav-main'
import { NavSecondary } from '@/components/sidebar/nav-secondary'
import { NavUser } from '@/components/sidebar/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
    LayoutDashboardIcon,
    ListIcon,
    ChartBarIcon,
    FolderIcon,
    UsersIcon,
    CameraIcon,
    FileTextIcon,
    Settings2Icon,
    CircleHelpIcon,
    SearchIcon,
    CommandIcon,
} from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/consts/routes'

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: ROUTES.DASHBOARD,
            icon: <LayoutDashboardIcon />,
        },
        {
            title: 'Courses',
            url: ROUTES.DASHBOARD_COURSES,
            icon: <ListIcon />,
        },
        {
            title: 'Analytics',
            url: '#',
            icon: <ChartBarIcon />,
        },
        {
            title: 'Projects',
            url: '#',
            icon: <FolderIcon />,
        },
        {
            title: 'Team',
            url: '#',
            icon: <UsersIcon />,
        },
    ],
    navClouds: [
        {
            title: 'Capture',
            icon: <CameraIcon />,
            isActive: true,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Proposal',
            icon: <FileTextIcon />,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Prompts',
            icon: <FileTextIcon />,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: <Settings2Icon />,
        },
        {
            title: 'Get Help',
            url: '#',
            icon: <CircleHelpIcon />,
        },
        {
            title: 'Search',
            url: '#',
            icon: <SearchIcon />,
        },
    ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible='offcanvas'
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className='data-[slot=sidebar-menu-button]:p-1.5!'
                            render={<Link href='/' />}
                        >
                            <CommandIcon className='size-5!' />
                            <span className='text-base font-semibold'>LMS Course Platform</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary
                    items={data.navSecondary}
                    className='mt-auto'
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
