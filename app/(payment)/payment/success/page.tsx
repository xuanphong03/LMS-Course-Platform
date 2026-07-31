import TriggerConfetti from '@/app/(payment)/payment/success/_components/TriggerConfetti'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/consts/routes'
import { ArrowLeftIcon, CheckIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Payment Successful',
    description: 'Your payment has been completed successfully. You can now access your enrolled course.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function PaymentSuccessPage() {
    return (
        <main className='relative'>
            <TriggerConfetti />
            <div className='flex min-h-screen w-full items-center justify-center'>
                <Card className='w-100'>
                    <CardContent>
                        <div className='flex w-full justify-center'>
                            <CheckIcon className='size-12 rounded-full bg-green-500/20 p-2 text-green-500' />
                        </div>
                        <div className='mt-3 w-full text-center sm:mt-5'>
                            <h1 className='text-xl font-semibold'>Payment Successfully</h1>
                            <p className='text-muted-foreground mt-2 text-sm tracking-tight text-balance'>
                                Congrats your payment was successfully. You should now have access to the course
                            </p>
                            <Link
                                href={ROUTES.ADMIN}
                                className={buttonVariants({ className: 'mt-2 w-full' })}
                            >
                                <ArrowLeftIcon className='size-4' />
                                Go back to Dashboard
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
