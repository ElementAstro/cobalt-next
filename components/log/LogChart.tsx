import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  RadarChart,
} from "recharts";
import { LogEntry } from "@/types/log";

interface LogChartProps {
  logs: LogEntry[];
  chartType?: "bar" | "pie" | "radar";
  showTrends?: boolean;
  groupBy?: "level" | "hour" | "day" | "custom";
}

export const LogChart: React.FC<LogChartProps> = ({
  logs,
  chartType = "bar",
  showTrends = false,
  groupBy = "level",
}) => {
  const [customGrouping, setCustomGrouping] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["count"]);

  const processData = () => {
    if (groupBy === "custom") {
      return customGrouping.map((group) => ({
        name: group,
        count: logs.filter((log) => log.message.includes(group)).length,
        ...(showTrends && { trend: calculateTrend(logs, group) }),
      }));
    }
    // ...existing grouping logic
  };

  const calculateTrend = (logs: LogEntry[], group: string) => {
    // Example trend calculation logic
    const trendData = logs.filter((log) => log.message.includes(group));
    return trendData.length; // Replace with actual trend calculation
  };

  const renderChart = () => {
    switch (chartType) {
      case "pie":
        return <PieChart data={processData()} />;
      case "radar":
        return <RadarChart data={processData()} />;
      default:
        return <BarChart data={processData()} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">{/* 添加控制选项 */}</div>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
