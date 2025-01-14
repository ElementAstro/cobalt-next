"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Check,
  X,
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const LogActions: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    setShowDeleteConfirm(false);
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
        setUploadProgress(0);
        setIsLoading(true);
        const onProgress = (progress: number) => {
          setUploadProgress(Math.round(progress * 100));
        };
        const uploadedLogs = await uploadLogs(file, onProgress);
        setLogs(uploadedLogs);
        setFilteredLogs(uploadedLogs);
      } catch (error) {
        console.error("上传日志时出错:", error);
        // Show error toast notification
        toast({
          title: "上传失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-center gap-2 w-full p-2 rounded-lg dark:bg-gray-800/50 backdrop-blur-sm"
      >
        {/* Download Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleDownloadLogs}
                variant="outline"
                size="sm"
                className="flex-1 dark:bg-gray-700/50 relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Download className="h-4 w-4" />
                  </motion.div>
                )}
                <span className="ml-2">下载</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>下载选中的日志</TooltipContent>
        </Tooltip>

        {/* Export Format Selector */}
        <motion.div whileHover={{ scale: 1.05 }}>
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
        </motion.div>

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                size="sm"
                className="text-red-600 dark:text-red-400 flex-1"
                disabled={selectedLogs.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                删除选中
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>删除选中的日志</TooltipContent>
        </Tooltip>

        {/* Refresh Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => refreshLogs()}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4" />
                刷新日志
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>刷新日志</TooltipContent>
        </Tooltip>

        {/* Upload Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleUploadLogs}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Upload className="h-4 w-4" />
                上传日志
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>上传日志</TooltipContent>
        </Tooltip>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploadProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Progress value={uploadProgress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input */}
        <Input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".json,.csv"
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <p>确定要删除选中的 {selectedLogs.length} 条日志吗？</p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  取消
                </Button>
                <Button variant="destructive" onClick={handleDeleteLogs}>
                  确认删除
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <LogUploadDialog />
      </motion.div>
    </TooltipProvider>
  );
};

export default LogActions;
