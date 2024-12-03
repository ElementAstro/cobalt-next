import { useState, useEffect } from 'react'

export function useServerConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      // 这里应该是实际的服务器连接检查逻辑
      // 为了演示，我们使用一个模拟的异步操作
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return { isConnected, isChecking, checkConnection }
}

