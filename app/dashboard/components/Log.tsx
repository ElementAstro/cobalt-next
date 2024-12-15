// Log.tsx
"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Trash,
  RefreshCw,
  Upload,
  Tag,
} from "lucide-react";
import { LogChart } from "@/components/log/LogChart";
import { TimeSeriesChart } from "@/components/log/TimeSeriesChart";
import { LogComparison } from "@/components/log/LogComparison";
import { useWebSocket } from "@/hooks/use-websocket";
import { uploadLogs } from "@/utils/log-uploader";
import { motion } from "framer-motion";
import { generateMockLogs } from "@/utils/mock-log-data";
import { useLogStore } from "@/lib/store/log";

Prism.manual = true;

const LogPanel: React.FC = () => {
  const {
    logs,
    setLogs,
    filteredLogs,
    setFilteredLogs,
    filter,
    setFilter,
    search,
    setSearch,
    isCollapsed,
    setIsCollapsed,
    logCount,
    setLogCount,
    isPaginationEnabled,
    setIsPaginationEnabled,
    currentPage,
    setCurrentPage,
    selectedLogs,
    setSelectedLogs,
    activeTab,
    setActiveTab,
    selectedLogForNote,
    setSelectedLogForNote,
    newNote,
    setNewNote,
    newTag,
    setNewTag,
    isRealTimeEnabled,
    setIsRealTimeEnabled,
    exportFormat,
    setExportFormat,
    comparisonTimeRange,
    setComparisonTimeRange,
    isMockMode,
    setIsMockMode,
    theme,
    toggleTheme,
  } = useLogStore();

  const listRef = useRef<List>(null);
  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { status, sendMessage } = useWebSocket();

  useEffect(() => {
    // Add logic to handle real-time updates if needed
  }, [isRealTimeEnabled, isMockMode]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (isMockMode) {
        const mockLogs = generateMockLogs(logCount);
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
      } else {
        const response = await fetch(`/api/logs?count=${logCount}`);
        const data = await response.json();
        setLogs(data);
        setFilteredLogs(data);
      }
    };

    fetchLogs();
  }, [logCount, isMockMode, setFilteredLogs, setLogs]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = (event) => {
        setFilteredLogs(event.data);
      };
    }
  }, [setFilteredLogs]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ logs, filter, search });
    }
  }, [logs, filter, search, setFilteredLogs]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const log = filteredLogs[index];
      const highlightedMessage = Prism.highlight(
        log.message,
        Prism.languages.javascript,
        "javascript"
      );

      return (
        <motion.div
          style={style}
          className="px-2 py-1 border-b last:border-b-0 flex items-center text-sm dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.01 }}
        >
          <Checkbox
            checked={selectedLogs.includes(log.id)}
            onCheckedChange={(checked) => {
              setSelectedLogs(
                checked
                  ? [...selectedLogs, log.id]
                  : selectedLogs.filter((id) => id !== log.id)
              );
            }}
            className="mr-2"
          />
          <div className="flex-grow overflow-hidden">
            <div className="flex flex-wrap items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span
                className={`px-1 rounded text-xs ${getLevelClass(log.level)}`}
              >
                {log.level}
              </span>
              {log.tags &&
                log.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <pre className="mt-1 text-xs whitespace-pre-wrap overflow-hidden text-ellipsis">
              <code
                className="language-javascript"
                dangerouslySetInnerHTML={{ __html: highlightedMessage }}
              />
            </pre>
            {log.note && (
              <div className="mt-1 text-xs text-gray-600 italic overflow-hidden text-ellipsis dark:text-gray-400">
                Note: {log.note}
              </div>
            )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setSelectedLogForNote(log)}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>添加备注和标签</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="note"
                    className="text-right dark:text-gray-300"
                  >
                    备注
                  </Label>
                  <Textarea
                    id="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="tag"
                    className="text-right dark:text-gray-300"
                  >
                    标签
                  </Label>
                  <Input
                    id="tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (selectedLogForNote) {
                    const updatedLogs = logs.map((log) =>
                      log.id === selectedLogForNote.id
                        ? {
                            ...log,
                            note: newNote || log.note,
                            tags: [...(log.tags || []), newTag].filter(Boolean),
                          }
                        : log
                    );
                    setLogs(updatedLogs);
                    setNewNote("");
                    setNewTag("");
                    setSelectedLogForNote(null);
                  }
                }}
                className="dark:bg-blue-600 dark:text-white"
              >
                保存
              </Button>
            </DialogContent>
          </Dialog>
        </motion.div>
      );
    },
    [
      filteredLogs,
      selectedLogs,
      logs,
      setSelectedLogs,
      setSelectedLogForNote,
      newNote,
      newTag,
      setLogs,
      setFilteredLogs,
    ]
  );

  const getLevelClass = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "warn":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const handleClearFilter = () => {
    setFilter("");
    setSearch("");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDownloadLogs = async () => {
    const logsToDownload =
      selectedLogs.length > 0
        ? filteredLogs.filter((log) => selectedLogs.includes(log.id))
        : filteredLogs;

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (exportFormat === "json") {
      content = JSON.stringify(logsToDownload, null, 2);
      mimeType = "application/json";
      fileExtension = "json";
    } else {
      const header = Object.keys(logsToDownload[0]).join(",") + "\n";
      const rows = logsToDownload.map((log) => Object.values(log).join(","));
      content = header + rows.join("\n");
      mimeType = "text/csv";
      fileExtension = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteLogs = () => {
    const updatedLogs = logs.filter((log) => !selectedLogs.includes(log.id));
    setLogs(updatedLogs);
    setFilteredLogs(updatedLogs);
    setSelectedLogs([]);
  };

  const handleUploadLogs = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadedLogs = await uploadLogs(file);
        setLogs(uploadedLogs);
        setFilteredLogs(uploadedLogs);
      } catch (error) {
        console.error("上传日志时出错:", error);
      }
    }
  };

  const paginatedLogs = isPaginationEnabled
    ? filteredLogs.slice((currentPage - 1) * 100, currentPage * 100)
    : filteredLogs;

  return (
    <div
      className={`h-full flex flex-col border rounded-lg shadow-sm ${
        theme === "dark"
          ? "dark:border-gray-700 dark:bg-gray-900"
          : "border-gray-300 bg-white"
      }`}
    >
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-2 dark:text-gray-200"
          >
            <span className="font-semibold">日志面板</span>
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            className="p-2 space-y-2"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <Input
                type="text"
                placeholder="过滤日志..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-grow text-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <Input
                type="text"
                placeholder="搜索日志..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow text-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <Button onClick={handleClearFilter} variant="outline" size="sm">
                清除
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">
                  日志数量:
                </span>
                <Slider
                  min={100}
                  max={10000}
                  step={100}
                  value={[logCount]}
                  onValueChange={(value) => setLogCount(value[0])}
                  className="w-[150px]"
                />
                <span className="text-sm dark:text-gray-200">{logCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">
                  分页:
                </span>
                <Switch
                  checked={isPaginationEnabled}
                  onCheckedChange={(checked) => {
                    setIsPaginationEnabled(checked);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">
                  实时:
                </span>
                <Switch
                  checked={isRealTimeEnabled}
                  onCheckedChange={setIsRealTimeEnabled}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">
                  模拟模式:
                </span>
                <Switch
                  checked={isMockMode}
                  onCheckedChange={(checked) => {
                    setIsMockMode(checked);
                    if (checked) {
                      const mockLogs = generateMockLogs(logCount);
                      setLogs(mockLogs);
                      setFilteredLogs(mockLogs);
                    } else {
                      sendMessage("refresh");
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-2">
              <Button onClick={handleDownloadLogs} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                下载
              </Button>
              <Select
                value={exportFormat}
                onValueChange={(value: "json" | "csv") =>
                  setExportFormat(value)
                }
              >
                <SelectTrigger className="w-[100px] dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleDeleteLogs}
                variant="outline"
                size="sm"
                className="text-red-600 dark:text-red-400"
              >
                <Trash className="h-4 w-4 mr-2" />
                删除选中
              </Button>
              <Button
                onClick={() => sendMessage("refresh")}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新日志
              </Button>
              <Button onClick={handleUploadLogs} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                上传日志
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".json,.csv"
              />
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
                className="dark:bg-gray-700 dark:text-gray-200"
              >
                {theme === "dark" ? "浅色模式" : "暗色模式"}
              </Button>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow flex flex-col dark:text-gray-200"
      >
        <TabsList className="justify-start">
          <TabsTrigger value="logs">日志</TabsTrigger>
          <TabsTrigger value="analysis">分析</TabsTrigger>
          <TabsTrigger value="timeseries">时间序列</TabsTrigger>
          <TabsTrigger value="comparison">对比</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="flex-grow">
          <div className="h-[calc(100vh-300px)]">
            <List
              ref={listRef}
              height={window.innerHeight - 300}
              itemCount={paginatedLogs.length}
              itemSize={80}
              width="100%"
            >
              {Row}
            </List>
          </div>
          {isPaginationEnabled && (
            <div className="p-2 flex justify-center items-center space-x-2 dark:text-gray-200">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                上一页
              </Button>
              <span className="text-sm">
                第 {currentPage} 页，共 {Math.ceil(filteredLogs.length / 100)}{" "}
                页
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredLogs.length / 100)}
                variant="outline"
                size="sm"
              >
                下一页
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="analysis" className="flex-grow p-2">
          <LogChart logs={logs} />
        </TabsContent>
        <TabsContent value="timeseries" className="flex-grow p-2">
          <TimeSeriesChart logs={logs} />
        </TabsContent>
        <TabsContent value="comparison" className="flex-grow p-2">
          <div className="mb-2">
            <Select
              value={comparisonTimeRange}
              onValueChange={(value: "1h" | "24h" | "7d") =>
                setComparisonTimeRange(value)
              }
            >
              <SelectTrigger className="w-[150px] dark:bg-gray-700 dark:text-gray-200">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">最近1小时</SelectItem>
                <SelectItem value="24h">最近24小时</SelectItem>
                <SelectItem value="7d">最近7天</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <LogComparison logs={logs} timeRange={comparisonTimeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogPanel;
