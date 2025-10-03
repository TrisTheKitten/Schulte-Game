'use client'

import { useRef, useEffect, forwardRef } from 'react'
import { formatTime } from '@/lib/utils'
import gsap from 'gsap'

interface GameStatsProps {
  time: number
  score: number
  rankName: string
  gridSize: number
  nextNumber: number
}

export function GameStats({ time, score, rankName, gridSize, nextNumber }: GameStatsProps) {
  const scoreRef = useRef<HTMLSpanElement>(null)
  const prevScore = useRef(score)

  useEffect(() => {
    if (!scoreRef.current || prevScore.current === score) return

    gsap.fromTo(
      scoreRef.current,
      { scale: 1.2, color: '#4ade80' },
      { scale: 1, color: 'inherit', duration: 0.3, ease: 'power2.out' }
    )

    prevScore.current = score
  }, [score])

  return (
    <div className="flex justify-center gap-8 mb-8 flex-wrap">
      <StatCard label="Time" value={formatTime(time)} />
      <StatCard label="Score" value={score.toString()} ref={scoreRef} />
      <StatCard label="Rank" value={rankName} />
      <StatCard label="Grid" value={`${gridSize}×${gridSize}`} />
      <StatCard label="Next Number" value={nextNumber.toString()} />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

const StatCard = forwardRef<HTMLSpanElement, StatCardProps>(
  ({ label, value }, ref) => {
    return (
      <div className="bg-card/20 backdrop-blur-md border border-border/20 rounded-lg px-6 py-4 min-w-[120px] text-center shadow-lg">
        <div className="text-sm text-primary font-medium mb-1">{label}</div>
        <span ref={ref} className="text-2xl font-bold inline-block">
          {value}
        </span>
      </div>
    )
  }
)
StatCard.displayName = 'StatCard'
