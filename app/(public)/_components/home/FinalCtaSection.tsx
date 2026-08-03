import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { ArrowRight, BookOpenCheck, Check, CircleCheck, Layers3, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

/**
 * CTA cuối trang chuyển đổi người dùng đã xem nội dung thành người bắt đầu học.
 */
export function FinalCtaSection() {
    return (
        <section className='px-4 pb-20 sm:animate-in sm:fade-in sm:slide-in-from-bottom-4 sm:px-6 sm:pb-24 sm:duration-1000'>
            <div className='from-primary/15 via-background to-accent/15 border-border/70 relative mx-auto max-w-340 overflow-hidden rounded-[2.5rem] border bg-linear-to-br px-6 py-12 shadow-[0_28px_90px_-42px_var(--primary)] sm:px-12 sm:py-16 lg:px-16 lg:py-20'>
                <div className='from-primary/25 pointer-events-none absolute -top-44 -right-32 size-[34rem] rounded-full bg-linear-to-br to-transparent blur-3xl dark:from-primary/35' />
                <div className='bg-accent/15 pointer-events-none absolute -bottom-48 -left-40 size-[30rem] rounded-full blur-3xl dark:bg-accent/20' />
                <div
                    className='pointer-events-none absolute inset-0 opacity-35 dark:opacity-20'
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                        maskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)',
                    }}
                />

                <div className='relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16'>
                    <div className='max-w-2xl'>
                        <div className='bg-background/70 text-primary border-border/70 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-[0.16em] uppercase shadow-sm backdrop-blur-md dark:bg-background/60'>
                            <Sparkles className='size-3.5' />
                            Your next chapter starts here
                        </div>
                        <h2 className='text-foreground mt-5 text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>
                            Turn a little progress into a{' '}
                            <span className='text-primary'>bigger future.</span>
                        </h2>
                        <p className='text-muted-foreground mt-5 max-w-xl text-base leading-7 sm:text-lg'>
                            Choose a course, learn with intention, and build momentum one lesson at a time. Your next
                            skill is closer than you think.
                        </p>
                        <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <Link
                                href={ROUTES.PUBLIC_COURSES}
                                className={buttonVariants({ size: 'lg', className: 'h-12 rounded-full px-6 shadow-lg shadow-primary/20' })}
                            >
                                Browse courses
                                <ArrowRight />
                            </Link>
                            <span className='text-muted-foreground inline-flex items-center gap-2 text-sm'>
                                <Check className='text-primary size-4' />
                                Start at your own pace
                            </span>
                        </div>
                        <div className='text-muted-foreground mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs'>
                            <span className='inline-flex items-center gap-2'><CircleCheck className='text-primary size-4' /> Expert-led lessons</span>
                            <span className='inline-flex items-center gap-2'><CircleCheck className='text-primary size-4' /> Learn on any device</span>
                        </div>
                    </div>

                    <div className='relative mx-auto min-h-72 w-full max-w-md'>
                        <div className='bg-primary/10 dark:bg-primary/20 absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl' />
                        <div className='bg-card/85 border-border/70 relative top-5 mx-auto w-[88%] rotate-3 rounded-3xl border p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-muted-foreground text-[10px] font-medium uppercase'>This week</p>
                                    <p className='text-foreground mt-1 text-2xl font-bold'>Keep your streak</p>
                                </div>
                                <div className='bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl'>
                                    <TrendingUp className='size-5' />
                                </div>
                            </div>
                            <div className='mt-6 flex items-end gap-2'>
                                {[38, 52, 44, 68, 58, 82, 94].map((height, index) => (
                                    <span
                                        key={index}
                                        className={`from-primary to-accent flex-1 rounded-t-md bg-linear-to-t ${index === 6 ? 'opacity-100' : 'opacity-35'}`}
                                        style={{ height: `${height}px` }}
                                    />
                                ))}
                            </div>
                            <div className='border-border/60 mt-5 flex items-center justify-between border-t pt-4'>
                                <span className='text-muted-foreground inline-flex items-center gap-2 text-xs'><BookOpenCheck className='text-primary size-4' /> 4 lessons completed</span>
                                <span className='text-primary text-xs font-bold'>+28%</span>
                            </div>
                        </div>
                        <div className='bg-card/95 border-border/70 absolute bottom-2 left-0 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-primary/10 backdrop-blur-xl'>
                            <div className='bg-emerald-500/15 text-emerald-500 flex size-9 items-center justify-center rounded-xl'>
                                <CircleCheck className='size-4' />
                            </div>
                            <div>
                                <p className='text-xs font-semibold'>Small wins count</p>
                                <p className='text-muted-foreground text-[10px]'>Progress saved</p>
                            </div>
                        </div>
                        <div className='bg-primary text-primary-foreground absolute top-0 right-0 flex size-12 rotate-12 items-center justify-center rounded-2xl shadow-lg shadow-primary/30'>
                            <Layers3 className='size-5' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
