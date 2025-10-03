'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

interface GameCellProps {
  number: number
  onClick: (number: number) => boolean
  isCorrect: boolean
  isHidden: boolean
  delay: number
}

export function GameCell({ number, onClick, isCorrect, isHidden, delay }: GameCellProps) {
  const cellRef = useRef<HTMLDivElement>(null)
  const [isWrong, setIsWrong] = useState(false)

  useEffect(() => {
    if (!cellRef.current) return

    gsap.fromTo(
      cellRef.current,
      {
        opacity: 0,
        y: 20,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        delay: delay * 0.05,
        ease: 'back.out(1.7)',
      }
    )
  }, [delay])

  useEffect(() => {
    if (!cellRef.current || !isCorrect) return

    gsap.to(cellRef.current, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })
  }, [isCorrect])

  const handleClick = () => {
    if (isCorrect || isHidden) return

    const isClickCorrect = onClick(number)

    if (!isClickCorrect && cellRef.current) {
      setIsWrong(true)
      gsap.to(cellRef.current, {
        duration: 0.4,
        ease: 'power2.inOut',
        keyframes: [
          { x: -5 },
          { x: 5 },
          { x: -5 },
          { x: 5 },
          { x: 0 },
        ],
        onComplete: () => setIsWrong(false),
      })
    }
  }

  return (
    <div
      ref={cellRef}
      onClick={handleClick}
      className={cn(
        "aspect-square flex items-center justify-center rounded-lg text-2xl font-semibold cursor-pointer transition-all select-none",
        "bg-accent hover:bg-accent/80 hover:-translate-y-1 hover:shadow-lg",
        isCorrect && "pointer-events-none",
        isWrong && "bg-destructive text-white",
        isHidden && "bg-transparent text-transparent pointer-events-none shadow-none"
      )}
    >
      {!isHidden && number}
    </div>
  )
}
