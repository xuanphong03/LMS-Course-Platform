import 'server-only'

import { env } from '@/lib/env'
import arcjet, { detectBot, detectPromptInjection, sensitiveInfo, shield, tokenBucket } from '@arcjet/next'

export { detectBot, detectPromptInjection, sensitiveInfo, shield, tokenBucket }

export default arcjet({
    key: env.ARCJET_KEY,
    characteristics: ['fingerprint'],
    // define base rules here, can also be empty if you don't want to have any base rules
    rules: [shield({ mode: 'LIVE' })],
})
