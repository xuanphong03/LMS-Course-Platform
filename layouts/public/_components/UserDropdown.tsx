'use client'

import { BookOpen, Home, LayoutDashboard, LogOutIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReactNode } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/consts/routes'
import useSignout from '@/hooks/use-signout'
import useUserInitial from '@/hooks/use-user-initial'

interface UserDropdownProps {
    name: string
    email: string
    avatar: string
}

interface DropdownMenuItem {
    name: string
    href: string
    icon: ReactNode
}

const dropdownMenuItems: DropdownMenuItem[] = [
    {
        icon: <Home size={16} />,
        name: 'Home',
        href: ROUTES.HOME,
    },
    {
        icon: <BookOpen size={16} />,
        name: 'Courses',
        href: ROUTES.PUBLIC_COURSES,
    },
    {
        icon: <LayoutDashboard size={16} />,
        name: 'Dashboard',
        href: ROUTES.ADMIN,
    },
]

export function UserDropdown({ name, avatar, email }: UserDropdownProps) {
    const { signOutPending, handleSignOut } = useSignout()
    const userInitial = useUserInitial({ name, email })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant='ghost'
                        size='icon'
                        className='mr-0 rounded-full'
                    >
                        <Avatar>
                            <AvatarImage
                                src={avatar || ''}
                                alt={name || ''}
                            />
                            <AvatarFallback>
                                <span className='font-bold'>{userInitial}</span>
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                }
            />
            <DropdownMenuContent
                align='end'
                className='w-auto max-w-64 min-w-48'
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className='flex flex-col'>
                        <span className='text-muted-foreground truncate text-sm font-medium'>{name}</span>
                        <span className='text-muted-foreground truncate text-xs font-normal'>{email}</span>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {dropdownMenuItems.map((dropdownItem, index) => (
                        <DropdownMenuItem
                            key={index}
                            render={
                                <Link
                                    href={dropdownItem.href}
                                    className='cursor-pointer'
                                >
                                    {dropdownItem.icon} {dropdownItem.name}
                                </Link>
                            }
                        />
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={signOutPending}
                    onClick={handleSignOut}
                    className='cursor-pointer'
                >
                    <LogOutIcon />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
