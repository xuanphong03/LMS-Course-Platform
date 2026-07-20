import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        formats: ['image/webp'],
        minimumCacheTTL: 2678400,
        remotePatterns: [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: '**' },
        ],
        deviceSizes: [430, 768, 1080, 1280, 1600, 1920],
        qualities: [75, 85, 95, 100], // Config quality values để tránh warning trong Next.js 16
    },
    reactStrictMode: false,
    output: 'standalone',
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

export default nextConfig
