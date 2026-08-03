'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { ROUTES } from '@/consts/routes'
import useSignout from '@/hooks/use-signout'
import { NavigationItemProps } from '@/layouts/public/Header'
import { authClient } from '@/lib/auth-client'
import { LogInIcon, LogOutIcon, MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface MenuMobileProps {
    navigationItems: NavigationItemProps[]
}

export default function MenuMobile({ navigationItems }: MenuMobileProps) {
    const { data: session, isPending } = authClient.useSession()
    const { signOutPending, handleSignOut } = useSignout()

    const userName = session?.user.name ?? session?.user.email.split('@')[0]

    return (
        <Drawer swipeDirection='right'>
            <DrawerTrigger
                render={
                    <Button
                        variant='outline'
                        size='icon'
                    />
                }
            >
                <MenuIcon className='size-4' />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className='hidden'>
                    <DrawerTitle>Menu mobile</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className='p-4'>
                    <div className='border-border mb-4 border-b pb-2'>
                        {isPending || session ? (
                            <div className='flex items-center gap-x-2'>
                                <Avatar>
                                    <AvatarImage
                                        src={session?.user.image || ''}
                                        alt={session?.user.name || ''}
                                    />
                                    <AvatarFallback>{userName?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='text-muted-foreground truncate text-sm font-medium'>
                                        {userName}
                                    </span>
                                    <span className='text-muted-foreground truncate text-xs font-normal'>
                                        {session?.user.email}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href={ROUTES.HOME}
                                className='flex items-center gap-1'
                            >
                                <Image
                                    alt='LMS Courses Platform'
                                    src='/images/phonghub-icon.svg'
                                    width={48}
                                    height={48}
                                    className='xsm:w-10 h-auto w-12'
                                />
                                <p className='text-base font-bold'>Ph.Hub</p>
                            </Link>
                        )}
                    </div>

                    <nav>
                        <ul className='space-y-4'>
                            {navigationItems?.map((navigationItem, index) => (
                                <li
                                    key={index}
                                    className='not-last:after:border-border not-last:after:mt-4 not-last:after:block not-last:after:w-full not-last:after:border-t'
                                >
                                    <Link
                                        href={navigationItem.href}
                                        className='flex items-center gap-x-1 text-sm'
                                    >
                                        {navigationItem.icon}
                                        {navigationItem.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <DrawerFooter>
                    {isPending || !session ? (
                        <>
                            <Link
                                href={ROUTES.LOGIN}
                                className={buttonVariants({ variant: 'secondary' })}
                            >
                                <LogInIcon />
                                Login
                            </Link>
                            <Link
                                href={ROUTES.LOGIN}
                                className={buttonVariants()}
                            >
                                Get started
                            </Link>
                        </>
                    ) : (
                        <Button
                            disabled={signOutPending}
                            onClick={handleSignOut}
                            className='cursor-pointer'
                        >
                            <LogOutIcon />
                            Logout
                        </Button>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
