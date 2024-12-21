// LogTabs.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogList from "./LogList";
import { LogChart } from "@/components/log/LogChart";
import { TimeSeriesChart } from "@/components/log/TimeSeriesChart";
import { LogComparison } from "@/components/log/LogComparison";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogStore } from "@/lib/store/log";

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
        className="flex-grow flex flex-col dark:text-gray-200 "
      >
        <TabsList className="flex justify-start px-2 py-1 bg-transparent rounded-none border-b dark:border-gray-800">
          <TabsTrigger value="logs" className="flex-1 text-center rounded-t-lg">
            日志列表
            <span className="ml-2 text-xs text-gray-500">{logs.length}</span>
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="flex-1 text-center rounded-t-lg"
          >
            统计分析
          </TabsTrigger>
          <TabsTrigger
            value="timeseries"
            className="flex-1 text-center rounded-t-lg"
          >
            时间序列
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="flex-1 text-center rounded-t-lg"
          >
            日志对比
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-y-auto px-2">
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
        </div>
      </Tabs>
    </div>
  );
};

export default LogTabs;