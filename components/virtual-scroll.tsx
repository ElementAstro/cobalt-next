import { useState, useEffect, useRef } from 'react'

interface VirtualScrollProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T) => React.ReactNode
}

export function VirtualScroll<T>({ items, height, itemHeight, renderItem }: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop)
      }
    }

    containerRef.current?.addEventListener('scroll', handleScroll)
    return () => containerRef.current?.removeEventListener('scroll', handleScroll)
  }, [])

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + Math.ceil(height / itemHeight) + 1, items.length)

  const visibleItems = items.slice(startIndex, endIndex)

  return (
    <div ref={containerRef} style={{ height, overflowY: 'auto' }}>
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

