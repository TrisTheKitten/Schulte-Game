'use client'

import { motion } from 'framer-motion'
const guideSteps = [
  'Scan the grid for number one and tap it to begin the round.',
  'Select each following number in order without skipping any values.',
  'Watch the timer and finish the grid quickly to sharpen your focus.',
  'Advance to higher levels to test faster reflexes and visual endurance.'
]

export function Instructions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30 flex flex-col items-center gap-5 text-center hover:bg-card/40 transition-colors"
      >
        <h3 className="text-lg font-semibold">Game Guide</h3>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Master the Schulte table by moving through each cell deliberately. Follow these steps to
          boost concentration, accelerate recognition speed, and climb the progression ladder.
        </p>
        <ol className="w-full space-y-4 text-left">
          {guideSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  )
}
