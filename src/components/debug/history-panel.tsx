"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import { useDebugStore } from "@/store/useDebugStore";
import {
  Trash2,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface HistoryPanelProps {
  onSelect: (config: any) => void;
}

const convertToCSV = (data: any[]) => {
  const headers = Object.keys(data[0].config);
  const rows = data.map((item) =>
    headers.map((header) => JSON.stringify(item.config[header])).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

export default function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const { history, removeHistory, clearHistory } = useDebugStore();
  const [search, setSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "error">(
    "all"
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

  useEffect(() => {
    Prism.highlightAll();
  }, [history]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpandItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.config.method.toLowerCase().includes(search.toLowerCase()) ||
      item.config.url.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "success" && item.status === "success") ||
      (statusFilter === "error" && item.status === "error");

    return matchesSearch && matchesStatus;
  });

  const isAllSelected = selectedItems.length === filteredHistory.length;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
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
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          请求历史记录
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索历史..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 bg-gray-50 dark:bg-gray-700/50"
              aria-label="搜索历史记录"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setSearch("")}
                aria-label="清除搜索"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            aria-label="过滤历史记录"
          >
            <Filter className="w-4 h-4" />
            过滤
          </Button>

          {history.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (history.length === 0) {
                    alert("没有可导出的历史记录");
                    return;
                  }

                  try {
                    const data =
                      exportFormat === "json"
                        ? JSON.stringify(history, null, 2)
                        : convertToCSV(history);

                    const blob = new Blob([data], {
                      type:
                        exportFormat === "json"
                          ? "application/json"
                          : "text/csv",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `history_export_${new Date()
                      .toISOString()
                      .slice(0, 10)}.${exportFormat}`;
                    link.click();
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("导出失败:", error);
                    alert("导出失败，请重试");
                  }
                }}
                className="whitespace-nowrap flex items-center gap-2"
                aria-label="导出历史记录"
              >
                <FileText className="w-4 h-4" />
                导出
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearHistory}
                className="whitespace-nowrap flex items-center gap-2"
                aria-label="清空所有历史记录"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </Button>
            </>
          )}
        </div>

        {showFilters && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              全部
            </Button>
            <Button
              variant={statusFilter === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("success")}
            >
              成功
            </Button>
            <Button
              variant={statusFilter === "error" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("error")}
            >
              失败
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <motion.ul
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredHistory.length === 0 && (
            <motion.div
              className="p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-center text-gray-500 dark:text-gray-400">
                没有匹配的历史记录
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {filteredHistory.map((item) => (
              <motion.li
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-start justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 17 }}
                >
                  <div className="flex items-center mr-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      className="mr-2"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    className="flex-1 text-left dark:text-gray-200 focus:outline-none group"
                    onClick={() => onSelect(item.config)}
                    aria-label={`选择请求 ${item.config.method} ${item.config.url}`}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={getBadgeVariant(item.config.method)}>
                            {item.config.method}
                          </Badge>
                          <span className="text-sm font-medium">
                            {item.config.url}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                      </div>

                      <motion.pre
                        className="language-json bg-gray-200 dark:bg-gray-600 p-2 rounded overflow-auto mt-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: expandedItems.includes(item.id) ? 1 : 0,
                          height: expandedItems.includes(item.id) ? "auto" : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <code
                          dangerouslySetInnerHTML={{
                            __html: Prism.highlight(
                              JSON.stringify(
                                {
                                  method: item.config.method,
                                  url: item.config.url,
                                  headers: item.config.headers,
                                  body: item.config.body,
                                },
                                null,
                                2
                              ),
                              Prism.languages.json,
                              "json"
                            ),
                          }}
                        />
                      </motion.pre>

                      <div className="flex items-center mt-2 space-x-4">
                        <span className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.config.timestamp).toLocaleString()}
                        </span>
                        <span
                          className={`flex items-center text-xs ${
                            item.status === "success"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {item.status === "success" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {item.status === "success" ? "成功" : "失败"}
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
                </motion.div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {selectedItems.length > 0 && (
          <div className="fixed bottom-4 right-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                selectedItems.forEach((id) => removeHistory(id));
                setSelectedItems([]);
              }}
              className="flex items-center gap-2 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              删除选中项 ({selectedItems.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export selected items logic here
              }}
              className="flex items-center gap-2 shadow-lg"
            >
              <FileText className="w-4 h-4" />
              导出选中项
            </Button>
          </div>
        )}

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
      </CardContent>
    </Card>
  );
}
