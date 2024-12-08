import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ConnectionInterfaceProps {
  onConnect: () => void
  isChecking: boolean
}

export function ConnectionInterface({ onConnect, isChecking }: ConnectionInterfaceProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-bold mb-4">服务器连接</h2>
      {isChecking ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p>正在检查连接...</p>
        </div>
      ) : (
        <>
          <p className="mb-4">未能连接到服务器。请检查您的网络连接并重试。</p>
          <Button onClick={onConnect}>
            重新连接
          </Button>
        </>
      )}
    </div>
  )
}

