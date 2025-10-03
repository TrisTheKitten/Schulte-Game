'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import gsap from 'gsap'
import { RANKS } from '@/lib/progression'

interface DifficultySelectorProps {
  onSelect: (size: number) => void
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const buttons = containerRef.current.querySelectorAll('button')
    
    gsap.fromTo(
      buttons,
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      }
    )
  }, [])

  return (
    <div className="text-center py-8">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
        Select Difficulty
      </h2>
      <div ref={containerRef} className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
        {RANKS.map(rank => (
          <Button
            key={rank.size}
            onClick={() => onSelect(rank.size)}
            size="lg"
            className="min-w-[160px]"
          >
            {rank.name} ({rank.size}×{rank.size})
          </Button>
        ))}
      </div>
    </div>
  )
}
