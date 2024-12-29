"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogEntry } from "@/types/log";
import {
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Radar,
} from "lucide-react";

interface LogChartProps {
  logs: LogEntry[];
  chartType?: "bar" | "pie" | "radar" | "line";
  showTrends?: boolean;
  groupBy?: "level" | "hour" | "day" | "custom";
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const groupLogsByTime = (
  logs: LogEntry[],
  timeRange: "hour" | "day" | "week" | "month"
) => {
  const now = new Date();
  const timeRangeMap = {
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  };

  const timeRangeMs = timeRangeMap[timeRange];
  const startTime = new Date(now.getTime() - timeRangeMs);

  return logs
    .filter((log) => new Date(log.timestamp) >= startTime)
    .reduce((acc: { [key: string]: number }, log) => {
      const timeKey = new Date(log.timestamp).toLocaleString();
      acc[timeKey] = (acc[timeKey] || 0) + 1;
      return acc;
    }, {});
};

export const LogChart: React.FC<LogChartProps> = ({
  logs,
  chartType: initialChartType = "bar",
  showTrends = false,
  groupBy = "level",
}) => {
  const [chartType, setChartType] = useState(initialChartType);
  const [timeRange, setTimeRange] = useState<"hour" | "day" | "week" | "month">(
    "day"
  );

  const processData = useMemo(() => {
    if (groupBy === "level") {
      const groupedData = logs.reduce((acc: { [key: string]: number }, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(groupedData).map(([name, value]) => ({
        name,
        value,
      }));
    } else {
      const timeData = groupLogsByTime(logs, timeRange);
      return Object.entries(timeData).map(([time, count]) => ({
        name: time,
        value: count,
      }));
    }
  }, [logs, groupBy, timeRange]);

  const renderBarChart = () => (
    <BarChart data={processData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <RechartsTooltip />
      <RechartsLegend />
      <Bar dataKey="value" fill="#8884d8">
        {processData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );

  const renderLineChart = () => (
    <LineChart data={processData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <RechartsTooltip />
      <RechartsLegend />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={processData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}`}
        outerRadius={80}
        dataKey="value"
      >
        {processData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <RechartsTooltip />
      <RechartsLegend />
    </PieChart>
  );

  const renderRadarChart = () => (
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      <PolarRadiusAxis />
      <RechartsRadar
        dataKey="value"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
    </RadarChart>
  );

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      case "radar":
        return renderRadarChart();
      default:
        return renderBarChart();
    }
  };

  const renderControls = () => (
    <div className="flex flex-wrap gap-2 mb-2">
      <Select
        value={chartType}
        onValueChange={(value) =>
          setChartType(value as "bar" | "pie" | "radar" | "line")
        }
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="图表类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bar">
            <BarChart2 className="w-4 h-4 mr-2" />
            柱状图
          </SelectItem>
          <SelectItem value="line">
            <LineChartIcon className="w-4 h-4 mr-2" />
            折线图
          </SelectItem>
          <SelectItem value="pie">
            <PieChartIcon className="w-4 h-4 mr-2" />
            饼图
          </SelectItem>
          <SelectItem value="radar">
            <Radar className="w-4 h-4 mr-2" />
            雷达图
          </SelectItem>
        </SelectContent>
      </Select>

      {groupBy !== "level" && (
        <Select
          value={timeRange}
          onValueChange={(value: "hour" | "day" | "week" | "month") =>
            setTimeRange(value)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">每小时</SelectItem>
            <SelectItem value="day">每天</SelectItem>
            <SelectItem value="week">每周</SelectItem>
            <SelectItem value="month">每月</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {renderControls()}
      <div className="h-[400px] w-full">
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </div>
    </div>
  );
};
