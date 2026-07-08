import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative flex min-h-svh w-full flex-col items-center justify-center'>
            <Link
                href='/'
                className={buttonVariants({
                    variant: 'outline',
                    className: 'absolute top-4 left-4',
                })}
            >
                <ArrowLeft />
                <span>Home</span>
            </Link>
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <Link
                    href='/'
                    className='flex items-center gap-2 self-center font-medium'
                >
                    LMS Course Platform
                </Link>
                {children}
                <div className='text-muted-foreground text-center text-xs text-balance'>
                    By clicking continue, you agree to our{' '}
                    <span className='hover:text-primary hover:cursor-pointer hover:underline'>Terms of Service</span>{' '}
                    and <span className='hover:text-primary hover:cursor-pointer hover:underline'>Privacy Policy</span>
                </div>
            </div>
        </div>
    )
}
