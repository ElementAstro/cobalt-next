"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { LogChart } from "./log-chart";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DownloadIcon,
  RefreshCwIcon,
  PieChartIcon,
  BarChartIcon,
  LineChartIcon,
  RadarIcon,
  Search,
  SettingsIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";

interface LogComparisonProps {
  logs: LogEntry[];
  timeRange: "1h" | "24h" | "7d";
}

export const LogComparison: React.FC<LogComparisonProps> = ({
  logs,
  timeRange,
}) => {
  const [selectedTab, setSelectedTab] = useState<"current" | "comparison">(
    "current"
  );
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "radar">(
    "bar"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevels, setFilterLevels] = useState<{
    error: boolean;
    warn: boolean;
    info: boolean;
  }>({
    error: true,
    warn: true,
    info: true,
  });
  const [groupBy, setGroupBy] = useState<"level" | "hour" | "day">("level");

  const timeRangeMs = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  }[timeRange];

  const { current, previous, metrics } = useMemo(() => {
    const now = new Date();
    const currentLogs = logs.filter(
      (log) =>
        now.getTime() - new Date(log.timestamp).getTime() <= timeRangeMs &&
        filterLevels[log.level] &&
        log.message.includes(searchTerm)
    );
    const previousLogs = logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return (
        logTime > now.getTime() - 2 * timeRangeMs &&
        logTime <= now.getTime() - timeRangeMs &&
        filterLevels[log.level] &&
        log.message.includes(searchTerm)
      );
    });

    const metricsData = {
      total: {
        current: currentLogs.length,
        previous: previousLogs.length,
        change:
          ((currentLogs.length - previousLogs.length) /
            (previousLogs.length || 1)) *
          100,
      },
      error: {
        current: currentLogs.filter((log) => log.level === "error").length,
        previous: previousLogs.filter((log) => log.level === "error").length,
        change: 0,
      },
      warn: {
        current: currentLogs.filter((log) => log.level === "warn").length,
        previous: previousLogs.filter((log) => log.level === "warn").length,
        change: 0,
      },
      info: {
        current: currentLogs.filter((log) => log.level === "info").length,
        previous: previousLogs.filter((log) => log.level === "info").length,
        change: 0,
      },
    };

    metricsData.error.change =
      ((metricsData.error.current - metricsData.error.previous) /
        (metricsData.error.previous || 1)) *
      100;
    metricsData.warn.change =
      ((metricsData.warn.current - metricsData.warn.previous) /
        (metricsData.warn.previous || 1)) *
      100;
    metricsData.info.change =
      ((metricsData.info.current - metricsData.info.previous) /
        (metricsData.info.previous || 1)) *
      100;

    return {
      current: currentLogs,
      previous: previousLogs,
      metrics: metricsData,
    };
  }, [logs, timeRange, timeRangeMs, searchTerm, filterLevels]);

  const renderMetricCard = (
    title: string,
    value: number,
    change: number,
    icon: React.ReactNode
  ) => (
    <Card className="flex-1 min-w-[150px]">
      <CardHeader className="p-4 flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{value}</span>
          <Badge
            variant={change > 0 ? "destructive" : "default"}
            className="h-5 flex items-center"
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={chartType === type ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setChartType(type)}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {type === "bar" && "柱状图"}
          {type === "line" && "折线图"}
          {type === "pie" && "饼图"}
          {type === "radar" && "雷达图"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const handleLevelChange = (level: keyof typeof filterLevels) => {
    setFilterLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  return (
    <Card className="w-full dark:bg-gray-900/80 backdrop-blur-sm p-2">
      <CardHeader className="space-y-1 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">日志分析</CardTitle>
            <Select
              value={timeRange}
              onValueChange={(value: "1h" | "24h" | "7d") => {
                // 更新时间范围的逻辑
              }}
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
          <div className="flex items-center space-x-2">
            <Input
              placeholder="搜索日志..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <SettingsIcon className="h-4 w-4" />
            </Button>
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="error"
            checked={filterLevels.error}
            onCheckedChange={() => handleLevelChange("error")}
          />
          <Label htmlFor="error" className="flex items-center space-x-1">
            <Badge variant="destructive">E</Badge>
            <span>错误</span>
          </Label>
          <Checkbox
            id="warn"
            checked={filterLevels.warn}
            onCheckedChange={() => handleLevelChange("warn")}
          />
          <Label htmlFor="warn" className="flex items-center space-x-1">
            <Badge variant="default">W</Badge>
            <span>警告</span>
          </Label>
          <Checkbox
            id="info"
            checked={filterLevels.info}
            onCheckedChange={() => handleLevelChange("info")}
          />
          <Label htmlFor="info" className="flex items-center space-x-1">
            <Badge variant="default">I</Badge>
            <span>信息</span>
          </Label>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <AnimatePresence>
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderMetricCard(
              "总日志数",
              metrics.total.current,
              metrics.total.change,
              <Badge variant="default" className="h-5">
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              </Badge>
            )}
            {renderMetricCard(
              "错误日志",
              metrics.error.current,
              metrics.error.change,
              <Badge variant="destructive" className="h-5">
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              </Badge>
            )}
            {renderMetricCard(
              "警告日志",
              metrics.warn.current,
              metrics.warn.change,
              <Badge variant="default" className="h-5">
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              </Badge>
            )}
            {renderMetricCard(
              "信息日志",
              metrics.info.current,
              metrics.info.change,
              <Badge variant="default" className="h-5">
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              </Badge>
            )}
          </motion.div>
        </AnimatePresence>

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
            <LogChart logs={current} chartType={chartType} groupBy={groupBy} />
          </TabsContent>
          <TabsContent value="comparison" className="mt-2">
            <LogChart logs={previous} chartType={chartType} groupBy={groupBy} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
