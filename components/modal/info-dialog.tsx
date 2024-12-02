import { BaseDialog } from "./base-dialog"
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react'

interface InfoDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export function InfoDialog({ isOpen, onClose, title, message }: InfoDialogProps) {
  return (
    <BaseDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      icon={<Info className="h-6 w-6 text-blue-500" />}
    >
      <p className="mb-4">{message}</p>
      <Button onClick={onClose} className="w-full">确定</Button>
    </BaseDialog>
  )
}

