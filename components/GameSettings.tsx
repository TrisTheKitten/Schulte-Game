'use client'

import { Settings } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface GameSettingsProps {
  hideNumbers: boolean
  darkMode: boolean
  onHideNumbersChange: (checked: boolean) => void
  onDarkModeChange: (checked: boolean) => void
}

export function GameSettings({
  hideNumbers,
  darkMode,
  onHideNumbersChange,
  onDarkModeChange,
}: GameSettingsProps) {
  return (
    <div className="bg-card/95 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-border/40 mb-8">
      <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2 justify-center">
        <Settings className="w-5 h-5" />
        Settings
      </h3>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <SettingItem
          label="Hide numbers after clicking"
          checked={hideNumbers}
          onCheckedChange={onHideNumbersChange}
        />
        <SettingItem
          label="Dark Mode"
          checked={darkMode}
          onCheckedChange={onDarkModeChange}
        />
      </div>
    </div>
  )
}

interface SettingItemProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function SettingItem({ label, checked, onCheckedChange }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between bg-card border border-border/40 p-4 rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all">
      <span className="font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
