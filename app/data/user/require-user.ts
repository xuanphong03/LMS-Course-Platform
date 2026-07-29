import { ROUTES } from '@/consts/routes'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return redirect(ROUTES.LOGIN)
    }

    return session
}
