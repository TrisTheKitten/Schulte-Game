'use client'

import { useEffect, useRef } from 'react'
import { GameCell } from './GameCell'
import gsap from 'gsap'

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

  useEffect(() => {
    if (!boardRef.current) return

    gsap.fromTo(
      boardRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    )
  }, [cells])

  const handleCellClick = (number: number): boolean => {
    const isCorrect = number === currentNumber
    
    if (isCorrect) {
      clickedCells.current.add(number)
    }
    
    return onCellClick(number)
  }

  return (
    <div
      ref={boardRef}
      className="w-full max-w-2xl mx-auto grid gap-3 p-4"
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
    </div>
  )
}
