import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import { ArrowLeftIcon, XIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Payment Failed | LMS Platform',
    description: 'Your payment could not be completed. Please try again or contact support if you need assistance.',
}

export default function PaymentCancelPage() {
    return (
        <div className='flex min-h-screen w-full items-center justify-center'>
            <Card className='w-100'>
                <CardContent>
                    <div className='flex w-full justify-center'>
                        <XIcon className='size-12 rounded-full bg-red-500/20 p-2 text-red-500' />
                    </div>
                    <div className='mt-3 w-full text-center sm:mt-5'>
                        <h1 className='text-xl font-semibold'>Payment Canceled</h1>
                        <p className='text-muted-foreground mt-2 text-sm tracking-tight text-balance'>
                            No worries, you wont be charged. Please try again!
                        </p>
                        <Link
                            href={ROUTES.HOME}
                            className={buttonVariants({ className: 'mt-2 w-full' })}
                        >
                            <ArrowLeftIcon className='size-4' />
                            Go back to Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
