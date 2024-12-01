import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchDrivers } from '@/app/actions/serverActions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Driver {
  id: string
  name: string
  category: string
}

export function DriverSelection({ config, setConfig, isMockMode }) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('camera')

  useEffect(() => {
    setIsLoading(true)
    fetchDrivers(isMockMode)
      .then(driversData => {
        setDrivers(driversData || [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching drivers:', error)
        setDrivers([])
        setIsLoading(false)
      })
  }, [isMockMode])

  const handleDriverSelect = (driverId: string) => {
    const selectedDriver = drivers.find(driver => driver.id === driverId)
    setConfig({ ...config, [activeCategory]: { driverId, driverName: selectedDriver?.name } })
  }

  if (isLoading) {
    return <div>Loading drivers...</div>
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
            <Select onValueChange={handleDriverSelect} value={config?.[category]?.driverId || ''}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select a ${category} driver`} />
              </SelectTrigger>
              <SelectContent>
                {drivers
                  .filter(driver => driver.category === category)
                  .map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

