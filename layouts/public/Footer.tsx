import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import { IconBrandGithub } from '@tabler/icons-react'
import { ArrowUpRight, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Footer dùng chung cho public routes để người dùng luôn có điểm điều hướng
 * rõ ràng sau khi hoàn tất nội dung trang.
 */
export default function Footer() {
    return (
        <footer className='border-border/60 bg-muted/20 border-t'>
            <div className='mx-auto max-w-340 px-5 py-14 sm:px-8 sm:py-16'>
                <div className='flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between'>
                    <div className='max-w-sm'>
                        <Link
                            href={ROUTES.HOME}
                            className='inline-flex items-center gap-2'
                        >
                            <Image
                                src='/images/phonghub-icon.svg'
                                alt='LMS Course Platform'
                                width={38}
                                height={38}
                            />
                            <span className='text-lg font-bold'>Ph.Hub</span>
                        </Link>
                        <p className='text-muted-foreground mt-4 text-sm leading-6'>
                            A calm, practical space to learn new skills and turn consistent effort into meaningful
                            progress.
                        </p>
                    </div>
                    <div className='grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3'>
                        <div className='space-y-3'>
                            <p className='text-sm font-semibold'>Explore</p>
                            <Link
                                href={ROUTES.PUBLIC_COURSES}
                                className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                            >
                                Courses
                            </Link>
                            <Link
                                href={ROUTES.LOGIN}
                                className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                            >
                                Get started
                            </Link>
                        </div>
                        <div className='space-y-3'>
                            <p className='text-sm font-semibold'>Learning</p>
                            <Link
                                href={ROUTES.USER_DASHBOARD}
                                className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                            >
                                Dashboard
                            </Link>
                            <Link
                                href='#how-it-works'
                                className='text-muted-foreground hover:text-foreground block text-sm transition-colors'
                            >
                                How it works
                            </Link>
                        </div>
                        <div className='space-y-3'>
                            <p className='text-sm font-semibold'>Connect</p>
                            <a
                                href='https://github.com'
                                target='_blank'
                                rel='noreferrer'
                                className={buttonVariants({
                                    variant: 'outline',
                                    size: 'icon-sm',
                                    className: 'rounded-full',
                                })}
                                aria-label='Open GitHub'
                            >
                                <IconBrandGithub />
                            </a>
                        </div>
                    </div>
                </div>
                <div className='border-border/60 text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between'>
                    <p>© {new Date().getFullYear()} LMS Course Platform. All rights reserved.</p>
                    <p className='inline-flex items-center gap-1'>
                        Made for curious learners
                        <Heart className='text-primary size-3.5 fill-current' />
                        <ArrowUpRight className='size-3.5' />
                    </p>
                </div>
            </div>
        </footer>
    )
}
