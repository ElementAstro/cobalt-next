import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Virtuoso } from "react-virtuoso";
import { Log, LogLevelColor } from "@/types/log";

interface LogDisplayProps {
  logs: Log[];
  logLevelColors: LogLevelColor;
}

const LogDetail: React.FC<{ log: Log }> = React.memo(({ log }) => {
  return (
    <div className="text-sm">
      <p>
        <strong>ID:</strong> {log.id}
      </p>
      <p>
        <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
      </p>
      <p>
        <strong>Level:</strong> {log.level}
      </p>
      <p>
        <strong>Source:</strong> {log.source}
      </p>
      <p>
        <strong>Message:</strong> {log.message}
      </p>
    </div>
  );
});

LogDetail.displayName = "LogDetail";

export const LogDisplay: React.FC<LogDisplayProps> = React.memo(
  function LogDisplay({ logs, logLevelColors }) {
    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] lg:w-[200px]">时间戳</TableHead>
              <TableHead className="w-[80px] lg:w-[100px]">级别</TableHead>
              <TableHead className="hidden md:table-cell w-[120px] lg:w-[150px]">
                来源
              </TableHead>
              <TableHead>消息</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="h-[calc(100vh-300px)] md:h-[400px]">
          <Virtuoso
            style={{ height: "100%" }}
            totalCount={logs.length}
            itemContent={(index) => {
              const log = logs[index];
              if (!log) return null;
              return (
                <TableRow key={log.id}>
                  <TableCell className="w-[120px] lg:w-[200px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="w-[80px] lg:w-[100px]">
                    <Badge
                      style={{ backgroundColor: logLevelColors[log.level] }}
                    >
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell w-[120px] lg:w-[150px]">
                    {log.source}
                  </TableCell>
                  <TableCell className="max-w-[200px] md:max-w-none truncate">
                    {log.message}
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </div>
      </div>
    );
  }
);

LogDisplay.displayName = "LogDisplay";