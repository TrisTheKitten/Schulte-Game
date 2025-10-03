'use client'

import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'

interface GameControlsProps {
  onNewGame: () => void
  variant?: 'default' | 'compact'
}

export function GameControls({ onNewGame, variant = 'default' }: GameControlsProps) {
  if (variant === 'compact') {
    return (
      <Button onClick={onNewGame} size="default" className="gap-2">
        <PlayCircle className="w-5 h-5" />
        New Game
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <Button onClick={onNewGame} size="lg" className="gap-2">
        <PlayCircle className="w-5 h-5" />
        New Game
      </Button>
    </div>
  )
}
