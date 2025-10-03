'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { RotateCcw, XCircle } from 'lucide-react'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hideNumbers: boolean
  darkMode: boolean
  onHideNumbersChange: (checked: boolean) => void
  onDarkModeChange: (checked: boolean) => void
  onRestart: () => void
  onQuit: () => void
}

export function SettingsModal({
  open,
  onOpenChange,
  hideNumbers,
  darkMode,
  onHideNumbersChange,
  onDarkModeChange,
  onRestart,
  onQuit,
}: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between bg-accent/40 p-4 rounded-lg">
            <span className="font-medium">Hide numbers after clicking</span>
            <Switch checked={hideNumbers} onCheckedChange={onHideNumbersChange} />
          </div>

          <div className="flex items-center justify-between bg-accent/40 p-4 rounded-lg">
            <span className="font-medium">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={onDarkModeChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button variant="outline" className="gap-2" onClick={onRestart}>
              <RotateCcw className="w-5 h-5" />
              Restart (R)
            </Button>
            <Button variant="destructive" className="gap-2" onClick={onQuit}>
              <XCircle className="w-5 h-5" />
              Quit (Q)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
