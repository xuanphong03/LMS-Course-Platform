import 'server-only'

import { prisma } from '@/lib/db'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { env } from '@/lib/env'
import { emailOTP } from 'better-auth/plugins'
import { resend } from '@/lib/resend'
import EmailTemplate from '@/components/ui/email-template'

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                const { error } = await resend.emails.send({
                    from: 'LMS Course Platform <onboarding@resend.dev>',
                    to: [email],
                    subject: 'LMS Course Platform - Verify your email',
                    react: EmailTemplate({ otp }),
                })

                if (error) {
                    throw new Error(error.message)
                }
            },
        }),
    ],
})
