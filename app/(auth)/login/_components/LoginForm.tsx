import SignInByGithub from '@/app/(auth)/login/_components/SignInByGithub'
import SignInByEmail from '@/app/(auth)/login/_components/SignInByEmail'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/consts/routes'

export default function LoginForm() {
    return (
        <Card className='border-border/70 bg-card/90 gap-0 rounded-3xl shadow-xl shadow-primary/5 backdrop-blur-sm'>
            <CardHeader className='gap-3 p-7 pb-5 sm:p-8 sm:pb-6'>
                <div className='bg-primary/10 text-primary mb-1 w-fit rounded-full px-3 py-1 text-xs font-semibold'>
                    Welcome back
                </div>
                <CardTitle className='text-3xl font-bold tracking-tight'>Sign in to keep learning.</CardTitle>
                <p className='text-muted-foreground text-sm leading-6'>Continue your courses and pick up where you left off.</p>
            </CardHeader>
            <CardContent className='flex flex-col gap-5 p-7 pt-2 sm:p-8 sm:pt-3'>
                <SignInByGithub />
                <SignInByEmail />
                <Link
                    href={ROUTES.PUBLIC_COURSES}
                    className='text-muted-foreground hover:text-primary mt-1 inline-flex items-center justify-center gap-1 text-xs transition-colors'
                >
                    Browse courses first
                    <ArrowRight className='size-3.5' />
                </Link>
            </CardContent>
        </Card>
    )
}
