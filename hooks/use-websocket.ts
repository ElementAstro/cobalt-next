import { useState, useEffect, useCallback } from 'react'

export const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)

  useEffect(() => {
    const websocket = new WebSocket(url)
    setWs(websocket)

    return () => {
      websocket.close()
    }
  }, [url])

  useEffect(() => {
    if (!ws) return

    ws.onmessage = (event) => {
      setLastMessage(event)
    }
  }, [ws])

  const sendMessage = useCallback((message: string) => {
    if (ws) ws.send(message)
  }, [ws])

  return { lastMessage, sendMessage }
}

