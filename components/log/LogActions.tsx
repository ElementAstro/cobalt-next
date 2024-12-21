// LogActions.tsx
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash, RefreshCw, Upload, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLogStore } from "@/lib/store/log";
import LogUploadDialog from "./LogUploadDialog";
import { uploadLogs } from "@/utils/log-uploader";

const LogActions: React.FC = () => {
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
    <div className="flex flex-wrap items-center space-x-2 w-full">
      <Button
        onClick={handleDownloadLogs}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <Download className="h-4 w-4 " />
        下载
      </Button>
      <Select
        value={exportFormat}
        onValueChange={(value: "json" | "csv") => setExportFormat(value)}
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
        className="text-red-600 dark:text-red-400 flex-1"
      >
        <Trash className="h-4 w-4 " />
        删除选中
      </Button>
      <Button
        onClick={() => refreshLogs()}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <RefreshCw className="h-4 w-4 " />
        刷新日志
      </Button>
      <Button
        onClick={handleUploadLogs}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <Upload className="h-4 w-4 " />
        上传日志
      </Button>
      <Input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".json,.csv"
      />
      <LogUploadDialog />
    </div>
  );
};

export default LogActions;
