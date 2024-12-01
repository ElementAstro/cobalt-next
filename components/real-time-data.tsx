'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface RealTimeData {
  timestamp: string
  moonPhase: number
  visiblePlanets: string[]
  weather: {
    cloudCover: number
    temperature: number
    humidity: number
  }
}

export function RealTimeData() {
  const [data, setData] = useState<RealTimeData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/real-time-data')
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return <div>Loading real-time data...</div>
  }

  return (
    <Card className="w-full md:w-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Real-Time Astronomical Data</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <p className="text-xs text-muted-foreground">Last updated: {new Date(data.timestamp).toLocaleString()}</p>
          <p className="text-sm">Moon phase: {Math.round(data.moonPhase * 100)}%</p>
          <p className="text-sm">Visible planets: {data.visiblePlanets.join(', ') || 'None'}</p>
          <p className="text-sm">Cloud cover: {Math.round(data.weather.cloudCover * 100)}%</p>
          <p className="text-sm">Temperature: {data.weather.temperature}°C</p>
          <p className="text-sm">Humidity: {data.weather.humidity}%</p>
        </CardContent>
      )}
    </Card>
  )
}

