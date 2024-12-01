'use client'

import { useParams } from 'next/navigation'
import { CelestialObjectCard } from "@/components/celestial-object-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// In a real application, you would fetch this data from an API
const mockObjects = [
  // ... (use the same mockObjects array from the main page)
]

export default function CelestialObjectDetail() {
  const params = useParams()
  const id = parseInt(params.id as string)
  const object = mockObjects.find(obj => obj.id === id)

  if (!object) {
    return <div>Object not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </Link>
      <CelestialObjectCard {...object} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
          <p>Here you can add more detailed information about the celestial object, such as its history, discovery, and scientific significance.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Visualizations</h2>
          <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
            Placeholder for interactive 3D model or additional charts
          </div>
        </div>
      </div>
    </div>
  )
}

