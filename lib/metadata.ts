import type { Metadata } from 'next'

export const siteConfig = {
    name: 'LMS Course Platform',
    description: 'Discover, purchase, and manage online courses in one learning platform.',
    url: process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000',
}

/**
 * Metadata nền được dùng ở root layout để mọi route có cùng nhận diện thương hiệu.
 * `title.template` cho phép từng trang chỉ cần cung cấp tiêu đề ngắn, tránh lặp tên app.
 */
export const baseMetadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    keywords: ['LMS', 'online courses', 'e-learning', 'course platform'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: siteConfig.name,
        title: siteConfig.name,
        description: siteConfig.description,
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
    },
}
