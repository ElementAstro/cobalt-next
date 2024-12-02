import { BaseDialog } from "./base-dialog"
import { Loader2 } from 'lucide-react'

interface LoadingDialogProps {
  isOpen: boolean
  message?: string
}

export function LoadingDialog({ isOpen, message = "加载中..." }: LoadingDialogProps) {
  return (
    <BaseDialog 
      isOpen={isOpen} 
      onClose={() => {}} 
      showCloseButton={false}
      closeOnClickOutside={false}
      icon={<Loader2 className="h-6 w-6 text-blue-500 animate-spin" />}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <p className="mt-2">{message}</p>
      </div>
    </BaseDialog>
  )
}

