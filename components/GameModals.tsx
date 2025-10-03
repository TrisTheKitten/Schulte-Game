'use client'

import { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatTime, timeToSeconds } from '@/lib/utils'
import gsap from 'gsap'

interface LevelUpModalProps {
  open: boolean
  currentRankName: string
  currentGridSize: number
  nextRankName: string
  nextGridSize: number
  isMaxRank: boolean
  onNext: () => void
}

export function LevelUpModal({
  open,
  currentRankName,
  currentGridSize,
  nextRankName,
  nextGridSize,
  isMaxRank,
  onNext,
}: LevelUpModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const hasAdvancedRef = useRef(false)
  const rankBadgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    hasAdvancedRef.current = false

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }
      )
    }

    if (rankBadgeRef.current) {
      gsap.fromTo(
        rankBadgeRef.current,
        { scale: 0.6, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }
      )
    }

    const timer = setTimeout(() => {
      if (!hasAdvancedRef.current) {
        hasAdvancedRef.current = true
        onNext()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [open, onNext])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !hasAdvancedRef.current) {
      hasAdvancedRef.current = true
      onNext()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" ref={contentRef}>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-primary">
            {isMaxRank ? 'Rank Mastered!' : 'Rank Up!'}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {isMaxRank ? 'You have conquered the ultimate challenge.' : 'Your training is paying off!'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-center" ref={rankBadgeRef}>
            <div className="px-4 py-3 rounded-xl bg-muted shadow-inner">
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Current Rank</div>
              <div className="text-2xl font-bold text-primary">{currentRankName}</div>
              <div className="text-xs text-muted-foreground">{currentGridSize}×{currentGridSize}</div>
            </div>
            {!isMaxRank && (
              <>
                <div className="text-3xl text-primary font-bold">→</div>
                <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 shadow-lg">
                  <div className="text-sm text-primary uppercase tracking-wide">Next Rank</div>
                  <div className="text-2xl font-bold text-primary">{nextRankName}</div>
                  <div className="text-xs text-primary/80">{nextGridSize}×{nextGridSize}</div>
                </div>
              </>
            )}
          </div>
          <div className="text-center text-muted-foreground">
            {isMaxRank
              ? 'Legendary performance! Replay to hone your skills or chase faster times.'
              : 'Get ready, the next challenge awaits. Numbers have been reshuffled.'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface GameOverModalProps {
  open: boolean
  score: number
  time: number
  size: number
  bestTimes: Record<number, string>
  onPlayAgain: () => void
  onSaveBestTime: (size: number, time: string) => void
}

export function GameOverModal({
  open,
  score,
  time,
  size,
  bestTimes,
  onPlayAgain,
  onSaveBestTime,
}: GameOverModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const isNewRecord = useRef(false)

  useEffect(() => {
    if (open && contentRef.current) {
      const currentTime = formatTime(time)
      const bestTime = bestTimes[size] || '--:--'

      if (bestTime === '--:--' || time < timeToSeconds(bestTime)) {
        onSaveBestTime(size, currentTime)
        isNewRecord.current = true
      } else {
        isNewRecord.current = false
      }

      gsap.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      )
    }
  }, [open, time, size, bestTimes, onSaveBestTime])

  const currentTime = formatTime(time)
  const bestTime = bestTimes[size] || '--:--'

  return (
    <Dialog open={open} onOpenChange={onPlayAgain}>
      <DialogContent className="sm:max-w-md" ref={contentRef}>
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-primary">Game Over!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-lg mb-2">
              Your final score: <span className="font-bold text-2xl text-primary">{score}</span>
            </p>
            <p className="text-lg">
              Best time:{' '}
              <span className="font-bold text-xl">
                {isNewRecord.current ? (
                  <>
                    {currentTime} <span className="text-green-500">🏆 New Record!</span>
                  </>
                ) : (
                  bestTime
                )}
              </span>
            </p>
          </div>
          <Button onClick={onPlayAgain} className="w-full" size="lg">
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
