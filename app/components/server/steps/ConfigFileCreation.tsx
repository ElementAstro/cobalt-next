import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createConfigFile } from '@/app/actions/serverActions'
import { Button } from "@/components/ui/button"

export function ConfigFileCreation({ setConfig, isMockMode, onComplete }) {
  const [name, setName] = useState('')
  const [port, setPort] = useState('')

  const handleCreate = async () => {
    if (name && port) {
      const newConfig = await createConfigFile({ name, port }, isMockMode)
      setConfig(newConfig)
      onComplete()
    }
  }

  return (
    <div className="space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <div>
        <Label htmlFor="config-name" className="text-sm sm:text-base">Configuration Name</Label>
        <Input
          id="config-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter configuration name"
          className="mt-1 text-sm sm:text-base"
        />
      </div>
      <div>
        <Label htmlFor="server-port" className="text-sm sm:text-base">Server Port</Label>
        <Input
          id="server-port"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Enter server port"
          className="mt-1 text-sm sm:text-base"
        />
      </div>
      <Button onClick={handleCreate} className="w-full text-sm sm:text-base">Create Configuration</Button>
    </div>
  )
}

