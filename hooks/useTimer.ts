import { useEffect } from 'react'

export function useTimer(isActive: boolean, onTick: () => void) {
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      onTick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTick])
}
