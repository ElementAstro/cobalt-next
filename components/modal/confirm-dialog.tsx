import { BaseDialog } from "./base-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm: () => void
}

export function ConfirmDialog({ isOpen, onClose, title, message, onConfirm }: ConfirmDialogProps) {
  return (
    <BaseDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
    >
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={() => { onConfirm(); onClose(); }}>确认</Button>
      </div>
    </BaseDialog>
  )
}

