'use client'

import { useState, useCallback } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { useTimer } from '@/hooks/useTimer'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { GameStats } from '@/components/GameStats'
import { GameBoard } from '@/components/GameBoard'
import { DifficultySelector } from '@/components/DifficultySelector'
import { GameControls } from '@/components/GameControls'
import { Instructions } from '@/components/Instructions'
import { LevelUpModal, GameOverModal } from '@/components/GameModals'
import { SettingsModal } from '@/components/SettingsModal'
import { Button } from '@/components/ui/button'
import { Flame, Settings } from 'lucide-react'
import { RANKS, boundRankIndex } from '@/lib/progression'
import { GameRunSidebar } from '@/components/GameRunSidebar'

export default function Home() {
  const {
    config,
    bestTimes,
    startGame,
    handleCellClick,
    nextLevel,
    restartGame,
    quitGame,
    backToMenu,
    incrementTime,
    toggleHideNumbers,
    saveBestTime,
    runHistory,
    currentStreak,
    maxStreak,
  } = useGameState()

  const [darkMode, setDarkMode] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [runLogOpen, setRunLogOpen] = useState(false)

  useTimer(config.gameState === 'playing', incrementTime)

  const currentRank = RANKS[config.rankIndex] ?? RANKS[0]
  const nextRankIndex = boundRankIndex(config.rankIndex + 1)
  const nextRank = RANKS[nextRankIndex] ?? currentRank
  const isMaxRank = config.rankIndex >= RANKS.length - 1

  const onCellClick = useCallback(
    (number: number) => {
      handleCellClick(number)
      return number === config.currentNumber
    },
    [handleCellClick, config.currentNumber]
  )

  const handleDarkModeChange = useCallback((checked: boolean) => {
    setDarkMode(checked)
    document.documentElement.classList.toggle('dark', checked)
    document.documentElement.classList.toggle('light', !checked)
  }, [])

  useKeyboardShortcuts(config.gameState === 'playing', {
    onRestart: restartGame,
    onQuit: quitGame,
    onEscape: backToMenu,
    onSpace: backToMenu,
  })

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="flex-1" />
            <div className="flex-shrink-0 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-cyan-400 bg-clip-text text-transparent">
                Schulte Table
              </h1>
              <p className="text-sm text-muted-foreground/70">Train your focus and visual speed</p>
            </div>
            <div className="flex-1 flex items-start justify-end gap-2">
              {config.gameState !== 'menu' && (
                <GameControls onNewGame={backToMenu} variant="compact" />
              )}
              <Button
                variant="outline"
                size="icon"
                aria-label="Open legacy log"
                onClick={() => setRunLogOpen(true)}
                className="shadow-sm"
              >
                <Flame className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open settings"
                onClick={() => setSettingsOpen(true)}
                className="shadow-sm"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="text-center">
            {config.gameState === 'playing' && (
              <>
                <GameStats
                  time={config.seconds}
                  score={config.score}
                  rankName={currentRank?.name ?? 'Rank'}
                  gridSize={config.size}
                  nextNumber={config.currentNumber}
                />
                <div className="mt-4 flex flex-col items-center gap-1 text-sm text-muted-foreground/80">
                  <span>Press &quot;R&quot; to restart the game</span>
                  <span>Press &quot;Q&quot; to quit the game</span>
                </div>
              </>
            )}
          </div>
        </header>

        {config.gameState === 'menu' && (
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 p-8 mb-8">
            <DifficultySelector onSelect={startGame} />
          </div>
        )}

        {config.gameState === 'playing' && config.cells.length > 0 && (
          <div className="bg-transparent backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 p-6 md:p-8 mb-8">
            <GameBoard
              cells={config.cells}
              size={config.size}
              currentNumber={config.currentNumber}
              hideNumbers={config.hideNumbers}
              onCellClick={onCellClick}
            />
          </div>
        )}

        {config.gameState === 'menu' && (
          <div className="text-center mt-12">
            <Instructions />
          </div>
        )}

        <LevelUpModal
          open={config.gameState === 'level-up'}
          currentRankName={currentRank?.name ?? 'Rank'}
          currentGridSize={config.size}
          nextRankName={nextRank?.name ?? currentRank?.name ?? 'Rank'}
          nextGridSize={nextRank?.size ?? config.size}
          isMaxRank={isMaxRank}
          onNext={nextLevel}
        />

        <GameOverModal
          open={config.gameState === 'game-over'}
          score={config.score}
          time={config.seconds}
          size={config.size}
          bestTimes={bestTimes}
          onPlayAgain={backToMenu}
          onSaveBestTime={saveBestTime}
        />

        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          hideNumbers={config.hideNumbers}
          darkMode={darkMode}
          onHideNumbersChange={toggleHideNumbers}
          onDarkModeChange={handleDarkModeChange}
          onRestart={restartGame}
          onQuit={quitGame}
        />
        {runLogOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setRunLogOpen(false)}
          />
        )}
        <GameRunSidebar
          open={runLogOpen}
          runs={runHistory}
          currentStreak={currentStreak}
          maxStreak={maxStreak}
          onClose={() => setRunLogOpen(false)}
        />
      </div>
    </main>
  )
}
