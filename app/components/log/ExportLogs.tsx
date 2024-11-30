import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Log } from "@/types/log";

interface ExportLogsProps {
  logs: Log[];
}

export function ExportLogs({ logs }: ExportLogsProps) {
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const exportToCSV = () => {
    const headers = ["Timestamp", "Level", "Source", "Message"];
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          log.timestamp,
          log.level,
          log.source,
          `"${log.message.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    downloadFile(csvContent, "text/csv;charset=utf-8;", "logs.csv");
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(logs, null, 2);
    downloadFile(jsonContent, "application/json;charset=utf-8;", "logs.json");
  };

  const downloadFile = (
    content: string,
    mimeType: string,
    filename: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = () => {
    if (exportFormat === "csv") {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <div className="flex space-x-2">
      <Select
        value={exportFormat}
        onValueChange={(value: "csv" | "json") => setExportFormat(value)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="选择格式" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleExport}>导出日志</Button>
    </div>
  );
}
