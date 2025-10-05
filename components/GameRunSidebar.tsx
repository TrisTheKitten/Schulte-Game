import { forwardRef, useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { X } from 'lucide-react'
import type { GameRun } from '@/hooks/useGameState'

interface GameRunSidebarProps {
  open: boolean
  runs: GameRun[]
  currentStreak: number
  maxStreak: number
  onClose: () => void
}

export const GameRunSidebar = forwardRef<HTMLElement, GameRunSidebarProps>(
  ({ open, runs, currentStreak, maxStreak, onClose }, forwardedRef) => {
    const wrapperRef = useRef<HTMLElement | null>(null)
    const streakRef = useRef<HTMLDivElement | null>(null)
    const [playedToday, setPlayedToday] = useState(0)

    useEffect(() => {
      if (!open || !wrapperRef.current) return

      const ctx = gsap.context(() => {
        gsap.fromTo(
          wrapperRef.current,
          { xPercent: 100, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 0.45, ease: 'power4.out' }
        )

        gsap.fromTo(
          '.run-card',
          { x: 64, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.1,
          }
        )
      }, wrapperRef)

      return () => ctx.revert()
    }, [open])

    useEffect(() => {
      if (!open || !streakRef.current) return
      const badge = streakRef.current
      gsap.fromTo(
        badge,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )

      if (currentStreak === maxStreak && currentStreak > 0) {
        gsap.to(badge, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
      }
    }, [open, currentStreak, maxStreak])

    useEffect(() => {
      if (!runs.length) {
        setPlayedToday(0)
        return
      }
      const today = new Date().toDateString()
      const todayRuns = runs.filter(run => new Date(run.playedAt).toDateString() === today)
      setPlayedToday(todayRuns.length)
    }, [runs])

    if (!open) return null

    return (
      <aside
        ref={node => {
          wrapperRef.current = node
          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            forwardedRef.current = node
          }
        }}
        className={cn(
          'fixed right-0 top-0 h-screen w-full max-w-md bg-background/98 backdrop-blur-lg border-l border-border/50 shadow-2xl z-50 overflow-hidden'
        )}
      >
        <div className="px-6 py-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">History</h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground hover:bg-accent/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-card border border-border/40 p-4 text-center">
              <div className="text-2xl font-bold mb-1">{runs.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            
            <div ref={streakRef} className="rounded-xl bg-card border border-border/40 p-4 text-center">
              <div className="text-2xl font-bold mb-1">{maxStreak}</div>
              <div className="text-xs text-muted-foreground">Best</div>
            </div>
            
            <div className="rounded-xl bg-card border border-border/40 p-4 text-center">
              <div className="text-2xl font-bold mb-1">{playedToday}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>
          
          {currentStreak > 0 && (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-sm font-medium">Current Streak</span>
              <span className="text-xl font-bold text-primary">{currentStreak}</span>
            </div>
          )}
        </div>

        <div className="px-6">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Runs</h3>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh_-_280px)] px-6">
          {runs.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-muted-foreground">No runs recorded</p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {runs.map((run, index) => {
                const intensity = Math.min(100, Math.round((run.score / (run.gridSize * run.gridSize * 10)) * 100))
                const runDate = new Date(run.playedAt)
                const relativeNote = buildRelativeNote(runDate)
                const hotness = intensity > 70
                const isPerfect = run.score === run.gridSize * run.gridSize * 10
                const formattedDate = formatFullDate(runDate)
                const formattedTime = formatTimeOfDay(runDate)

                return (
                  <article
                    key={run.id}
                    className={cn(
                      'run-card relative rounded-lg border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md',
                      isPerfect ? 'border-primary/50 bg-primary/5' : 'border-border/40'
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-semibold">{run.difficulty}</h4>
                            <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium">
                              {run.gridSize}×{run.gridSize}
                            </span>
                            {isPerfect && (
                              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-medium">
                                Perfect
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formattedDate}</span>
                            <span>·</span>
                            <span>{formattedTime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">#{runs.length - index}</div>
                          <div className="text-xs text-muted-foreground">{relativeNote}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Score</div>
                          <div className="text-xl font-bold">{run.score}</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Time</div>
                          <div className="text-xl font-bold">{formatDuration(run.durationSeconds)}</div>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Cells</div>
                          <div className="text-xl font-bold">{run.gridSize * run.gridSize}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-medium">{intensity}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-300',
                            isPerfect 
                              ? 'bg-primary'
                              : intensity > 70
                              ? 'bg-primary/70'
                              : 'bg-muted-foreground/40'
                          )}
                          style={{ width: `${intensity}%` }}
                        />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </aside>
    )
  }
)

GameRunSidebar.displayName = 'GameRunSidebar'

function buildRelativeNote(date: Date) {
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / (1000 * 60))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.round(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  const months = Math.round(weeks / 4.35)
  if (months < 12) return `${months}mo ago`
  const years = Math.round(months / 12)
  return `${years}y ago`
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTimeOfDay(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatSpeed(seconds: number, cells: number) {
  const avgTime = (seconds / cells).toFixed(1)
  return `${avgTime}s/cell`
}
