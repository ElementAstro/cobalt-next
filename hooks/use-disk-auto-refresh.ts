import { useState, useEffect, useCallback } from 'react'

export function useAutoRefresh(callback: () => void, interval: number) {
  const [isActive, setIsActive] = useState(true)

  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(callback, interval)

    return () => clearInterval(timer)
  }, [callback, interval, isActive])

  return { isActive, toggleActive }
}

