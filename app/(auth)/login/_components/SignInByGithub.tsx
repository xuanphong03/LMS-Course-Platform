'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Loader } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function SignInByGithub() {
    const [githubPending, startGithubTransition] = useTransition()

    const signInWithGithub = async () => {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: '/',
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Signed with Github successfully! You will be redirected to the home page.')
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
            <div className='text-center'>Login with your Github or Email Account</div>

            <Button
                disabled={githubPending}
                className='w-full'
                variant='outline'
                onClick={signInWithGithub}
            >
                {githubPending ? (
                    <>
                        <Loader className='size-4 animate-spin' /> <span>Loading...</span>
                    </>
                ) : (
                    'Continue with Github'
                )}
            </Button>
        </div>
    )
}
