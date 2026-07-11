import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function useSignout() {
    const router = useRouter()
    const [signOutPending, startSignOutTransition] = useTransition()

    const handleSignOut = async () => {
        startSignOutTransition(async () => {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/')
                        toast.success('Signed out successfully')
                    },
                    onError: () => {
                        toast.error('Failed to sign out')
                    },
                },
            })
        })
    }

    return { handleSignOut, signOutPending }
}
