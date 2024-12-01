import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const currentDate = new Date()
  const moonPhase = Math.random()
  const visiblePlanets = ['Mars', 'Venus', 'Jupiter'].filter(() => Math.random() > 0.5)

  return NextResponse.json({
    timestamp: currentDate.toISOString(),
    moonPhase,
    visiblePlanets,
    weather: {
      cloudCover: Math.random(),
      temperature: Math.round((Math.random() * 30 - 10) * 10) / 10,
      humidity: Math.round(Math.random() * 100),
    },
  })
}

