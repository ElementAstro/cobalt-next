import { useEffect, useRef } from 'react'

interface RiseSetChartProps {
  riseTime: string
  setTime: string
  transitTime: string
  transitAltitude: number
}

export function RiseSetChart({ riseTime, setTime, transitTime, transitAltitude }: RiseSetChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up the chart
    const width = canvas.width
    const height = canvas.height
    const padding = 20
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Draw the horizon line
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = '#666'
    ctx.stroke()

    // Calculate time positions
    const risePosition = padding
    const setPosition = width - padding
    const transitPosition = padding + chartWidth / 2

    // Draw the celestial path
    ctx.beginPath()
    ctx.moveTo(risePosition, height - padding)
    ctx.quadraticCurveTo(
      transitPosition,
      padding + chartHeight - (transitAltitude / 90) * chartHeight,
      setPosition,
      height - padding
    )
    ctx.strokeStyle = '#3b82f6'
    ctx.stroke()

    // Draw time labels
    ctx.fillStyle = '#888'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(riseTime, risePosition, height - 5)
    ctx.fillText(transitTime, transitPosition, height - 5)
    ctx.fillText(setTime, setPosition, height - 5)

    // Draw altitude labels
    ctx.textAlign = 'right'
    ctx.fillText('90°', padding - 5, padding)
    ctx.fillText('45°', padding - 5, height / 2)
    ctx.fillText('0°', padding - 5, height - padding)

  }, [riseTime, setTime, transitTime, transitAltitude])

  return <canvas ref={canvasRef} width={300} height={150} className="w-full h-auto" />
}

