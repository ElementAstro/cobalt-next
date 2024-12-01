'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfigFileSelection } from './steps/ConfigFileSelection'
import { ConfigFileCreation } from './steps/ConfigFileCreation'
import { DriverSelection } from './steps/DriverSelection'
import { DeviceSelection } from './steps/DeviceSelection'
import { StartupConfirmation } from './steps/StartupConfirmation'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export function ServerStartupWizard() {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState<any>(null)
  const [isMockMode, setIsMockMode] = useState(false)

  const steps = [
    { component: ConfigFileSelection, title: "Select Configuration File" },
    { component: ConfigFileCreation, title: "Create Configuration File" },
    { component: DriverSelection, title: "Select Drivers" },
    { component: DeviceSelection, title: "Select Devices" },
    { component: StartupConfirmation, title: "Confirm and Start Server" }
  ]

  const CurrentStep = steps[step].component

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1)
  }

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 0: return config !== null
      case 1: return config && config.name && config.port
      case 2: return Object.values(config).some((value: any) => value && value.driverId)
      case 3: return Object.values(config).some((value: any) => value && value.deviceId)
      default: return true
    }
  }

  return (
    <Card className="w-full max-w-[95%] mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <Progress value={(step / (steps.length - 1)) * 100} className="w-full" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{steps[step].title}</h2>
        <div className="mb-4 flex justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="mock-mode"
              checked={isMockMode}
              onCheckedChange={setIsMockMode}
            />
            <Label htmlFor="mock-mode" className="text-sm sm:text-base">Mock Mode</Label>
          </div>
        </div>
        <CurrentStep
          config={config}
          setConfig={setConfig}
          isMockMode={isMockMode}
          onCreateNew={() => setStep(1)}
        />
        <div className="flex justify-between mt-4 sm:mt-6">
          {step > 0 && (
            <Button onClick={handlePrevious} className="text-sm sm:text-base">Previous</Button>
          )}
          {step < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="text-sm sm:text-base">Next</Button>
          ) : (
            <Button onClick={() => console.log("Start server")} className="text-sm sm:text-base">Start Server</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

