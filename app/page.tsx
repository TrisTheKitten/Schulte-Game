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
import { Settings } from 'lucide-react'
import { RANKS, boundRankIndex } from '@/lib/progression'

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
  } = useGameState()

  const [darkMode, setDarkMode] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

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
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="relative mb-8">
          <div className="absolute right-0 top-0 flex items-center gap-3">
            <GameControls onNewGame={backToMenu} variant="compact" />
            <Button
              variant="outline"
              size="icon"
              aria-label="Open settings"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Schulte Table
            </h1>
            {config.gameState === 'playing' && (
              <GameStats
                time={config.seconds}
                score={config.score}
                rankName={currentRank?.name ?? 'Rank'}
                gridSize={config.size}
                nextNumber={config.currentNumber}
              />
            )}
          </div>
        </header>

        {config.gameState === 'menu' && <DifficultySelector onSelect={startGame} />}

        <div className="bg-card rounded-2xl shadow-2xl p-8 mb-10 min-h-[480px] flex items-center justify-center">
          {config.gameState === 'playing' && config.cells.length > 0 && (
            <GameBoard
              cells={config.cells}
              size={config.size}
              currentNumber={config.currentNumber}
              hideNumbers={config.hideNumbers}
              onCellClick={onCellClick}
            />
          )}
          {config.gameState === 'menu' && (
            <div className="text-center text-muted-foreground">
              Select a difficulty level to start playing
            </div>
          )}
        </div>
        <Instructions />

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
      </div>
    </main>
  )
}
