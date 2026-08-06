import { buttonVariants } from '@/components/ui/button'
import { AnimatedHeroHeading, type AnimatedHeroMessage } from '@/app/(public)/_components/home/AnimatedHeroHeading'
import { ArrowDownRight, Compass, LibraryBig, Sparkles } from 'lucide-react'
import Link from 'next/link'

const COURSE_TYPING_MESSAGES: readonly AnimatedHeroMessage[] = [
    { prefix: 'Find a skill.\nStart', accent: 'today.' },
    { prefix: 'Learn with\nfocus.', accent: 'daily.' },
    { prefix: 'Practice\nand grow', accent: 'daily.' },
]

/**
 * Tạo điểm vào cho catalog trước khi người dùng gặp danh sách card, giúp trang
 * có nhịp điệu rõ ràng mà không thay đổi dữ liệu hoặc hành vi của course card.
 */
export default function CoursesHero() {
    return (
        <section className='from-primary/10 via-background to-accent/10 border-border/70 relative overflow-hidden rounded-[2rem] border bg-linear-to-br px-6 py-12 sm:animate-in sm:px-10 sm:py-16 sm:duration-1000 sm:fade-in sm:zoom-in-95 lg:px-14 lg:py-20'>
            <div className='bg-primary/15 pointer-events-none absolute -top-40 -right-32 size-96 rounded-full blur-3xl dark:bg-primary/20' />
            <div className='bg-accent/15 pointer-events-none absolute -bottom-48 -left-32 size-96 rounded-full blur-3xl' />
            <div className='relative grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16'>
                <div className='max-w-2xl'>
                    <div className='bg-primary/10 text-primary border-primary/15 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase'>
                        <Sparkles className='size-3.5' />
                        Course library
                    </div>
                    <AnimatedHeroHeading
                        messages={COURSE_TYPING_MESSAGES}
                        minHeightClass='min-h-[2.25em]'
                        className='mt-5 text-4xl sm:text-6xl lg:text-7xl'
                    />
                    <p className='text-muted-foreground mt-5 max-w-xl text-base leading-7 sm:text-lg'>
                        Browse practical courses built to help you learn with focus and make progress you can feel.
                    </p>
                    <Link
                        href='#course-grid'
                        className={buttonVariants({ className: 'mt-8 h-11 rounded-full px-5 shadow-lg shadow-primary/15' })}
                    >
                        Explore the library
                        <ArrowDownRight />
                    </Link>
                </div>

                <div className='relative min-h-48 lg:min-h-56'>
                    <div className='bg-card/80 border-border/70 absolute top-2 right-0 w-[82%] rotate-3 rounded-3xl border p-5 shadow-xl shadow-primary/10 backdrop-blur-xl'>
                        <div className='flex items-start justify-between gap-4'>
                            <div className='bg-primary/10 text-primary flex size-11 items-center justify-center rounded-2xl'>
                                <LibraryBig className='size-5' />
                            </div>
                            <span className='text-muted-foreground text-xs'>Learn at your pace</span>
                        </div>
                        <p className='mt-8 text-lg font-semibold'>Structured paths, practical outcomes.</p>
                        <div className='mt-4 flex items-center gap-2'>
                            <span className='bg-primary h-1.5 w-16 rounded-full' />
                            <span className='bg-primary/20 h-1.5 w-8 rounded-full' />
                            <span className='bg-primary/20 h-1.5 w-5 rounded-full' />
                        </div>
                    </div>
                    <div className='bg-background/80 border-border/70 absolute bottom-0 left-0 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl'>
                        <div className='bg-accent/20 text-accent-foreground flex size-9 items-center justify-center rounded-xl'>
                            <Compass className='size-4' />
                        </div>
                        <div>
                            <p className='text-xs font-semibold'>Choose your direction</p>
                            <p className='text-muted-foreground mt-0.5 text-[10px]'>One lesson at a time</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
