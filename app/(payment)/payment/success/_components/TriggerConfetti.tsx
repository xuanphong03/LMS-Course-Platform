/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useConfetti } from '@/hooks/use-confetti'
import { useEffect } from 'react'

export default function TriggerConfetti() {
    const { triggerConfetti } = useConfetti()

    useEffect(() => {
        triggerConfetti()
    }, [])
    return null
}
