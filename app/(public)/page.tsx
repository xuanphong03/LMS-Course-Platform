import HeroSection from '@/app/(public)/_components/HeroSection'
import FeaturesSection from '@/app/(public)/_components/FeaturesSection'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Homepage',
    description: 'Discover online courses and start your learning journey.',
    alternates: {
        canonical: '/',
    },
}

export default function Home() {
    return (
        <main className='relative min-h-screen space-y-20 pt-20'>
            <HeroSection />
            <FeaturesSection />
        </main>
    )
}
