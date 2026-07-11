'use client'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ROUTES } from '@/consts/routes'
import { UserDropdown } from '@/layouts/public/_components/UserDropdown'
import { authClient } from '@/lib/auth-client'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

interface NavigationItemProps {
    name: string
    href: string
}

const navigationItems: NavigationItemProps[] = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'Courses', href: ROUTES.COURSES },
    { name: 'Dashboard', href: ROUTES.DASHBOARD },
]

export default function Header() {
    const { data: session, isPending } = authClient.useSession()

    return (
        <header className='bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b'>
            <div className='mx-auto flex max-w-350 items-center justify-between space-x-8 py-4'>
                <Link href={ROUTES.HOME}>Logo</Link>

                {/* Desktop navigation */}
                <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                    <nav>
                        <ul className='flex items-center space-x-2'>
                            {navigationItems.map((navigationItem, index) => (
                                <li key={index}>
                                    <Link
                                        href={navigationItem.href}
                                        className='hover:text-primary text-sm font-medium transition-colors'
                                    >
                                        {navigationItem.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className='relative flex items-center space-x-4'>
                        <ThemeToggle />
                        {isPending ? null : session ? (
                            <UserDropdown
                                name={session?.user?.name}
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
            </div>
        </header>
    )
}
