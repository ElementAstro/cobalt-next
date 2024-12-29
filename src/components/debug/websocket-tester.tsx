"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useDebugStore } from "@/store/useDebugStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  } = useDebugStore();

  const [showFormatted, setShowFormatted] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const [messageType, setMessageType] = useState("text");
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            WebSocket Tester
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="ml-2"
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
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
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                className="flex-1 bg-gray-800 text-white"
              />
              <Button
                onClick={isConnected ? disconnect : connect}
                className="mt-2 md:mt-0"
                disabled={!url || !validateUrl(url)}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </motion.div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-2 bg-red-500/10 border border-red-500/30 rounded-md text-red-500 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
            >
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex gap-2">
                  <Select
                    value={messageType}
                    onValueChange={setMessageType}
                    disabled={!isConnected}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-800">
                      <SelectValue placeholder="Message Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="binary">Binary</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!isConnected}
                    className="flex-1 bg-gray-800 text-white"
                  />
                </div>
                {messageType === "json" && (
                  <div className="text-xs text-gray-400">
                    Enter valid JSON (e.g., {'{ "key": "value" }'})
                  </div>
                )}
              </div>
              <Button
                onClick={sendMessage}
                disabled={!isConnected || !message}
                className="mt-2 md:mt-0"
              >
                Send
              </Button>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <ScrollArea className="h-[300px] rounded-md border border-gray-700">
                <Textarea
                  value={
                    showFormatted
                      ? logs.map(formatMessage).join("\n")
                      : logs.join("\n")
                  }
                  readOnly
                  className={cn(
                    "font-mono text-sm bg-gray-800 text-white",
                    "resize-none border-none focus-visible:ring-0"
                  )}
                />
              </ScrollArea>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50">
                <Switch
                  id="auto-reconnect"
                  checked={autoReconnect}
                  onCheckedChange={setAutoReconnect}
                />
                <div className="flex-1">
                  <Label htmlFor="auto-reconnect" className="flex items-center">
                    自动重连
                  </Label>
                  {autoReconnect && (
                    <div className="mt-2">
                      <Input
                        type="number"
                        value={reconnectInterval}
                        onChange={(e) =>
                          setReconnectInterval(Number(e.target.value))
                        }
                        placeholder="重连间隔(ms)"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50">
                <Switch
                  id="format-messages"
                  checked={showFormatted}
                  onCheckedChange={setShowFormatted}
                />
                <Label htmlFor="format-messages" className="flex items-center">
                  格式化消息
                </Label>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
