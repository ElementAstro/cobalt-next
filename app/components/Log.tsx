"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { LogEntry } from "@/types/log";
import { uploadLogs } from "@/utils/log-uploader";
import { motion } from "framer-motion";

Prism.manual = true;

interface LogPanelProps {
  initialLogCount?: number;
  enablePagination?: boolean;
  websocketUrl?: string;
}

const LogPanel: React.FC<LogPanelProps> = ({
  initialLogCount = 1000,
  enablePagination = false,
  websocketUrl = "ws://localhost:3001",
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logCount, setLogCount] = useState(initialLogCount);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(enablePagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("logs");
  const [selectedLogForNote, setSelectedLogForNote] = useState<LogEntry | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [comparisonTimeRange, setComparisonTimeRange] = useState<"1h" | "24h" | "7d">("24h");
  const [isMockMode, setIsMockMode] = useState(false);
  const listRef = useRef<List>(null);
  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logsPerPage = 100;

  const { lastMessage, sendMessage } = useWebSocket(websocketUrl);

  useEffect(() => {
    if (lastMessage && isRealTimeEnabled && !isMockMode) {
      const newLog = JSON.parse(lastMessage.data);
      setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9999)]);
    }
  }, [lastMessage, isRealTimeEnabled, isMockMode]);

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

    workerRef.current = new Worker(new URL("../../workers/log-worker.ts", import.meta.url));

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [logCount, isMockMode]);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.onmessage = (event) => {
        setFilteredLogs(event.data);
      };
    }
  }, []);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ logs, filter, search });
    }
  }, [logs, filter, search]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const log = filteredLogs[index];
      const highlightedMessage = Prism.highlight(log.message, Prism.languages.javascript, "javascript");

      return (
        <motion.div
          style={style}
          className="px-2 py-1 border-b last:border-b-0 flex items-center text-sm dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.02 }}
        >
          <Checkbox
            checked={selectedLogs.includes(log.id)}
            onCheckedChange={(checked) => {
              setSelectedLogs((prev) =>
                checked ? [...prev, log.id] : prev.filter((id) => id !== log.id)
              );
            }}
            className="mr-2"
          />
          <div className="flex-grow overflow-hidden">
            <div className="flex flex-wrap items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span className={`px-1 rounded text-xs ${getLevelClass(log.level)}`}>
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
                <DialogTitle>Add Note and Tags</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right dark:text-gray-300">
                    Note
                  </Label>
                  <Textarea
                    id="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="col-span-3 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag" className="text-right dark:text-gray-300">
                    Tag
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
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </motion.div>
      );
    },
    [filteredLogs, selectedLogs, logs]
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearFilter = () => {
    setFilter("");
    setSearch("");
  };

  const handleLogCountChange = (value: number[]) => {
    setLogCount(value[0]);
  };

  const handlePaginationToggle = (checked: boolean) => {
    setIsPaginationEnabled(checked);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const handleRealTimeToggle = (checked: boolean) => {
    setIsRealTimeEnabled(checked);
  };

  const handleMockModeToggle = (checked: boolean) => {
    setIsMockMode(checked);
    if (checked) {
      const mockLogs = generateMockLogs(logCount);
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
    } else {
      sendMessage("refresh");
    }
  };

  const handleUploadLogs = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadedLogs = await uploadLogs(file);
        setLogs(uploadedLogs);
        setFilteredLogs(uploadedLogs);
      } catch (error) {
        console.error("Error uploading logs:", error);
      }
    }
  };

  const paginatedLogs = isPaginationEnabled
    ? filteredLogs.slice(
        (currentPage - 1) * logsPerPage,
        currentPage * logsPerPage
      )
    : filteredLogs;

  return (
    <div className="h-full flex flex-col border rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center p-2 dark:text-gray-200"
          >
            <span className="font-semibold">Log Panel</span>
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
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <Input
                type="text"
                placeholder="Filter logs..."
                value={filter}
                onChange={handleFilterChange}
                className="flex-grow text-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <Input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={handleSearchChange}
                className="flex-grow text-sm dark:bg-gray-700 dark:text-gray-200"
              />
              <Button onClick={handleClearFilter} variant="outline" size="sm">
                Clear
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">Log count:</span>
                <Slider
                  min={100}
                  max={10000}
                  step={100}
                  value={[logCount]}
                  onValueChange={handleLogCountChange}
                  className="w-[150px]"
                />
                <span className="text-sm dark:text-gray-200">{logCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">Pagination:</span>
                <Switch
                  checked={isPaginationEnabled}
                  onCheckedChange={handlePaginationToggle}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">Real-time:</span>
                <Switch
                  checked={isRealTimeEnabled}
                  onCheckedChange={handleRealTimeToggle}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-200">Mock mode:</span>
                <Switch
                  checked={isMockMode}
                  onCheckedChange={handleMockModeToggle}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-2">
              <Button onClick={handleDownloadLogs} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Select
                value={exportFormat}
                onValueChange={(value: "json" | "csv") => setExportFormat(value)}
              >
                <SelectTrigger className="w-[100px] dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Format" />
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
                Delete Selected
              </Button>
              <Button
                onClick={() => sendMessage("refresh")}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Logs
              </Button>
              <Button onClick={handleUploadLogs} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logs
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".json,.csv"
              />
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
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
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
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {Math.ceil(filteredLogs.length / logsPerPage)}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(filteredLogs.length / logsPerPage)
                }
                variant="outline"
                size="sm"
              >
                Next
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
              onValueChange={(value: "1h" | "24h" | "7d") => setComparisonTimeRange(value)}
            >
              <SelectTrigger className="w-[150px] dark:bg-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1 hour</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
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