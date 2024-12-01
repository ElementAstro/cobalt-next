import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { startServer } from '@/app/actions/serverActions'

export function StartupConfirmation({ config, isMockMode }) {
  const [status, setStatus] = useState('')

  const handleStartServer = async () => {
    setStatus('Starting server...')
    try {
      const result = await startServer(config, isMockMode)
      setStatus(result.success ? 'Server started successfully!' : 'Failed to start server.')
    } catch (error) {
      setStatus('An error occurred while starting the server.')
    }
  }

  const categories = ['camera', 'mount', 'focuser', 'filterWheel', 'powerManagement', 'guider', 'solver']

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-center">Configuration Summary</h3>
      <ul className="list-disc list-inside text-sm sm:text-base space-y-2">
        <li>Configuration Name: {config.name}</li>
        <li>Server Port: {config.port}</li>
        {categories.map(category => (
          config[category] && (
            <li key={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}:
              <ul className="list-disc list-inside ml-4">
                <li>Driver: {config[category].driverName}</li>
                <li>Device: {config[category].deviceName}</li>
              </ul>
            </li>
          )
        ))}
      </ul>
      <Button onClick={handleStartServer} className="w-full text-sm sm:text-base">Start Server</Button>
      {status && <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center">{status}</p>}
    </div>
  )
}

