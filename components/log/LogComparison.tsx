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
} from "recharts";
import { LogEntry } from "@/types/log";

interface LogComparisonProps {
  logs: LogEntry[];
  timeRange: "1h" | "24h" | "7d";
  comparisonMode?: "period" | "custom";
  customDateRange?: [Date, Date];
}

export const LogComparison: React.FC<LogComparisonProps> = ({
  logs,
  timeRange,
  comparisonMode = "period",
  customDateRange,
}) => {
  const [showPercentages, setShowPercentages] = useState(false);
  const [includeSubcategories, setIncludeSubcategories] = useState(false);

  const now = new Date();
  const timeRangeMs = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  }[timeRange];

  const filteredLogs = logs.filter(
    (log) => now.getTime() - new Date(log.timestamp).getTime() <= timeRangeMs
  );

  const getComparisonData = () => {
    if (comparisonMode === "custom" && customDateRange) {
      return {
        current: logs.filter((log) => {
          const logTime = new Date(log.timestamp).getTime();
          return (
            logTime >= customDateRange[0].getTime() &&
            logTime <= customDateRange[1].getTime()
          );
        }),
        previous: logs.filter((log) => {
          const logTime = new Date(log.timestamp).getTime();
          const duration =
            customDateRange[1].getTime() - customDateRange[0].getTime();
          return (
            logTime >= customDateRange[0].getTime() - duration &&
            logTime <= customDateRange[0].getTime()
          );
        }),
      };
    }
    return {
      current: filteredLogs,
      previous: logs.filter((log) => {
        const logTime = new Date(log.timestamp).getTime();
        return (
          logTime > now.getTime() - 2 * timeRangeMs &&
          logTime <= now.getTime() - timeRangeMs
        );
      }),
    };
  };

  const { current, previous } = getComparisonData();

  const data = [
    { name: "Current", ...countLogLevels(current) },
    { name: "Previous", ...countLogLevels(previous) },
  ];

  const calculateMetrics = (
    currentLogs: LogEntry[],
    previousLogs: LogEntry[]
  ) => {
    const metrics = {
      logVolume: {
        current: currentLogs.length,
        previous: previousLogs.length,
        change:
          ((currentLogs.length - previousLogs.length) / previousLogs.length) *
          100,
      },
      errorRate: {
        current:
          currentLogs.filter((log) => log.level === "error").length /
          currentLogs.length,
        previous:
          previousLogs.filter((log) => log.level === "error").length /
          previousLogs.length,
        change: 0,
      },
    };
    metrics.errorRate.change =
      ((metrics.errorRate.current - metrics.errorRate.previous) /
        metrics.errorRate.previous) *
      100;
    return metrics;
  };

  const metrics = calculateMetrics(current, previous);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="info" fill="#8884d8" />
        <Bar dataKey="warn" fill="#82ca9d" />
        <Bar dataKey="error" fill="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  );
};

function countLogLevels(logs: LogEntry[]) {
  return {
    info: logs.filter((log) => log.level === "info").length,
    warn: logs.filter((log) => log.level === "warn").length,
    error: logs.filter((log) => log.level === "error").length,
  };
}
