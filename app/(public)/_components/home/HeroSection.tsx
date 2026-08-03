import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { ArrowRight, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { AnimatedHeroHeading } from './AnimatedHeroHeading'
import { HeroVisual } from './HeroVisual'

/**
 * Hero giới thiệu giá trị cốt lõi của nền tảng trước khi người dùng phải
 * quyết định xem danh sách khóa học.
 */
export function HeroSection() {
    return (
        <section className='bg-muted/20 relative isolate px-4 pt-4 sm:px-6 sm:pt-10'>
            <div className='sm:animate-in sm:fade-in sm:zoom-in-95 from-background via-primary/5 to-accent/10 border-border/60 dark:via-primary/10 dark:to-accent/5 relative mx-auto flex min-h-155 max-w-340 items-center overflow-hidden rounded-4xl border bg-linear-to-br shadow-[0_24px_80px_-32px_var(--primary)] sm:min-h-175 sm:duration-1000 lg:min-h-190'>
                <HeroVisual />
                {/* <div className='from-background/95 via-background/85 dark:from-background/95 dark:via-background/72 dark:to-background/10 pointer-events-none absolute inset-0 z-10 bg-linear-to-r to-transparent' /> */}
                <div className='bg-primary/15 dark:bg-primary/20 pointer-events-none absolute -top-40 -left-24 z-10 size-96 rounded-full blur-3xl' />
                <div className='from-primary/10 dark:from-primary/20 pointer-events-none absolute right-0 bottom-0 z-10 size-80 rounded-full bg-linear-to-t to-transparent blur-2xl' />
                <div className='relative z-20 max-w-2xl px-6 pt-8 pb-16 sm:px-12 sm:pt-28 sm:pb-20 lg:px-16'>
                    <div className='bg-background/70 text-primary border-primary/15 dark:bg-background/85 mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm backdrop-blur-sm'>
                        <span className='relative'>
                            <span className='bg-primary absolute-center z-1 block size-2.5 animate-ping rounded-full' />
                            <span className='bg-primary absolute-center z-2 block size-2 rounded-full' />
                        </span>
                        Learn with confidence
                    </div>
                    <AnimatedHeroHeading />
                    <p className='text-muted-foreground xsm:mt-2 mt-6 max-w-xl text-base leading-7 sm:text-lg'>
                        Practical courses, expert-led lessons, and a learning experience designed to help you make
                        meaningful progress every day.
                    </p>
                    <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                        <Link
                            href={ROUTES.PUBLIC_COURSES}
                            className={buttonVariants({
                                size: 'lg',
                                className: 'shadow-primary/20 h-12 rounded-full px-6 shadow-lg',
                            })}
                        >
                            Explore courses
                            <ArrowRight />
                        </Link>
                        <Link
                            href='#how-it-works'
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'lg',
                                className: 'bg-background/60 h-12 rounded-full px-6 backdrop-blur-sm',
                            })}
                        >
                            <PlayCircle />
                            How it works
                        </Link>
                    </div>
                    <div className='mt-12 flex flex-wrap gap-3'>
                        <div>
                            <p className='text-foreground/90 border-border/60 bg-background/55 dark:bg-background/80 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm'>
                                Learn anywhere
                            </p>
                        </div>
                        <div>
                            <p className='text-foreground/90 border-border/60 bg-background/55 dark:bg-background/80 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm'>
                                Expert-led
                            </p>
                        </div>
                        <div>
                            <p className='text-foreground/90 border-border/60 bg-background/55 dark:bg-background/80 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm'>
                                Certificate included
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
