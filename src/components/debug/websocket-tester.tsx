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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
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
  const [protocol, setProtocol] = useState("ws");
  const [headers, setHeaders] = useState<[string, string][]>([["", ""]]);
  const [pingInterval, setPingInterval] = useState(0);
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);
  const [lastPongTime, setLastPongTime] = useState<number | null>(null);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [showTimestamps, setShowTimestamps] = useState(true);

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "ws:" || parsed.protocol === "wss:";
    } catch {
      return false;
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, ["", ""]]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = [key, value];
    setHeaders(newHeaders);
  };

  const handlePing = () => {
    if (socketRef.current) {
      setLastPingTime(Date.now());
      socketRef.current.send("ping");
    }
  };

  const filteredLogs = logs.filter((log) =>
    filterQuery ? log.toLowerCase().includes(filterQuery.toLowerCase()) : true
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
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
            <Tabs defaultValue="connection" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="connection">
                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
                >
                  <div className="flex-1 flex flex-col space-y-2">
                    <div className="flex gap-2">
                      <Select value={protocol} onValueChange={setProtocol}>
                        <SelectTrigger className="w-[100px] bg-gray-800">
                          <SelectValue placeholder="Protocol" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800">
                          <SelectItem value="ws">ws://</SelectItem>
                          <SelectItem value="wss">wss://</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="WebSocket URL"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setError(null);
                        }}
                        className="flex-1 bg-gray-800 text-white"
                      />
                    </div>
                    {headers.map(([key, value], index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Header Key"
                          value={key}
                          onChange={(e) =>
                            handleHeaderChange(index, e.target.value, value)
                          }
                          className="flex-1 bg-gray-800 text-white"
                        />
                        <Input
                          placeholder="Header Value"
                          value={value}
                          onChange={(e) =>
                            handleHeaderChange(index, key, e.target.value)
                          }
                          className="flex-1 bg-gray-800 text-white"
                        />
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveHeader(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      onClick={handleAddHeader}
                      className="w-full"
                    >
                      Add Header
                    </Button>
                  </div>
                  <Button
                    onClick={isConnected ? disconnect : connect}
                    className="mt-2 md:mt-0"
                    disabled={!url || !validateUrl(url)}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </Button>
                </motion.div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-4 p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-timestamps"
                        checked={showTimestamps}
                        onCheckedChange={setShowTimestamps}
                      />
                      <Label htmlFor="show-timestamps">Show Timestamps</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-reconnect"
                        checked={autoReconnect}
                        onCheckedChange={setAutoReconnect}
                      />
                      <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
                    </div>
                    {autoReconnect && (
                      <div className="space-y-2">
                        <Label>Reconnect Interval (ms)</Label>
                        <Slider
                          value={[reconnectInterval]}
                          onValueChange={([value]) =>
                            setReconnectInterval(value)
                          }
                          min={1000}
                          max={10000}
                          step={100}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-4 p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="format-messages"
                        checked={showFormatted}
                        onCheckedChange={setShowFormatted}
                      />
                      <Label htmlFor="format-messages">Format Messages</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Ping Interval (ms)</Label>
                      <Slider
                        value={[pingInterval]}
                        onValueChange={([value]) => setPingInterval(value)}
                        min={0}
                        max={10000}
                        step={100}
                      />
                    </div>
                    <Button
                      onClick={handlePing}
                      disabled={!isConnected}
                      variant="secondary"
                    >
                      Send Ping
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Filter logs..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="flex-1 bg-gray-800 text-white"
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter logs by keyword</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <ScrollArea className="h-[300px] rounded-md border border-gray-700">
                <Textarea
                  value={
                    showFormatted
                      ? filteredLogs.map(formatMessage).join("\n")
                      : filteredLogs.join("\n")
                  }
                  readOnly
                  className={cn(
                    "font-mono text-sm bg-gray-800 text-white",
                    "resize-none border-none focus-visible:ring-0"
                  )}
                />
              </ScrollArea>
              {lastPingTime && lastPongTime && (
                <div className="text-sm text-gray-400">
                  Ping: {lastPongTime - lastPingTime}ms
                </div>
              )}
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
