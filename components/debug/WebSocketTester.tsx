'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function WebSocketTester() {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)

  const connect = () => {
    if (!url) return
    socketRef.current = new WebSocket(url)
    socketRef.current.onopen = () => {
      setIsConnected(true)
      addLog('Connected to WebSocket')
    }
    socketRef.current.onmessage = (event) => {
      addLog(`Received: ${event.data}`)
    }
    socketRef.current.onclose = () => {
      setIsConnected(false)
      addLog('Disconnected from WebSocket')
    }
  }

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close()
    }
  }

  const sendMessage = () => {
    if (socketRef.current && message) {
      socketRef.current.send(message)
      addLog(`Sent: ${message}`)
      setMessage('')
    }
  }

  const addLog = (log) => {
    setLogs((prevLogs) => [...prevLogs, log])
  }

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>WebSocket Tester</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="WebSocket URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={isConnected ? disconnect : connect}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isConnected}
            />
            <Button onClick={sendMessage} disabled={!isConnected}>
              Send
            </Button>
          </div>
          <Textarea
            value={logs.join('\n')}
            readOnly
            rows={10}
            className="font-mono text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}

