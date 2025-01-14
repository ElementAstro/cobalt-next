"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isChartLoading, setIsChartLoading] = useState(false);
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
  ) => {
    const controls = useAnimationControls();
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Simulate loading state when value changes
    useEffect(() => {
      if (value !== undefined) {
        setIsLoading(true);
        const timeout = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timeout);
      }
    }, [value]);

    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => {
          controls.start({ y: -5 });
          setIsHovered(true);
        }}
        onHoverEnd={() => {
          controls.start({ y: 0 });
          setIsHovered(false);
        }}
      >
        <Card className="flex-1 min-w-[150px] hover:shadow-lg transition-shadow relative overflow-hidden group">
          {/* Background animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0"
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? "0%" : "-100%",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer effect */}
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Content */}
          <CardHeader className="p-4 flex items-center justify-between relative z-10">
            <motion.div className="flex items-center gap-2" animate={controls}>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {icon}
              </motion.div>
            </motion.div>
          </CardHeader>

          <CardContent className="p-4 pt-0 relative z-10">
            <div className="flex items-center space-x-2">
              {isLoading || value === undefined ? (
                <div className="relative overflow-hidden">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              ) : (
                <motion.span
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {value}
                </motion.span>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge
                  variant={change > 0 ? "destructive" : "default"}
                  className="h-5 flex items-center relative overflow-hidden"
                >
                  {change > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </Badge>
              </motion.div>
            </div>
          </CardContent>

          {/* Hover border animation */}
          <motion.div
            className="absolute inset-0 border border-primary/10 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </Card>
      </motion.div>
    );
  };

  const renderChartTypeButton = (
    type: typeof chartType,
    icon: React.ReactNode
  ) => {
    const controls = useAnimationControls();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLoadingLocal, setIsLoadingLocal] = useState(false);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => {
                setIsHovered(true);
                controls.start({ rotate: 10 });
              }}
              onHoverEnd={() => {
                setIsHovered(false);
                controls.start({ rotate: 0 });
              }}
            >
              <Button
                variant={chartType === type ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0 relative overflow-hidden"
                onClick={async () => {
                  setIsActive(true);
                  setIsLoadingLocal(true);
                  setIsChartLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 200));
                  setChartType(type);
                  setIsLoadingLocal(false);
                  setIsChartLoading(false);
                  setIsActive(false);
                }}
                disabled={isChartLoading}
              >
                {/* Background pulse effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {/* Hover gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0"
                  animate={{
                    x: isHovered ? "0%" : "-100%",
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />

                {/* Loading spinner */}
                {(isChartLoading || isLoadingLocal) && chartType === type ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={controls}
                    className="relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    {icon}
                  </motion.div>
                )}

                {/* Active indicator */}
                {chartType === type && !isChartLoading && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4 bg-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}

                {/* Click ripple effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {/* Hover border */}
                <motion.div
                  className="absolute inset-0 border border-primary/10 rounded-full opacity-0"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {type === "bar" && "柱状图"}
              {type === "line" && "折线图"}
              {type === "pie" && "饼图"}
              {type === "radar" && "雷达图"}
            </motion.div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

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
            <div className="relative w-48">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Input
                  placeholder="搜索日志..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8 hover:shadow-sm transition-shadow"
                />
                {/* Search icon with animated transitions */}
                <motion.div
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  animate={{
                    opacity: searchTerm ? 1 : 0.5,
                    scale: searchTerm ? 1 : 0.9,
                    rotate: searchTerm ? 0 : 360,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Search className="h-4 w-4" />
                </motion.div>

                {/* Active search effects */}
                {searchTerm && (
                  <>
                    {/* Background shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Bottom border animation */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />

                    {/* Floating particles */}
                    <motion.div
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-primary/20 rounded-full"
                          initial={{
                            x: Math.random() * 100 - 50,
                            y: Math.random() * 20 - 10,
                            scale: 0,
                          }}
                          animate={{
                            x: ["0%", "100%"],
                            y: [0, Math.random() * 20 - 10],
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2 + Math.random(),
                            delay: Math.random(),
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  </>
                )}

                {/* Hover background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0"
                  animate={{
                    opacity: searchTerm ? 0.3 : 0,
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Focus ring */}
                <motion.div
                  className="absolute inset-0 rounded-md border-2 border-primary/20 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: searchTerm ? 1 : 0,
                    scale: searchTerm ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </div>
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
          <TabsList className="w-full justify-start h-9 bg-muted/50 relative overflow-hidden">
            {/* Shimmer background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Tab indicator */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
              layoutId="tabIndicator"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
              {/* Indicator shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Tabs */}
            <TabsTrigger
              value="current"
              className="text-sm relative z-10 hover:bg-primary/10 transition-colors"
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                当前时段
                {/* Hover underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="text-sm relative z-10 hover:bg-primary/10 transition-colors"
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                时段对比
                {/* Hover underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="current" className="mt-2">
                <LogChart
                  logs={current}
                  chartType={chartType}
                  groupBy={groupBy}
                />
              </TabsContent>
              <TabsContent value="comparison" className="mt-2">
                <LogChart
                  logs={previous}
                  chartType={chartType}
                  groupBy={groupBy}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};
