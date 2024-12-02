import { BaseDialog } from "./base-dialog"

interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  icon?: React.ReactNode
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  fullScreen?: boolean
}

export function CustomDialog({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  icon,
  position,
  fullScreen
}: CustomDialogProps) {
  return (
    <BaseDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      description={description}
      icon={icon}
      position={position}
      fullScreen={fullScreen}
    >
      {children}
    </BaseDialog>
  )
}

