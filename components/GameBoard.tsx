'use client'

import { useRef, useEffect } from 'react'
import { GameCell } from './GameCell'
import { motion } from 'framer-motion'

interface GameBoardProps {
  cells: number[]
  size: number
  currentNumber: number
  hideNumbers: boolean
  onCellClick: (number: number) => boolean
}

export function GameBoard({ cells, size, currentNumber, hideNumbers, onCellClick }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const clickedCells = useRef<Set<number>>(new Set())

  useEffect(() => {
    clickedCells.current.clear()
  }, [cells])

  const handleCellClick = (number: number): boolean => {
    const isCorrect = number === currentNumber
    
    if (isCorrect) {
      clickedCells.current.add(number)
    }
    
    return onCellClick(number)
  }

  return (
    <motion.div
      ref={boardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto grid gap-2 md:gap-3"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {cells.map((number, index) => (
        <GameCell
          key={`${number}-${index}`}
          number={number}
          onClick={handleCellClick}
          isCorrect={clickedCells.current.has(number)}
          isHidden={hideNumbers && clickedCells.current.has(number)}
          delay={index}
        />
      ))}
    </motion.div>
  )
}
