import { useEffect } from 'react'

interface ShortcutHandlers {
  onRestart: () => void
  onQuit: () => void
  onEscape: () => void
  onSpace: () => void
}

export function useKeyboardShortcuts(
  gameActive: boolean,
  handlers: ShortcutHandlers
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      if (e.code === 'KeyR' && gameActive) {
        e.preventDefault()
        handlers.onRestart()
      }

      if (e.code === 'KeyQ' && gameActive) {
        e.preventDefault()
        handlers.onQuit()
      }

      if (e.code === 'Space' && !gameActive) {
        e.preventDefault()
        handlers.onSpace()
      }

      if (e.code === 'Escape' && gameActive) {
        e.preventDefault()
        handlers.onEscape()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [gameActive, handlers])
}
