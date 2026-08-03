import ValueList from '@/app/(public)/_components/home/ValueList'

/**
 * Tóm tắt các lợi ích giúp người dùng hiểu cách nền tảng hỗ trợ họ học hiệu quả.
 */
export function ValuePropsSection() {
    return (
        <section
            id='how-it-works'
            className='relative py-24 sm:py-28'
        >
            <div className='bg-primary/5 dark:bg-primary/10 pointer-events-none absolute top-20 left-1/2 size-96 -translate-x-1/2 rounded-full blur-3xl' />
            <div className='mx-auto max-w-340 px-5 sm:px-8'>
                <div className='relative mx-auto max-w-2xl text-center'>
                    <p className='bg-primary/10 text-primary sm:animate-in sm:fade-in inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase sm:duration-700'>
                        Why learn with us
                    </p>
                    <h2 className='sm:animate-in sm:fade-in sm:slide-in-from-bottom-3 mt-4 text-3xl font-bold tracking-tight sm:text-4xl sm:delay-100 sm:duration-700'>
                        Everything you need to keep growing
                    </h2>
                    <p className='text-muted-foreground sm:animate-in sm:fade-in sm:slide-in-from-bottom-3 mt-4 text-base leading-7 sm:delay-200 sm:duration-700'>
                        A simple learning environment that puts useful knowledge, clear progress, and your goals first.
                    </p>
                </div>
                <ValueList />
            </div>
        </section>
    )
}
