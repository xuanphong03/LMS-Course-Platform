'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { ROUTES } from '@/consts/routes'
import useSignout from '@/hooks/use-signout'
import { authClient } from '@/lib/auth-client'
import { EllipsisVerticalIcon, LogOutIcon, HomeIcon, LayoutDashboardIcon, Tv2Icon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface DropdownItem {
    icon: ReactNode
    name: string
    href: string
}

const dropdownItems: DropdownItem[] = [
    { icon: <HomeIcon />, name: 'Homepage', href: ROUTES.HOME },
    { icon: <LayoutDashboardIcon />, name: 'Dashboard', href: ROUTES.DASHBOARD },
    { icon: <Tv2Icon />, name: 'Courses', href: ROUTES.DASHBOARD_COURSES },
]

export function NavUser() {
    const { isMobile } = useSidebar()
    const { data: session, isPending } = authClient.useSession()
    const { signOutPending, handleSignOut } = useSignout()

    if (isPending) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size='lg'
                                className='aria-expanded:bg-muted'
                            />
                        }
                    >
                        <Avatar className='size-8 rounded-lg grayscale'>
                            <AvatarImage
                                src={session?.user?.image || ''}
                                alt={session?.user?.name || ''}
                            />
                            <AvatarFallback className='rounded-lg'>
                                {session?.user?.name && session?.user?.name?.length > 0
                                    ? session?.user?.name?.charAt(0)?.toUpperCase()
                                    : session?.user?.email?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 text-left text-sm leading-tight'>
                            <span className='truncate font-medium'>
                                {session?.user?.name && session?.user?.name?.length > 0
                                    ? session?.user?.name
                                    : session?.user?.email?.split('@')[0]}
                            </span>
                            <span className='text-foreground/70 truncate text-xs'>{session?.user?.email}</span>
                        </div>
                        <EllipsisVerticalIcon className='ml-auto size-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='min-w-56'
                        side={isMobile ? 'bottom' : 'right'}
                        align='end'
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                    <Avatar className='size-8'>
                                        <AvatarImage
                                            src={session?.user?.image || ''}
                                            alt={session?.user?.name || ''}
                                        />
                                        <AvatarFallback className='rounded-lg'>
                                            {session?.user?.name && session?.user?.name?.length > 0
                                                ? session?.user?.name?.charAt(0)?.toUpperCase()
                                                : session?.user?.email?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-medium'>{session?.user?.name}</span>
                                        <span className='text-foreground/70 truncate text-xs'>
                                            {session?.user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {dropdownItems?.map((dropdownItem, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    render={
                                        <Link
                                            className='cursor-pointer'
                                            href={dropdownItem.href}
                                        />
                                    }
                                >
                                    {dropdownItem.icon} {dropdownItem.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            disabled={signOutPending}
                            className='cursor-pointer'
                        >
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
