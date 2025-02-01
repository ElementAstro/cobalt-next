"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogList from "./log-list";
import { LogChart } from "@/components/log/log-chart";
import { TimeSeriesChart } from "@/components/log/time-series-chart";
import { LogComparison } from "@/components/log/log-comparison";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogStore } from "@/store/useLogStore";
import { motion, AnimatePresence } from "framer-motion";

const LogTabs: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    logs,
    comparisonTimeRange,
    setComparisonTimeRange,
  } = useLogStore();

  return (
    <div className="flex flex-col h-full overflow-hidden dark:bg-gray-900">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-grow flex flex-col dark:text-gray-200"
      >
        <motion.div
          className="border-b dark:border-gray-800 flex-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TabsList className="h-8 w-full grid grid-cols-4 gap-1 bg-transparent p-0">
            <TabsTrigger value="logs" className="text-xs sm:text-sm">
              日志列表
              <span className="ml-1 text-xs text-gray-500 hidden sm:inline">
                {logs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs sm:text-sm">
              统计分析
            </TabsTrigger>
            <TabsTrigger value="timeseries" className="text-xs sm:text-sm">
              时间序列
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs sm:text-sm">
              日志对比
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            className="flex-1 overflow-y-auto px-2"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="logs" className="flex-grow">
              <LogList />
            </TabsContent>
            <TabsContent value="analysis" className="flex-grow p-2">
              <LogChart logs={logs} />
            </TabsContent>
            <TabsContent value="timeseries" className="flex-grow p-2">
              <TimeSeriesChart logs={logs} />
            </TabsContent>
            <TabsContent value="comparison" className="flex-grow p-2">
              <div className="">
                <Select
                  value={comparisonTimeRange}
                  onValueChange={(value: "1h" | "24h" | "7d") =>
                    setComparisonTimeRange(value)
                  }
                >
                  <SelectTrigger className="w-[150px] dark:bg-gray-700 dark:text-gray-200">
                    <SelectValue placeholder="时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">最近1小时</SelectItem>
                    <SelectItem value="24h">最近24小时</SelectItem>
                    <SelectItem value="7d">最近7天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <LogComparison logs={logs} timeRange={comparisonTimeRange} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default LogTabs;
