// WebSocketTester.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useWebSocketStore } from "@/lib/store/debug";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function WebSocketTester() {
  const {
    url,
    setUrl,
    message,
    setMessage,
    logs,
    addLog,
    isConnected,
    setIsConnected,
    autoReconnect,
    setAutoReconnect,
    reconnectInterval,
    setReconnectInterval,
  } = useWebSocketStore();

  const [showFormatted, setShowFormatted] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const tryReconnect = useCallback(() => {
    if (autoReconnect && url) {
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, reconnectInterval);
    }
  }, [autoReconnect, reconnectInterval, url]);

  const formatMessage = (message: string) => {
    try {
      return JSON.stringify(JSON.parse(message), null, 2);
    } catch {
      return message;
    }
  };

  const connect = () => {
    if (!url) return;
    socketRef.current = new WebSocket(url);
    socketRef.current.onopen = () => {
      setIsConnected(true);
      addLog("Connected to WebSocket");
    };
    socketRef.current.onmessage = (event: MessageEvent) => {
      addLog(`Received: ${event.data}`);
    };
    socketRef.current.onclose = () => {
      setIsConnected(false);
      addLog("Disconnected from WebSocket");
      tryReconnect();
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const sendMessage = () => {
    if (socketRef.current && message) {
      socketRef.current.send(message);
      addLog(`Sent: ${message}`);
      setMessage("");
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>WebSocket Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, staggerChildren: 0.2 }}
            className="space-y-4"
          >
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
            >
              <Input
                placeholder="WebSocket URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-800 text-white"
              />
              <Button
                onClick={isConnected ? disconnect : connect}
                className="mt-2 md:mt-0"
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
            >
              <Input
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!isConnected}
                className="flex-1 bg-gray-800 text-white"
              />
              <Button
                onClick={sendMessage}
                disabled={!isConnected}
                className="mt-2 md:mt-0"
              >
                Send
              </Button>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <Textarea
                value={
                  showFormatted
                    ? logs.map(formatMessage).join("\n")
                    : logs.join("\n")
                }
                readOnly
                rows={10}
                className="font-mono text-sm bg-gray-800 text-white"
              />
            </motion.div>
            <motion.div>
              <div className="flex items-center space-x-4 mb-4">
                <Switch
                  id="auto-reconnect"
                  checked={autoReconnect}
                  onCheckedChange={setAutoReconnect}
                />
                <Label htmlFor="auto-reconnect">自动重连</Label>
                {autoReconnect && (
                  <Input
                    type="number"
                    value={reconnectInterval}
                    onChange={(e) =>
                      setReconnectInterval(Number(e.target.value))
                    }
                    placeholder="重连间隔(ms)"
                    className="w-32"
                  />
                )}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Switch
                  id="format-messages"
                  checked={showFormatted}
                  onCheckedChange={setShowFormatted}
                />
                <Label htmlFor="format-messages">格式化消息</Label>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
