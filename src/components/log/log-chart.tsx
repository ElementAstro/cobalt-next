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
import saveAs from "file-saver";

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
    <LineChart
      data={processData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
      <XAxis
        dataKey="name"
        tick={{ fill: "#666", fontSize: 12 }}
        interval="preserveStartEnd"
      />
      <YAxis tick={{ fill: "#666", fontSize: 12 }} allowDecimals={false} />
      <RechartsTooltip
        contentStyle={{
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        formatter={(value) => [value, "Count"]}
        labelFormatter={(label) => `Time: ${label}`}
      />
      <RechartsLegend
        wrapperStyle={{ paddingTop: 20 }}
        formatter={(value) => <span style={{ color: "#666" }}>{value}</span>}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        strokeWidth={3}
        dot={{
          stroke: "#8884d8",
          strokeWidth: 2,
          fill: "#fff",
          r: 5,
        }}
        activeDot={{
          r: 8,
          stroke: "#fff",
          strokeWidth: 2,
          fill: "#8884d8",
        }}
        animationDuration={800}
        animationEasing="ease-in-out"
        isAnimationActive={true}
      />
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
        innerRadius={40}
        paddingAngle={2}
        dataKey="value"
        animationDuration={800}
        animationEasing="ease-in-out"
        isAnimationActive={true}
      >
        {processData.map((entry, index) => {
          const gradientId = `pieGradient${index}`;
          return (
            <>
              <defs key={gradientId}>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={gradientId[index % gradientId.length]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradientId[index % gradientId.length]}
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <Cell
                key={`cell-${index}`}
                fill={`url(#${gradientId})`}
                stroke="#fff"
                strokeWidth={2}
              />
            </>
          );
        })}
      </Pie>
      <RechartsTooltip
        contentStyle={{
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        formatter={(value) => [value, "Count"]}
        labelFormatter={(label) => `Category: ${label}`}
      />
      <RechartsLegend
        wrapperStyle={{ paddingTop: 20 }}
        formatter={(value) => <span style={{ color: "#666" }}>{value}</span>}
      />
    </PieChart>
  );

  const renderRadarChart = () => (
    <RadarChart
      cx="50%"
      cy="50%"
      outerRadius="80%"
      data={processData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <PolarGrid strokeOpacity={0.2} />
      <PolarAngleAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} />
      <PolarRadiusAxis tick={{ fill: "#666", fontSize: 12 }} angle={30} />
      <RechartsRadar
        dataKey="value"
        stroke="#8884d8"
        strokeWidth={2}
        fill="url(#radarGradient)"
        fillOpacity={0.6}
        animationDuration={800}
        animationEasing="ease-in-out"
        isAnimationActive={true}
      />
      <defs>
        <radialGradient
          id="radarGradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#82ca9d" stopOpacity={0.4} />
        </radialGradient>
      </defs>
      <RechartsTooltip
        contentStyle={{
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        formatter={(value) => [value, "Count"]}
        labelFormatter={(label) => `Category: ${label}`}
      />
      <RechartsLegend
        wrapperStyle={{ paddingTop: 20 }}
        formatter={(value) => <span style={{ color: "#666" }}>{value}</span>}
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

  const handleExport = () => {
    const svg = document.querySelector(".recharts-surface") as SVGElement;
    if (svg) {
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      saveAs(blob, `log-chart-${new Date().toISOString()}.svg`);
    }
  };

  return (
    <div className="space-y-2">
      {renderControls()}
      <div className="h-[400px] w-full relative">
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        <button
          onClick={handleExport}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-white transition-colors border border-gray-200"
        >
          Export Chart
        </button>
      </div>
    </div>
  );
};
