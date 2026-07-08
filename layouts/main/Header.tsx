'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function Header() {
    const { data: session } = authClient.useSession()
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

    return (
        <header className='fixed top-0 right-0 left-0 z-50'>
            <div className='flex items-center justify-between'>
                <Link href='/'>Logo</Link>
                <nav>Navigation</nav>
                <div>
                    {session ? (
                        <div>
                            <span>Welcome, {session.user.name}</span>
                            <Button
                                onClick={handleSignOut}
                                disabled={signOutPending}
                            >
                                {signOutPending ? (
                                    <>
                                        <Loader className='size-4 animate-spin' /> <span>Loading...</span>
                                    </>
                                ) : (
                                    'Logout'
                                )}
                            </Button>
                        </div>
                    ) : (
                        <Link
                            href='/login'
                            className={buttonVariants()}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
