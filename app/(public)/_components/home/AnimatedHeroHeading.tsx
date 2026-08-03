'use client'

import { useEffect, useState } from 'react'

const TYPING_MESSAGES = [
    { prefix: 'Build skills that\nmove your', accent: 'career forward.' },
    { prefix: 'Learn with\npurpose,\n', accent: 'grow daily.' },
    { prefix: 'Turn curiosity\ninto', accent: 'real-world skills.' },
] as const

const FIRST_MESSAGE = `${TYPING_MESSAGES[0].prefix} ${TYPING_MESSAGES[0].accent}`

/**
 * Typing dùng chung cho mọi kích thước màn hình; desktop chỉ thêm delay để
 * đồng bộ với animation zoom-in của hero, còn mobile bắt đầu sớm hơn.
 */
export function AnimatedHeroHeading() {
    const [hasStarted, setHasStarted] = useState(false)
    const [messageIndex, setMessageIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [visibleText, setVisibleText] = useState(FIRST_MESSAGE)

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

        const currentMessage = TYPING_MESSAGES[messageIndex]
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
                setMessageIndex((currentIndex) => (currentIndex + 1) % TYPING_MESSAGES.length)
                return
            }

            const nextLength = visibleText.length + (isDeleting ? -1 : 1)
            setVisibleText(targetText.slice(0, nextLength))
        }, visibleText === targetText && !isDeleting ? pauseAfterTyping : isDeleting && !visibleText ? pauseAfterDeleting : typingSpeed)

        return () => window.clearTimeout(timer)
    }, [hasStarted, isDeleting, messageIndex, visibleText])

    const currentMessage = TYPING_MESSAGES[messageIndex]
    const prefixLength = currentMessage.prefix.length
    const visiblePrefix = visibleText.slice(0, prefixLength)
    const visibleAccent = visibleText.slice(prefixLength)

    return (
        <h1 className='min-h-[3.25em] text-4xl leading-[1.06] font-bold tracking-[-0.05em] sm:whitespace-pre-line sm:text-6xl lg:text-7xl'>
            {visiblePrefix}
            <span className='text-primary'>{visibleAccent}</span>
            {hasStarted && (
                <span className='bg-primary ml-1 inline-block h-[0.85em] w-0.5 animate-pulse align-[-0.08em]' />
            )}
        </h1>
    )
}
