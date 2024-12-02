import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { X } from 'lucide-react'

interface BaseDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  fullScreen?: boolean
  showCloseButton?: boolean
  closeOnClickOutside?: boolean
  icon?: React.ReactNode
}

export function BaseDialog({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  className,
  position = 'center',
  fullScreen = false,
  showCloseButton = true,
  closeOnClickOutside = true,
  icon
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnClickOutside ? onClose : undefined}>
      <DialogContent className={cn(
        "transition-all duration-300",
        fullScreen && "w-screen h-screen max-w-none m-0 rounded-none",
        position === 'top' && "items-start",
        position === 'bottom' && "items-end",
        position === 'left' && "justify-start",
        position === 'right' && "justify-end",
        className
      )}>
        {showCloseButton && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {(icon || title || description) && (
          <DialogHeader>
            <div className="flex items-center space-x-2">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <div>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </div>
            </div>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

