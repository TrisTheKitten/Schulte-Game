'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { RANKS } from '@/lib/progression'
import { Zap, Brain, Flame, Rocket, Trophy, Skull, Crown, Swords } from 'lucide-react'

interface DifficultySelectorProps {
  onSelect: (size: number) => void
}

const difficultyIcons: Record<string, any> = {
  'Easy': Zap,
  'Medium': Brain,
  'Hard': Flame,
  'Expert': Rocket,
  'Master': Trophy,
  'Extreme': Swords,
  'Hardcore': Skull,
  'God': Crown,
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <h2 className="text-2xl font-semibold mb-6 text-foreground/90">
        Choose Your Challenge
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto px-4">
        {RANKS.map((rank, index) => {
          const Icon = difficultyIcons[rank.name] || Zap
          return (
            <motion.div
              key={rank.size}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: 'easeOut'
              }}
            >
              <Button
                onClick={() => onSelect(rank.size)}
                className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/90 to-primary hover:from-primary hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Icon className="w-5 h-5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">{rank.name}</span>
                  <span className="text-xs opacity-80">{rank.size}×{rank.size}</span>
                </div>
              </Button>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
