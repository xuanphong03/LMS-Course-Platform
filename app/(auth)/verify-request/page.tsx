import FormVerifyRequest from '@/app/(auth)/verify-request/_components/FormVerifyRequest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default function VerifyRequestPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-center text-2xl font-bold'>Check your email</CardTitle>
                <CardDescription className='text-center text-sm'>
                    We have sent you a verification code. Please check your email and enter the code to verify your
                    account.
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                <Suspense fallback={null}>
                    <FormVerifyRequest />
                </Suspense>
            </CardContent>
        </Card>
    )
}
