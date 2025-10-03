import { useState, useCallback, useEffect } from 'react'
import { shuffleArray } from '@/lib/utils'
import { RANKS, getRankIndexBySize, boundRankIndex } from '@/lib/progression'

export type GameState = 'menu' | 'playing' | 'level-up' | 'game-over'

export interface GameConfig {
  currentNumber: number
  score: number
  rankIndex: number
  size: number
  seconds: number
  gameState: GameState
  hideNumbers: boolean
  cells: number[]
}

export function useGameState() {
  const [config, setConfig] = useState<GameConfig>({
    currentNumber: 1,
    score: 0,
    rankIndex: 0,
    size: RANKS[0].size,
    seconds: 0,
    gameState: 'menu',
    hideNumbers: false,
    cells: [],
  })

  const [bestTimes, setBestTimes] = useState<Record<number, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem('bestTimes')
    if (saved) {
      setBestTimes(JSON.parse(saved))
    }
    const savedHideNumbers = localStorage.getItem('hideNumbers')
    if (savedHideNumbers !== null) {
      setConfig(prev => ({ ...prev, hideNumbers: savedHideNumbers === 'true' }))
    }
  }, [])

  const generateCells = useCallback((size: number) => {
    const totalCells = size * size
    const numbers = Array.from({ length: totalCells }, (_, i) => i + 1)
    return shuffleArray(numbers)
  }, [])

  const startGame = useCallback((size: number) => {
    const rankIndex = boundRankIndex(getRankIndexBySize(size))
    const actualSize = RANKS[rankIndex]?.size ?? size
    
    setConfig(prev => ({
      ...prev,
      currentNumber: 1,
      score: 0,
      rankIndex,
      size: actualSize,
      seconds: 0,
      gameState: 'playing',
      cells: generateCells(actualSize),
    }))
  }, [generateCells])

  const handleCellClick = useCallback((number: number) => {
    setConfig(prev => {
      if (prev.gameState !== 'playing') return prev

      if (number === prev.currentNumber) {
        const newScore = prev.score + 10
        const isLevelComplete = prev.currentNumber === prev.size * prev.size

        if (isLevelComplete) {
          return {
            ...prev,
            score: newScore,
            gameState: 'level-up',
          }
        }

        return {
          ...prev,
          currentNumber: prev.currentNumber + 1,
          score: newScore,
        }
      } else {
        return {
          ...prev,
          score: Math.max(0, prev.score - 5),
        }
      }
    })
  }, [])

  const nextLevel = useCallback(() => {
    setConfig(prev => {
      const nextRankIndex = boundRankIndex(prev.rankIndex + 1)
      const nextSize = RANKS[nextRankIndex]?.size ?? prev.size

      return {
        ...prev,
        rankIndex: nextRankIndex,
        size: nextSize,
        currentNumber: 1,
        gameState: 'playing',
        cells: generateCells(nextSize),
      }
    })
  }, [generateCells])

  const restartGame = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      currentNumber: 1,
      score: 0,
      seconds: 0,
      cells: generateCells(prev.size),
    }))
  }, [generateCells])

  const quitGame = useCallback(() => {
    setConfig(prev => ({ ...prev, gameState: 'game-over' }))
  }, [])

  const backToMenu = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      currentNumber: 1,
      score: 0,
      rankIndex: 0,
      seconds: 0,
      gameState: 'menu',
      cells: [],
    }))
  }, [])

  const incrementTime = useCallback(() => {
    setConfig(prev => {
      if (prev.gameState === 'playing') {
        return { ...prev, seconds: prev.seconds + 1 }
      }
      return prev
    })
  }, [])

  const toggleHideNumbers = useCallback((checked: boolean) => {
    setConfig(prev => ({ ...prev, hideNumbers: checked }))
    localStorage.setItem('hideNumbers', String(checked))
  }, [])

  const saveBestTime = useCallback((size: number, time: string) => {
    setBestTimes(prev => {
      const updated = { ...prev, [size]: time }
      localStorage.setItem('bestTimes', JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
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
  }
}
