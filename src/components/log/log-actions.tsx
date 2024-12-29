"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Download,
  Trash2,
  RefreshCw,
  Upload,
  Tag,
  FileJson,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLogStore } from "@/store/useLogStore";
import LogUploadDialog from "./log-upload-dialog";
import { uploadLogs } from "@/services/log-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LogActions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    selectedLogs,
    filteredLogs,
    logs,
    setLogs,
    setFilteredLogs,
    setSelectedLogs,
    exportFormat,
    setExportFormat,
    refreshLogs,
  } = useLogStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadLogs = async () => {
    setIsLoading(true);
    try {
      const logsToDownload =
        selectedLogs.length > 0
          ? filteredLogs.filter((log) => selectedLogs.includes(log.id))
          : filteredLogs;

      // Add artificial delay for animation
      await new Promise((resolve) => setTimeout(resolve, 500));

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
      a.download = `logs-${new Date().toISOString()}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLogs = () => {
    const updatedLogs = logs.filter((log) => !selectedLogs.includes(log.id));
    setLogs(updatedLogs);
    setFilteredLogs(updatedLogs);
    setSelectedLogs([]);
  };

  const handleUploadLogs = () => {
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

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-2 w-full p-2 rounded-lg dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDownloadLogs}
              variant="outline"
              size="sm"
              className="flex-1 dark:bg-gray-700/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="ml-2">下载</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>下载选中的日志</TooltipContent>
        </Tooltip>

        <Select
          value={exportFormat}
          onValueChange={(value: "json" | "csv") => setExportFormat(value)}
        >
          <SelectTrigger className="w-[120px] dark:bg-gray-700/50 dark:text-gray-200">
            <SelectValue
              placeholder={
                <div className="flex items-center">
                  {exportFormat === "json" ? (
                    <FileJson className="h-4 w-4 mr-2" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                  )}
                  {exportFormat.toUpperCase()}
                </div>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">
              <div className="flex items-center">
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </div>
            </SelectItem>
            <SelectItem value="csv">
              <div className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDeleteLogs}
              variant="outline"
              size="sm"
              className="text-red-600 dark:text-red-400 flex-1"
            >
              <Trash2 className="h-4 w-4 " />
              删除选中
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除选中的日志</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => refreshLogs()}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 " />
              刷新日志
            </Button>
          </TooltipTrigger>
          <TooltipContent>刷新日志</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleUploadLogs}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Upload className="h-4 w-4 " />
              上传日志
            </Button>
          </TooltipTrigger>
          <TooltipContent>上传日志</TooltipContent>
        </Tooltip>

        <Input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".json,.csv"
        />
        <LogUploadDialog />
      </motion.div>
    </TooltipProvider>
  );
};

export default LogActions;
