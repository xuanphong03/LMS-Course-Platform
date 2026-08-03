import type { Metadata } from 'next'
import { FeaturedCoursesSection } from '@/app/(public)/_components/home/FeaturedCoursesSection'
import { FinalCtaSection } from '@/app/(public)/_components/home/FinalCtaSection'
import { HeroSection } from '@/app/(public)/_components/home/HeroSection'
import { ValuePropsSection } from '@/app/(public)/_components/home/ValuePropsSection'

export const metadata: Metadata = {
    title: 'Learn skills that move you forward',
    description: 'Discover practical online courses and build skills that move your career forward.',
    alternates: {
        canonical: '/',
    },
}

export default function Home() {
    return (
        <main className='relative overflow-hidden'>
            <HeroSection />
            <ValuePropsSection />
            <FeaturedCoursesSection />
            <FinalCtaSection />
        </main>
    )
}
