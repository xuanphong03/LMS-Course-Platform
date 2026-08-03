import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

/**
 * CTA cuối trang chuyển đổi người dùng đã xem nội dung thành người bắt đầu học.
 */
export function FinalCtaSection() {
    return (
        <section className='px-4 pb-20 sm:animate-in sm:fade-in sm:slide-in-from-bottom-4 sm:px-6 sm:pb-24 sm:duration-1000'>
            <div className='from-primary via-primary text-primary-foreground relative mx-auto max-w-340 overflow-hidden rounded-4xl bg-linear-to-br to-violet-500 px-6 py-14 shadow-[0_24px_80px_-32px_var(--primary)] dark:to-violet-600 sm:px-12 sm:py-16 lg:px-16'>
                <div className='bg-primary-foreground/15 absolute -top-24 -right-20 size-72 rounded-full blur-3xl' />
                <div className='border-primary-foreground/20 absolute right-16 bottom-8 hidden size-24 rounded-full border sm:block' />
                <div className='bg-primary-foreground/20 absolute right-24 bottom-16 hidden size-2 rounded-full sm:block' />
                <div className='relative max-w-2xl'>
                    <p className='text-primary-foreground/75 text-sm font-semibold tracking-[0.18em] uppercase'>
                        Your next chapter starts here
                    </p>
                    <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>
                        Make time for the skills you want next.
                    </h2>
                    <p className='text-primary-foreground/80 mt-4 max-w-xl leading-7'>
                        Choose a course, learn with intention, and build momentum one lesson at a time.
                    </p>
                    <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:items-center'>
                        <Link
                            href={ROUTES.PUBLIC_COURSES}
                            className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'h-12 px-6' })}
                        >
                            Browse courses
                            <ArrowRight />
                        </Link>
                        <span className='text-primary-foreground/75 inline-flex items-center gap-2 text-sm'>
                            <Check className='size-4' />
                            Start at your own pace
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
