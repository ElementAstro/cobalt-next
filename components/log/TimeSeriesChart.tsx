import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
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
import { ChartWrapper } from "../chart/ChartWrapper";
import {
  CustomizationPanel,
  ChartCustomization,
} from "../chart/CustomizationPanel";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

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
  const [chartOptions, setChartOptions] = useState<ChartCustomization>({
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    showAxis: true,
    enableAnimation: true,
    dataPointSize: 4,
    lineThickness: 2,
    curveType: "monotone",
    colorScheme: "default",
    darkMode: true,
  });

  const [viewOptions, setViewOptions] = useState({
    searchBar: true,
    statusBar: true,
    toolbar: true,
    minimap: true,
    zoomControls: true,
  });

  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);

  const getTimeRangeInMs = (range: string) => {
    const units: Record<string, number> = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    return units[range] || units["24h"];
  };

  const chartData = useMemo(() => {
    const now = Date.now();
    const rangeMs = getTimeRangeInMs(timeRange);

    const filtered = logs.filter(
      (log) => now - new Date(log.timestamp).getTime() <= rangeMs
    );

    const data = filtered.reduce((acc, log) => {
      const date = new Date(log.timestamp).toLocaleString();
      if (!acc[date]) {
        acc[date] = { date, info: 0, warn: 0, error: 0 };
      }
      acc[date][log.level]++;
      return acc;
    }, {} as Record<string, { date: string; info: number; warn: number; error: number }>);

    return Object.values(data).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [logs, timeRange]);

  const handleExport = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `log-data-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    // 实现分享功能
    console.log("Share chart");
  };

  const controls = (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setZoomDomain(null)}
        disabled={!zoomDomain}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setZoomDomain([0, chartData.length / 2])}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setZoomDomain([0, chartData.length])}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );

  const customization = (
    <CustomizationPanel
      chartOptions={chartOptions}
      setChartOptions={setChartOptions}
      viewOptions={viewOptions}
      setViewOptions={setViewOptions}
      onExport={handleExport}
      onShare={handleShare}
      className="h-full"
    />
  );

  const timeRangeSelector = (
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
  );

  return (
    <ChartWrapper
      title="时序日志分析"
      controls={controls}
      customization={customization}
      darkMode={chartOptions.darkMode}
      className="min-h-[400px]"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {timeRangeSelector}
        </div>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              {chartOptions.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              {chartOptions.showAxis && (
                <>
                  <XAxis dataKey="date" />
                  <YAxis />
                </>
              )}
              {chartOptions.showTooltip && <Tooltip />}
              {chartOptions.showLegend && <Legend />}
              <Line
                type={chartOptions.curveType}
                dataKey="info"
                stroke="#8884d8"
                strokeWidth={chartOptions.lineThickness}
                dot={{ r: chartOptions.dataPointSize }}
                animationDuration={chartOptions.enableAnimation ? 1000 : 0}
              />
              <Line
                type={chartOptions.curveType}
                dataKey="warn"
                stroke="#82ca9d"
                strokeWidth={chartOptions.lineThickness}
                dot={{ r: chartOptions.dataPointSize }}
                animationDuration={chartOptions.enableAnimation ? 1000 : 0}
              />
              <Line
                type={chartOptions.curveType}
                dataKey="error"
                stroke="#ff7300"
                strokeWidth={chartOptions.lineThickness}
                dot={{ r: chartOptions.dataPointSize }}
                animationDuration={chartOptions.enableAnimation ? 1000 : 0}
              />
              {viewOptions.minimap && (
                <Brush
                  dataKey="date"
                  height={30}
                  stroke="#8884d8"
                  startIndex={zoomDomain?.[0] ?? 0}
                  endIndex={zoomDomain?.[1] ?? chartData.length - 1}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </ChartWrapper>
  );
};
