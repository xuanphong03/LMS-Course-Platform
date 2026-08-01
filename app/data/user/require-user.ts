import 'server-only'
import { ROUTES } from '@/consts/routes'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const requireUser = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        return redirect(ROUTES.LOGIN)
    }
    return session
})
