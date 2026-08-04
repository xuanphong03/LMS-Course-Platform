import LoginForm from '@/app/(auth)/login/_components/LoginForm'
import { auth } from '@/lib/auth'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to LMS Course Platform to continue learning.',
}

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (session) {
        return redirect('/')
    }
    return <LoginForm />
}
