'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type AnimatedHeroMessage = {
    prefix: string
    accent: string
}

const DEFAULT_MESSAGES = [
    { prefix: 'Build skills that\nmove your', accent: 'career forward.' },
    { prefix: 'Learn with\npurpose,\n', accent: 'grow daily.' },
    { prefix: 'Turn curiosity\ninto', accent: 'real-world skills.' },
] as const

interface AnimatedHeroHeadingProps {
    messages?: readonly AnimatedHeroMessage[]
    className?: string
    minHeightClass?: string
}

/**
 * Typing dùng chung cho mọi kích thước màn hình; desktop chỉ thêm delay để
 * đồng bộ với animation zoom-in của hero, còn mobile bắt đầu sớm hơn.
 */
export function AnimatedHeroHeading({
    messages = DEFAULT_MESSAGES,
    className,
    minHeightClass = 'min-h-[3.25em]',
}: AnimatedHeroHeadingProps) {
    const typingMessages = messages.length > 0 ? messages : DEFAULT_MESSAGES
    const [hasStarted, setHasStarted] = useState(false)
    const [messageIndex, setMessageIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [visibleText, setVisibleText] = useState(
        `${typingMessages[0].prefix} ${typingMessages[0].accent}`,
    )

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 640px)')
        const startDelay = mediaQuery.matches ? 1050 : 300
        const startTyping = window.setTimeout(() => {
            setHasStarted(true)
        }, startDelay)

        return () => window.clearTimeout(startTyping)
    }, [])

    useEffect(() => {
        if (!hasStarted) return

        const currentMessage = typingMessages[messageIndex]
        const targetText = `${currentMessage.prefix} ${currentMessage.accent}`
        const typingSpeed = isDeleting ? 24 : 42
        const pauseAfterTyping = 1800
        const pauseAfterDeleting = 280

        const timer = window.setTimeout(() => {
            if (!isDeleting && visibleText === targetText) {
                setIsDeleting(true)
                return
            }

            if (isDeleting && visibleText.length === 0) {
                setIsDeleting(false)
                setMessageIndex((currentIndex) => (currentIndex + 1) % typingMessages.length)
                return
            }

            const nextLength = visibleText.length + (isDeleting ? -1 : 1)
            setVisibleText(targetText.slice(0, nextLength))
        }, visibleText === targetText && !isDeleting ? pauseAfterTyping : isDeleting && !visibleText ? pauseAfterDeleting : typingSpeed)

        return () => window.clearTimeout(timer)
    }, [hasStarted, isDeleting, messageIndex, typingMessages, visibleText])

    const currentMessage = typingMessages[messageIndex]
    const prefixLength = currentMessage.prefix.length
    const visiblePrefix = visibleText.slice(0, prefixLength)
    const visibleAccent = visibleText.slice(prefixLength)

    return (
        <h1
            className={cn(
                minHeightClass,
                'whitespace-pre-line text-4xl leading-[1.06] font-bold tracking-[-0.05em] sm:text-6xl lg:text-7xl',
                className,
            )}
        >
            {visiblePrefix}
            <span className='text-primary'>{visibleAccent}</span>
            {hasStarted && (
                <span className='bg-primary ml-1 inline-block h-[0.85em] w-0.5 animate-pulse align-[-0.08em]' />
            )}
        </h1>
    )
}
