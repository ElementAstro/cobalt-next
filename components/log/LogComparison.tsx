import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogEntry } from "@/types/log";
import { LogChart } from "./LogChart";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DownloadIcon,
  RefreshCwIcon,
  PieChartIcon,
  BarChartIcon,
  LineChartIcon,
  RadarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedTab, setSelectedTab] = useState<"current" | "comparison">(
    "current"
  );
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "radar">(
    "bar"
  );
  const [showTrends, setShowTrends] = useState(false);
  const [groupBy, setGroupBy] = useState<"level" | "hour" | "day">("level");

  const timeRangeMs = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  }[timeRange];

  const { current, previous, metrics } = useMemo(() => {
    const now = new Date();
    const current = logs.filter(
      (log) => now.getTime() - new Date(log.timestamp).getTime() <= timeRangeMs
    );
    const previous = logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return (
        logTime > now.getTime() - 2 * timeRangeMs &&
        logTime <= now.getTime() - timeRangeMs
      );
    });

    const metrics = {
      total: {
        current: current.length,
        previous: previous.length,
        change:
          ((current.length - previous.length) / (previous.length || 1)) * 100,
      },
      error: {
        current: current.filter((log) => log.level === "error").length,
        previous: previous.filter((log) => log.level === "error").length,
        change: 0,
      },
      warn: {
        current: current.filter((log) => log.level === "warn").length,
        previous: previous.filter((log) => log.level === "warn").length,
        change: 0,
      },
    };

    metrics.error.change =
      ((metrics.error.current - metrics.error.previous) /
        (metrics.error.previous || 1)) *
      100;
    metrics.warn.change =
      ((metrics.warn.current - metrics.warn.previous) /
        (metrics.warn.previous || 1)) *
      100;

    return { current, previous, metrics };
  }, [logs, timeRange, timeRangeMs]);

  const renderMetricCard = (title: string, value: number, change: number) => (
    <Card className="flex-1 min-w-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{value}</span>
          <Badge
            variant={change > 0 ? "destructive" : "default"}
            className="h-5"
          >
            {change > 0 ? (
              <ArrowUpIcon className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownIcon className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change).toFixed(1)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const renderChartTypeButton = (
    type: typeof chartType,
    icon: React.ReactNode
  ) => (
    <Button
      variant={chartType === type ? "default" : "outline"}
      size="sm"
      className="w-8 h-8 p-0"
      onClick={() => setChartType(type)}
    >
      {icon}
    </Button>
  );

  return (
    <Card className="w-full dark:bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">日志分析</CardTitle>
            <Select
              value={timeRange}
              onValueChange={(value: "1h" | "24h" | "7d") => {}}
            >
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue placeholder="时间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1小时</SelectItem>
                <SelectItem value="24h">24小时</SelectItem>
                <SelectItem value="7d">7天</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
              {renderChartTypeButton(
                "bar",
                <BarChartIcon className="h-4 w-4" />
              )}
              {renderChartTypeButton(
                "line",
                <LineChartIcon className="h-4 w-4" />
              )}
              {renderChartTypeButton(
                "pie",
                <PieChartIcon className="h-4 w-4" />
              )}
              {renderChartTypeButton(
                "radar",
                <RadarIcon className="h-4 w-4" />
              )}
            </div>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {renderMetricCard(
            "总日志数",
            metrics.total.current,
            metrics.total.change
          )}
          {renderMetricCard(
            "错误日志",
            metrics.error.current,
            metrics.error.change
          )}
          {renderMetricCard(
            "警告日志",
            metrics.warn.current,
            metrics.warn.change
          )}
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as "current" | "comparison")}
          className="w-full"
        >
          <TabsList className="w-full justify-start h-9 bg-muted/50">
            <TabsTrigger value="current" className="text-sm">
              当前时段
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-sm">
              时段对比
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="mt-2">
            <LogChart
              logs={current}
              chartType={chartType}
              showTrends={showTrends}
              groupBy={groupBy}
            />
          </TabsContent>
          <TabsContent value="comparison" className="mt-2">
            <LogChart
              logs={previous}
              chartType={chartType}
              showTrends={showTrends}
              groupBy={groupBy}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
