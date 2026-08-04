'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { IconBrandGithub } from '@tabler/icons-react'
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
        <Button
            disabled={githubPending}
            className='h-11 w-full rounded-xl'
            variant='outline'
            onClick={signInWithGithub}
        >
            {githubPending ? (
                <>
                    <Loader className='size-4 animate-spin' /> <span>Connecting...</span>
                </>
            ) : (
                <>
                    <IconBrandGithub className='size-4' />
                    Continue with GitHub
                </>
            )}
        </Button>
    )
}
