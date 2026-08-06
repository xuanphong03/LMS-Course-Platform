'use client'
import { buttonVariants } from '@/components/ui/button'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ROUTES } from '@/consts/routes'
import MenuDesktop from '@/layouts/public/_components/MenuDesktop'
import MenuMobile from '@/layouts/public/_components/MenuMobile'

import { UserDropdown } from '@/layouts/public/_components/UserDropdown'
import { authClient } from '@/lib/auth-client'
import { BookIcon, HomeIcon, LayoutDashboardIcon, LogIn, ShieldCheckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'

export interface NavigationItemProps {
    name: string
    href: string
    icon: React.ReactNode
}

const defaultNavigationItems: NavigationItemProps[] = [
    { name: 'Home', href: ROUTES.HOME, icon: <HomeIcon className='size-4' /> },
    { name: 'Courses', href: ROUTES.PUBLIC_COURSES, icon: <BookIcon className='size-4' /> },
    { name: 'My courses', href: ROUTES.USER_DASHBOARD, icon: <LayoutDashboardIcon className='size-4' /> },
]

export default function Header() {
    const { data: session, isPending } = authClient.useSession()

    const navigationItems = useMemo<NavigationItemProps[]>(() => {
        if (session?.user.role !== 'admin') {
            return defaultNavigationItems
        }

        return [
            ...defaultNavigationItems,
            {
                name: 'Dashboard',
                href: ROUTES.ADMIN,
                icon: <ShieldCheckIcon className='size-4' />,
            },
        ]
    }, [session?.user.role])

    return (
        <header className='xsm:top-0 fixed top-2.5 right-0 left-0 z-50 w-full'>
            <div className='mx-auto w-full max-w-7xl'>
                <div className='bg-background/95 xsm:rounded-none xsm:border-x-0 xsm:border-t-0 border-border rounded-xl border border-solid backdrop-blur-[1px]'>
                    <div className='xsm:gap-x-0 xsm:px-2.5 flex h-full items-center justify-between gap-x-20 px-5 py-2.5'>
                        <Link
                            href={ROUTES.HOME}
                            className='flex items-center'
                        >
                            <Image
                                alt='LMS Courses Platform'
                                src='/images/phonghub-icon.svg'
                                width={48}
                                height={48}
                                className='xsm:w-10 h-auto w-12'
                            />
                            <p className='xsm:hidden text-xl font-bold'>Ph.Hub</p>
                        </Link>

                        {/* Desktop navigation */}
                        <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                            <MenuDesktop navigationItems={navigationItems} />

                            <div className='relative flex items-center space-x-4'>
                                <ThemeToggle />
                                {isPending ? null : session ? (
                                    <UserDropdown
                                        name={session?.user?.name || ''}
                                        email={session?.user?.email}
                                        avatar={session?.user?.image || ''}
                                    />
                                ) : (
                                    <>
                                        <Link
                                            href={ROUTES.LOGIN}
                                            className={buttonVariants({ variant: 'secondary' })}
                                        >
                                            <LogIn />
                                            Login
                                        </Link>
                                        <Link
                                            href={ROUTES.LOGIN}
                                            className={buttonVariants()}
                                        >
                                            Get started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile navigation */}
                        <div className='xsm:flex xsm:items-center xsm:gap-x-2 hidden'>
                            <ThemeToggle />
                            <MenuMobile navigationItems={navigationItems} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
