'use client'

import { useEffect, useState } from 'react'

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined'
      ? window.innerHeight > window.innerWidth
        ? 'portrait'
        : 'landscape'
      : 'portrait'
  )

  useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        orientation === 'landscape'
          ? 'lg:flex lg:items-center lg:justify-center'
          : ''
      }`}
    >
      <div
        className={`w-full ${
          orientation === 'landscape'
            ? 'lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-4'
            : 'max-w-2xl mx-auto'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

