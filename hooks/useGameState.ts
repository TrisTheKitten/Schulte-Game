import { useState, useCallback, useEffect, useRef } from 'react'
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

export interface GameRun {
  id: string
  score: number
  durationSeconds: number
  difficulty: string
  gridSize: number
  playedAt: string
  rankIndex: number
}

const RUN_HISTORY_STORAGE_KEY = 'runHistory'
const STREAK_STORAGE_KEY = 'runStreaks'
const BEST_TIMES_STORAGE_KEY = 'bestTimes'
const HIDE_NUMBERS_STORAGE_KEY = 'hideNumbers'
const HISTORY_LIMIT = 50
const persistStreaks = (current: number, max: number) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify({ current, max }))
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
  const [runHistory, setRunHistory] = useState<GameRun[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const lastRecordedRunKey = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = localStorage.getItem(BEST_TIMES_STORAGE_KEY)
    if (saved) {
      setBestTimes(JSON.parse(saved))
    }
    const savedHideNumbers = localStorage.getItem(HIDE_NUMBERS_STORAGE_KEY)
    if (savedHideNumbers !== null) {
      setConfig(prev => ({ ...prev, hideNumbers: savedHideNumbers === 'true' }))
    }
    const savedRunHistory = localStorage.getItem(RUN_HISTORY_STORAGE_KEY)
    if (savedRunHistory) {
      try {
        setRunHistory(JSON.parse(savedRunHistory))
      } catch {}
    }
    const savedStreaks = localStorage.getItem(STREAK_STORAGE_KEY)
    if (savedStreaks) {
      try {
        const parsed = JSON.parse(savedStreaks)
        setCurrentStreak(parsed.current ?? 0)
        setMaxStreak(parsed.max ?? 0)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (config.gameState === 'playing') {
      lastRecordedRunKey.current = null
    }
  }, [config.gameState])

  useEffect(() => {
    if (config.gameState !== 'game-over') return
    const runKey = `${config.rankIndex}-${config.score}-${config.seconds}-${config.size}`
    if (lastRecordedRunKey.current === runKey) return
    lastRecordedRunKey.current = runKey
    const difficulty = RANKS[config.rankIndex]?.name ?? `Grid ${config.size}`
    const newRun: GameRun = {
      id: `${Date.now()}`,
      score: config.score,
      durationSeconds: config.seconds,
      difficulty,
      gridSize: config.size,
      playedAt: new Date().toISOString(),
      rankIndex: config.rankIndex,
    }
    setRunHistory(prev => {
      const updated = [newRun, ...prev].slice(0, HISTORY_LIMIT)
      localStorage.setItem(RUN_HISTORY_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    const didComplete = config.score > 0
    const nextCurrent = didComplete ? currentStreak + 1 : 0
    const nextMax = Math.max(maxStreak, nextCurrent)
    setCurrentStreak(nextCurrent)
    setMaxStreak(nextMax)
    persistStreaks(nextCurrent, nextMax)
  }, [config.gameState, config.score, config.seconds, config.rankIndex, config.size, currentStreak, maxStreak])

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
      }

      const nextCurrent = 0
      setCurrentStreak(nextCurrent)
      setMaxStreak(prevMax => {
        persistStreaks(nextCurrent, prevMax)
        return prevMax
      })

      return {
        ...prev,
        score: Math.max(0, prev.score - 5),
      }
    })
  }, [maxStreak])

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
    localStorage.setItem(HIDE_NUMBERS_STORAGE_KEY, String(checked))
  }, [])

  const saveBestTime = useCallback((size: number, time: string) => {
    setBestTimes(prev => {
      const updated = { ...prev, [size]: time }
      localStorage.setItem(BEST_TIMES_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    config,
    bestTimes,
    runHistory,
    currentStreak,
    maxStreak,
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
