// import { env } from '@/lib/env'
// import arcjet, { createMiddleware } from '@arcjet/next'
// import { getSessionCookie } from 'better-auth/cookies'
// import { NextRequest, NextResponse } from 'next/server'

// const aj = arcjet({
//     key: env.ARCJET_KEY,
//     rules: [
//         detectBot({
//             mode: 'LIVE',
//             allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:MONITOR', 'CATEGORY:PREVIEW', 'STRIPE_WEBHOOK'],
//         }),
//     ],
// })

// async function authProxy(request: NextRequest) {
//     const sessionCookie = getSessionCookie(request)

//     // Đây chỉ là redirect tối ưu trải nghiệm; quyền truy cập thật vẫn phải được kiểm tra ở Server Component/Action.
//     if (!sessionCookie) {
//         return NextResponse.redirect(new URL('/', request.url))
//     }

//     return NextResponse.next()
// }

// export const config = {
//     matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
// }

// export default createMiddleware(aj, async (request: NextRequest) => {
//     if (request.nextUrl.pathname.startsWith('/admin')) {
//         return authProxy(request)
//     }

//     return NextResponse.next()
// })

import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*'], // Specify the routes the middleware applies to
}
