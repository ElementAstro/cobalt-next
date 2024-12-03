import { useState, useEffect } from 'react'

const DEFAULT_SETTINGS = {
  darkMode: false,
  defaultTimeout: 5000,
  maxHistoryItems: 10,
}

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('settings') || '{}')
    setSettings({ ...DEFAULT_SETTINGS, ...savedSettings })
  }, [])

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('settings', JSON.stringify(updatedSettings))
  }

  return { settings, updateSettings }
}

