"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function WebSocketTester() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

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

  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, log]);
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
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Input
                placeholder="WebSocket URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={isConnected ? disconnect : connect}>
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Input
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!isConnected}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!isConnected}>
                Send
              </Button>
            </div>
            <Textarea
              value={logs.join("\n")}
              readOnly
              rows={10}
              className="font-mono text-sm bg-gray-800 text-white"
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
