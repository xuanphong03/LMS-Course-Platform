import {
    BadgeCheck,
    Bot,
    BookOpen,
    CheckCircle2,
    CirclePlay,
    Laptop,
    MessageCircle,
    Sparkles,
    Star,
    TrendingUp,
    Zap,
} from 'lucide-react'

/**
 * Tạo visual Hero bằng các token của theme thay vì bitmap cố định, nhờ đó
 * cùng một bố cục có thể chuyển sáng/tối mà không cần quản lý hai ảnh riêng.
 */
export function HeroVisual() {
    return (
        <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-y-5 right-0 z-0 hidden w-[56%] sm:block'
        >
            <div className='bg-primary/15 dark:bg-primary/20 absolute top-1/2 left-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl' />
            <div className='from-primary/10 via-background/20 to-accent/20 border-border/60 dark:from-primary/20 dark:via-background/40 dark:to-accent/10 absolute inset-10 rounded-[3rem] border bg-linear-to-br' />
            <div
                className='absolute inset-10 rounded-[3rem] opacity-40 dark:opacity-25'
                style={{
                    backgroundImage:
                        'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
                }}
            />
            <div className='border-primary/20 absolute top-1/2 left-1/2 size-[74%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full border border-dashed' />
            <div className='border-accent/20 absolute top-1/2 left-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full border' />

            <div className='bg-card/95 border-border/70 shadow-primary/10 absolute top-1/2 left-1/2 w-[68%] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] overflow-hidden rounded-[1.75rem] border shadow-2xl backdrop-blur-xl'>
                <div className='border-border/60 flex items-center gap-1.5 border-b px-5 py-4'>
                    <span className='size-2 rounded-full bg-rose-400/80' />
                    <span className='size-2 rounded-full bg-amber-400/80' />
                    <span className='size-2 rounded-full bg-emerald-400/80' />
                    <div className='bg-muted/70 text-muted-foreground ml-4 h-5 flex-1 rounded-full px-3 text-[9px] leading-5'>
                        learn.phhub.dev/dashboard
                    </div>
                </div>
                <div className='space-y-5 p-5 sm:p-7'>
                    <div className='flex items-start justify-between gap-4'>
                        <div>
                            <p className='text-muted-foreground text-[10px] font-medium uppercase'>
                                Your learning path
                            </p>
                            <p className='mt-1 text-lg font-bold tracking-tight sm:text-xl'>
                                Keep going, you&apos;re close.
                            </p>
                        </div>
                        <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl'>
                            <Laptop className='size-5' />
                        </div>
                    </div>
                    <div className='bg-muted/60 rounded-2xl p-4'>
                        <div className='mb-3 flex items-center justify-between text-xs'>
                            <span className='text-muted-foreground'>Frontend foundations</span>
                            <span className='text-primary font-semibold'>72%</span>
                        </div>
                        <div className='bg-background h-2 overflow-hidden rounded-full'>
                            <div className='from-primary to-accent h-full w-[72%] rounded-full bg-linear-to-r' />
                        </div>
                        <div className='text-muted-foreground mt-3 flex items-center gap-2 text-[10px]'>
                            <CheckCircle2 className='text-primary size-3.5' />
                            12 of 16 lessons completed
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                        <div className='bg-primary/10 text-primary rounded-xl p-3'>
                            <TrendingUp className='size-4' />
                            <p className='mt-3 text-lg font-bold'>+24%</p>
                            <p className='text-muted-foreground text-[9px]'>this week</p>
                        </div>
                        <div className='bg-accent/70 text-accent-foreground rounded-xl p-3'>
                            <BookOpen className='size-4' />
                            <p className='mt-3 text-lg font-bold'>08</p>
                            <p className='text-muted-foreground text-[9px]'>hours learned</p>
                        </div>
                        <div className='bg-muted rounded-xl p-3'>
                            <BadgeCheck className='text-primary size-4' />
                            <p className='mt-3 text-lg font-bold'>03</p>
                            <p className='text-muted-foreground text-[9px]'>skills gained</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-card/95 border-border/70 shadow-primary/10 absolute top-[5%] right-[9%] flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-xl'>
                <div className='bg-primary/15 text-primary flex size-6 items-center justify-center rounded-full'>
                    <Bot className='size-3.5' />
                </div>
                <span className='text-[9px] font-semibold'>AI-guided learning</span>
                <span className='size-1.5 rounded-full bg-emerald-500' />
            </div>

            <div className='bg-card/95 border-border/70 shadow-primary/10 absolute top-[18%] left-[2%] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl'>
                <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500'>
                    <Sparkles className='size-4' />
                </div>
                <div>
                    <p className='text-[10px] font-semibold'>Great momentum</p>
                    <p className='text-muted-foreground text-[9px]'>3 day streak</p>
                </div>
            </div>

            <div className='bg-card/95 border-border/70 shadow-primary/10 absolute right-[1%] bottom-[17%] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl'>
                <div className='bg-primary/15 text-primary flex size-9 items-center justify-center rounded-xl'>
                    <CirclePlay className='size-4' />
                </div>
                <div>
                    <p className='text-[10px] font-semibold'>Next lesson ready</p>
                    <p className='text-muted-foreground text-[9px]'>Continue learning</p>
                </div>
            </div>

            <div className='bg-card/95 border-border/70 shadow-primary/10 absolute top-[35%] right-[0%] flex size-11 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-xl'>
                <MessageCircle className='text-primary size-5' />
            </div>

            <div className='bg-card/95 border-border/70 shadow-primary/10 absolute bottom-[2.5%] left-[10%] flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl'>
                <div className='flex -space-x-1'>
                    <span className='bg-primary/20 text-primary border-card flex size-6 items-center justify-center rounded-full border-2 text-[8px] font-bold'>
                        L
                    </span>
                    <span className='bg-accent text-accent-foreground border-card flex size-6 items-center justify-center rounded-full border-2 text-[8px] font-bold'>
                        P
                    </span>
                    <span className='border-card flex size-6 items-center justify-center rounded-full border-2 bg-emerald-500/20 text-[8px] font-bold text-emerald-500'>
                        H
                    </span>
                </div>
                <div>
                    <p className='flex items-center gap-1 text-[9px] font-semibold'>
                        4.9 <Star className='size-2.5 fill-amber-400 text-amber-400' />
                    </p>
                    <p className='text-muted-foreground text-[8px]'>learner rating</p>
                </div>
            </div>

            <div className='bg-primary text-primary-foreground shadow-primary/30 absolute right-[13%] bottom-[5%] flex size-9 items-center justify-center rounded-xl shadow-lg'>
                <Zap className='size-4 fill-current' />
            </div>
        </div>
    )
}
