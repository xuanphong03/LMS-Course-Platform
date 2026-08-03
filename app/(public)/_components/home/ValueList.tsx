'use client'

import BorderGlow from '@/components/react-bits/BorderGlow'
import { BookOpenCheck, Layers3, Sparkles, Target } from 'lucide-react'

const valueProps = [
    {
        icon: Target,
        title: 'Focused learning',
        description: 'Clear lessons and structured chapters keep every study session moving forward.',
    },
    {
        icon: BookOpenCheck,
        title: 'Practical content',
        description: 'Build useful skills through courses designed around real-world outcomes.',
    },
    {
        icon: Layers3,
        title: 'Learn at your pace',
        description: 'Return to your lessons whenever it suits your schedule and goals.',
    },
    {
        icon: Sparkles,
        title: 'Progress that feels good',
        description: 'Track your journey and turn small wins into lasting momentum.',
    },
] as const

export default function ValueList() {
    return (
        <div className='relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {valueProps.map(({ icon: Icon, title, description }, index) => (
                <BorderGlow
                    key={index}
                    edgeSensitivity={30}
                    glowColor='40 80 80'
                    borderRadius={28}
                    glowRadius={40}
                    glowIntensity={1}
                    coneSpread={25}
                    animated={true}
                    backgroundColor='var(--card)'
                    colors={['#c084fc', '#f472b6', '#38bdf8']}
                >
                    <article className='relative h-full w-full p-6'>
                        <span className='text-muted-foreground/60 absolute top-5 right-5 text-xs font-semibold'>
                            0{index + 1}
                        </span>
                        <div className='bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 items-center justify-center rounded-2xl transition-colors'>
                            <Icon className='size-5' />
                        </div>
                        <h3 className='mt-5 text-lg font-semibold'>{title}</h3>
                        <p className='text-muted-foreground mt-2 text-sm leading-6'>{description}</p>
                    </article>
                </BorderGlow>
            ))}
        </div>
    )
}
