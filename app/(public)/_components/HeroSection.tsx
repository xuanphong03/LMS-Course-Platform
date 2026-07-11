import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { ROUTES } from '@/consts/routes'
import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className='relative py-4'>
            <div className='flex flex-col items-center space-y-4'>
                <Badge
                    variant='outline'
                    className='inline-flex h-auto px-4'
                >
                    The Future of Online Education
                </Badge>
                <h1 className='text-4xl font-bold'>Elevate your Learning Experience</h1>
                <p className='text-muted-foreground max-w-2xl text-center'>
                    Discovery a new wy to learn with our modern, interactive learning management system. Access
                    high-quality courses anytime, anywhere
                </p>
                <div className='flex flex-col gap-4 sm:flex-row'>
                    <Link
                        href={ROUTES.COURSES}
                        className={buttonVariants({ size: 'lg', className: 'min-w-40' })}
                    >
                        Explore courses
                    </Link>
                    <Link
                        href={ROUTES.LOGIN}
                        className={buttonVariants({ size: 'lg', variant: 'secondary', className: 'min-w-40' })}
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </section>
    )
}
