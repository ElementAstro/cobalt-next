"use client"

import { useState, useEffect } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function MockSwitch() {
  const [isMockMode, setIsMockMode] = useState(false)

  useEffect(() => {
    if (isMockMode) {
      localStorage.setItem('mockMode', 'true')
    } else {
      localStorage.removeItem('mockMode')
    }
  }, [isMockMode])

  useEffect(() => {
    const storedMockMode = localStorage.getItem('mockMode')
    if (storedMockMode) {
      setIsMockMode(true)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="mock-mode"
        checked={isMockMode}
        onCheckedChange={setIsMockMode}
      />
      <Label htmlFor="mock-mode">Mock 模式</Label>
    </div>
  )
}

