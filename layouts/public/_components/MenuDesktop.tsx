import { NavigationItemProps } from '@/layouts/public/Header'
import Link from 'next/link'

interface MenuDesktopProps {
    navigationItems: NavigationItemProps[]
}

export default function MenuDesktop({ navigationItems }: MenuDesktopProps) {
    return (
        <nav>
            <ul className='flex items-center gap-x-5'>
                {navigationItems.map((navigationItem, index) => (
                    <li
                        key={index}
                        className='not-last:after:border-border flex items-center not-last:gap-x-5 not-last:after:self-stretch not-last:after:border-r not-last:after:border-solid'
                    >
                        <Link
                            href={navigationItem.href}
                            className='hover:text-primary flex items-center gap-x-1 text-sm font-medium transition-colors'
                        >
                            {navigationItem.icon}
                            {navigationItem.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
