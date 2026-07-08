'use client'

import { useState, useTransition } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

export default function FormVerifyRequest() {
    const router = useRouter()
    const params = useSearchParams()
    const email = params.get('email') || ''
    const [optCode, setOptCode] = useState('')
    const [verifyRequestPending, startVerifyRequestTransition] = useTransition()

    const isDisabledButtonVerify = verifyRequestPending || optCode.length !== 6 || !email

    const handleVerifyRequest = async () => {
        startVerifyRequestTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: optCode,
                fetchOptions: {
                    onSuccess: () => {
                        // Handle success, e.g., redirect to a success page or show a success message
                        toast.success('Email verified successfully! You will be redirected to the home page.')
                        router.push('/')
                    },
                    onError: () => {
                        // Handle error, e.g., show an error message
                        toast.error('Invalid OTP code. Please try again.')
                    },
                    onFinally: () => {
                        // Reset the OTP code input field
                        setOptCode('')
                    },
                },
            })
        })
    }

    return (
        <div className='flex flex-col items-center space-y-4'>
            <InputOTP
                maxLength={6}
                value={optCode}
                onChange={setOptCode}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <p className='text-muted-foreground text-sm'>Enter the 6-digit code sent to your email.</p>
            <Button
                onClick={handleVerifyRequest}
                disabled={isDisabledButtonVerify}
                className='w-full'
            >
                {verifyRequestPending ? (
                    <>
                        <Loader className='size-4 animate-spin' /> Loading...
                    </>
                ) : (
                    'Verify code'
                )}
            </Button>
        </div>
    )
}
