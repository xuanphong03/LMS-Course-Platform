import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft, ArrowUpRight, BookOpenCheck, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'
import { ROUTES } from '@/consts/routes'

export const metadata: Metadata = {
    title: 'Authentication',
    description: 'Sign in or verify your LMS Course Platform account.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-muted/20 relative min-h-svh overflow-hidden'>
            <div className='bg-primary/10 dark:bg-primary/15 pointer-events-none absolute -top-48 -left-48 size-128 rounded-full blur-3xl' />
            <div className='bg-accent/20 dark:bg-accent/10 pointer-events-none absolute -right-48 -bottom-48 size-128 rounded-full blur-3xl' />
            <Link
                href={ROUTES.HOME}
                className={buttonVariants({
                    variant: 'outline',
                    className: 'bg-background/70 absolute top-5 left-5 z-30 rounded-full backdrop-blur-sm',
                })}
            >
                <ArrowLeft />
                <span>Home</span>
            </Link>

            <main className='relative mx-auto grid min-h-svh w-full max-w-7xl lg:grid-cols-[1.05fr_0.95fr]'>
                <section className='hidden flex-col justify-between px-10 py-12 lg:flex lg:px-16'>
                    <Link
                        href={ROUTES.HOME}
                        className='flex w-fit items-center gap-3 font-semibold'
                    >
                        <Image
                            src='/images/phonghub-icon.svg'
                            alt='LMS Course Platform'
                            width={42}
                            height={42}
                        />
                        <span className='text-lg'>Ph.Hub</span>
                    </Link>

                    <div className='max-w-xl'>
                        <div className='bg-primary/10 text-primary border-primary/15 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-[0.14em] uppercase'>
                            <Sparkles className='size-3.5' />
                            Learn with intention
                        </div>
                        <h1 className='mt-6 text-5xl leading-[1.02] font-bold tracking-[-0.05em] lg:text-6xl'>
                            Pick up where your <span className='text-primary'>curiosity</span> left off.
                        </h1>
                        <p className='text-muted-foreground mt-6 max-w-md text-base leading-7'>
                            One focused space for practical courses, steady progress, and the next skill you want to
                            own.
                        </p>
                        <div className='mt-10 grid max-w-md grid-cols-2 gap-3'>
                            <div className='bg-background/70 border-border/70 rounded-2xl border p-4 shadow-sm backdrop-blur-sm'>
                                <BookOpenCheck className='text-primary size-5' />
                                <p className='mt-8 text-sm font-semibold'>Learn in chapters</p>
                                <p className='text-muted-foreground mt-1 text-xs'>Clear paths, useful outcomes.</p>
                            </div>
                            <div className='bg-primary text-primary-foreground shadow-primary/20 rounded-2xl p-4 shadow-lg'>
                                <ArrowUpRight className='size-5' />
                                <p className='mt-8 text-sm font-semibold'>Keep moving</p>
                                <p className='text-primary-foreground/75 mt-1 text-xs'>Small wins become momentum.</p>
                            </div>
                        </div>
                    </div>

                    <p className='text-muted-foreground text-xs'>Build your next chapter, one lesson at a time.</p>
                </section>

                <section className='lg:border-border/60 flex w-full items-center justify-center px-5 py-24 sm:px-8 lg:border-l lg:px-12'>
                    <div className='flex w-full max-w-md flex-col gap-6'>
                        <Link
                            href={ROUTES.HOME}
                            className='flex items-center gap-2 self-center font-medium lg:hidden'
                        >
                            <Image
                                src='/images/phonghub-icon.svg'
                                alt='LMS Course Platform'
                                width={38}
                                height={38}
                            />
                            Ph.Hub
                        </Link>
                        {children}
                        <div className='text-muted-foreground text-center text-xs leading-5 text-balance'>
                            By clicking continue, you agree to our{' '}
                            <span className='hover:text-primary cursor-pointer hover:underline'>Terms of Service</span>{' '}
                            and{' '}
                            <span className='hover:text-primary cursor-pointer hover:underline'>Privacy Policy</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
