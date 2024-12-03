import React from 'react'

interface OverlayProps {
  isVisible: boolean
  onClose?: () => void
  children?: React.ReactNode
  className?: string
}

export function Overlay({ isVisible, onClose, children, className = '' }: OverlayProps) {
  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

