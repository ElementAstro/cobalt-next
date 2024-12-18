"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Copy,
  Search,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Log {
  timestamp: Date;
  message: string;
  type?: "info" | "warning" | "error";
}

interface ConnectionLogsProps {
  logs: Log[];
}

const LogIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const ConnectionLogs: React.FC<ConnectionLogsProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const copyLogs = () => {
    const text = logs
      .map((log) => `[${log.timestamp.toLocaleTimeString()}] ${log.message}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const clearLogs = () => {
    // 通知父组件清空日志
    // onClear && onClear();
  };

  return (
    <Card className="mt-2">
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm">自动滚动</span>
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
          </div>
          <Button variant="ghost" size="icon" onClick={copyLogs}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={clearLogs}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索日志..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <div
          ref={scrollRef}
          className="h-32 overflow-y-auto bg-secondary/10 text-secondary-foreground p-2 rounded text-sm"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center text-muted-foreground">暂无日志</div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "mb-1 p-1 rounded flex items-start space-x-2 hover:bg-secondary/20 transition-colors",
                    log.type === "error" && "text-red-500",
                    log.type === "warning" && "text-yellow-500"
                  )}
                >
                  <LogIcon type={log.type} />
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>{" "}
                    {log.message}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionLogs;
