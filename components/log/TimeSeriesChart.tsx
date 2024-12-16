import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LogEntry } from "@/types/log";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TimeSeriesChartProps {
  logs: LogEntry[];
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  logs,
  timeRange = "24h",
  onTimeRangeChange,
}) => {
  const [zoomDomain, setZoomDomain] = useState<{ x: [number, number] } | null>(
    null
  );

  const getTimeRangeInMs = (range: string) => {
    const units: Record<string, number> = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    return units[range] || units["24h"];
  };

  const filteredLogs = logs.filter((log) => {
    const now = Date.now();
    const logTime = new Date(log.timestamp).getTime();
    return now - logTime <= getTimeRangeInMs(timeRange);
  });

  const data = filteredLogs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleString();
    if (!acc[date]) {
      acc[date] = { date, info: 0, warn: 0, error: 0 };
    }
    acc[date][log.level]++;
    return acc;
  }, {} as Record<string, { date: string; info: number; warn: number; error: number }>);

  const chartData = Object.values(data).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">最近1小时</SelectItem>
            <SelectItem value="24h">最近24小时</SelectItem>
            <SelectItem value="7d">最近7天</SelectItem>
            <SelectItem value="30d">最近30天</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setZoomDomain(null)}>重置缩放</Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          onMouseDown={(e) =>
            e &&
            typeof e.activeLabel === "number" &&
            setZoomDomain({ x: [e.activeLabel, e.activeLabel] })
          }
          onMouseMove={(e) => {
            if (zoomDomain && e && typeof e.activeLabel === "number") {
              setZoomDomain({ x: [zoomDomain.x[0], e.activeLabel] });
            }
          }}
          onMouseUp={() => {
            if (zoomDomain) {
              // 实现缩放逻辑
              setZoomDomain(null);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="info" stroke="#8884d8" />
          <Line type="monotone" dataKey="warn" stroke="#82ca9d" />
          <Line type="monotone" dataKey="error" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
