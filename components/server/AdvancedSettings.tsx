import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save, RotateCcw } from 'lucide-react'

interface AdvancedSettingsProps {
  handleSaveConfig: () => void
  handleLoadConfig: () => void
}

export function AdvancedSettings({ handleSaveConfig, handleLoadConfig }: AdvancedSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSaveConfig}>
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
        <Button variant="outline" onClick={handleLoadConfig}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Load Configuration
        </Button>
      </div>
      <div className="space-y-2">
        <Label>Connection Timeout (seconds)</Label>
        <Input type="number" defaultValue="30" />
      </div>
      <div className="space-y-2">
        <Label>Max Retries</Label>
        <Input type="number" defaultValue="3" />
      </div>
      <div className="flex items-center gap-2">
        <Switch id="debug" />
        <Label htmlFor="debug">Enable Debug Mode</Label>
      </div>
    </div>
  )
}

