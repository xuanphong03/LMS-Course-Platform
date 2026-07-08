'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { Loader, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function SignInByEmail() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [emailPending, startEmailTransition] = useTransition()

    const signInWithEmail = async () => {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                type: 'sign-in',
                email: email,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Verification email sent successfully! Please check your inbox.')
                        router.push(`/verify-request?email=${email}`)
                    },
                    onError: () => {
                        toast.error('Internal server error! Please try again later.')
                    },
                },
            })
        })
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card relative z-10 px-4'>Or continue with email</span>
            </div>

            <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        type='email'
                        name='email'
                        placeholder='example@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button
                    onClick={signInWithEmail}
                    disabled={emailPending || !email}
                >
                    {emailPending ? (
                        <>
                            <Loader className='size-4 animate-spin' /> <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <Send />
                            Continue with Email
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
