import { NextResponse } from 'next/server'

// In a real application, you would fetch this data from a database
const mockCelestialObjects = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Celestial Object ${i + 1}`,
  type: ["OPNCL", "DRKNB", "BRTNB", "GALXY", "PLNTN", "STAR"][Math.floor(Math.random() * 6)],
  constellation: ["UMA", "CYG", "PYX", "ORI", "CAS", "LEO"][Math.floor(Math.random() * 6)],
  rightAscension: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`,
  declination: `${Math.floor(Math.random() * 90)}° ${Math.floor(Math.random() * 60)}' ${Math.floor(Math.random() * 60)}"`,
  magnitude: Math.random() * 100,
  size: Math.floor(Math.random() * 1000),
  distance: Math.floor(Math.random() * 10000),
  riseTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  setTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  transitTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  transitAltitude: Math.floor(Math.random() * 90),
}))

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return NextResponse.json(mockCelestialObjects)
}
