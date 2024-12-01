import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchDevices } from '@/app/actions/serverActions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Device {
  id: string
  name: string
  category: string
  driverId: string
}

export function DeviceSelection({ config, setConfig, isMockMode }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('camera')

  useEffect(() => {
    const fetchAllDevices = async () => {
      setIsLoading(true)
      const allDevices = await Promise.all(
        Object.entries(config).map(async ([category, value]: [string, any]) => {
          if (value?.driverId) {
            const categoryDevices = await fetchDevices(value.driverId, isMockMode)
            return categoryDevices.map(device => ({ ...device, category }))
          }
          return []
        })
      )
      setDevices(allDevices.flat())
      setIsLoading(false)
    }

    fetchAllDevices()
  }, [config, isMockMode])

  const handleDeviceSelect = (deviceId: string) => {
    const selectedDevice = devices.find(device => device.id === deviceId)
    setConfig({ 
      ...config, 
      [activeCategory]: { 
        ...config[activeCategory], 
        deviceId, 
        deviceName: selectedDevice?.name 
      } 
    })
  }

  if (isLoading) {
    return <div>Loading devices...</div>
  }

  const categories = ['camera', 'mount', 'focuser', 'filterWheel', 'powerManagement', 'guider', 'solver']

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Tabs defaultValue="camera" onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            {config[category]?.driverId ? (
              <Select onValueChange={handleDeviceSelect} value={config[category]?.deviceId || ''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select a ${category}`} />
                </SelectTrigger>
                <SelectContent>
                  {devices
                    .filter(device => device.category === category)
                    .map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <div>Please select a driver for this category first.</div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

