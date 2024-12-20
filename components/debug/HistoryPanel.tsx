// components/HistoryPanel.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import { useRequestStore } from "@/lib/store/debug/request";
import {
  Trash2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HistoryPanelProps {
  onSelect: (config: any) => void;
}

export default function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const { history, removeHistory, clearHistory } = useRequestStore();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    Prism.highlightAll();
  }, [history]);

  const filteredHistory = history.filter(
    (item) =>
      item.config.method.toLowerCase().includes(search.toLowerCase()) ||
      item.config.url.toLowerCase().includes(search.toLowerCase())
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const getBadgeVariant = (method: string) => {
    switch (method) {
      case "GET":
        return "default";
      case "POST":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-xl w-full max-w-4xl mx-auto mt-6">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          请求历史记录
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            placeholder="搜索历史..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-gray-50 dark:bg-gray-700/50 flex items-center"
            aria-label="搜索历史记录"
          />
          {history.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearHistory}
              className="whitespace-nowrap flex items-center"
              aria-label="清空所有历史记录"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <AnimatePresence>
            {filteredHistory.map((item) => (
              <motion.li
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <Button
                    variant="ghost"
                    className="flex-1 text-left dark:text-gray-200 focus:outline-none"
                    onClick={() => onSelect(item.config)}
                    aria-label={`选择请求 ${item.config.method} ${item.config.url}`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getBadgeVariant(item.config.method)}>
                          {item.config.method}
                        </Badge>
                        <span className="text-sm font-medium">
                          {item.config.url}
                        </span>
                      </div>
                      <pre className="language-json bg-gray-200 dark:bg-gray-600 p-2 rounded overflow-auto">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: Prism.highlight(
                              JSON.stringify(
                                {
                                  method: item.config.method,
                                  url: item.config.url,
                                },
                                null,
                                2
                              ),
                              Prism.languages.json,
                              "json"
                            ),
                          }}
                        />
                      </pre>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.config.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center text-xs text-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          成功
                        </span>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-2 text-red-500 hover:text-red-600"
                    onClick={() => removeHistory(item.id)}
                    aria-label="删除此历史记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            className="mt-4 flex items-center"
            aria-label="清空所有历史记录按钮"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            清空所有历史记录
          </Button>
        )}
        {history.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            暂无历史记录
          </p>
        )}
      </CardContent>
    </Card>
  );
}
