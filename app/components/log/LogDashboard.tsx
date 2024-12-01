"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Log,
  LogLevelColor,
  LogRetentionPolicy,
  LogAlertRule,
  MockModeSettings,
} from "@/types/log";
import { LogDisplay } from "./LogDisplay";
import { LogSearch } from "./LogSearch";
import { LogFilter } from "./LogFilter";
import { LogAnalysis } from "./LogAnalysis";
import { LogStats } from "./LogStats";
import { LogAggregation } from "./LogAggregation";
import { DateRangePicker } from "./DateRangePicker";
import { ExportLogs } from "./ExportLogs";
import { Settings } from "./Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateMockLogs, generateSingleMockLog } from "@/utils/mock-log-data";

// 生成默认的模拟数据
const defaultMockLogs = generateMockLogs(100);

interface LogDashboardProps {
  initialLogs?: Log[];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

export function LogDashboard({
  initialLogs = defaultMockLogs,
}: LogDashboardProps) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>(logs);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [logLevelColors, setLogLevelColors] = useState<LogLevelColor>({
    info: "#3498db",
    warning: "#f39c12",
    error: "#e74c3c",
  });
  const [retentionPolicy, setRetentionPolicy] = useState<LogRetentionPolicy>({
    days: 30,
  });
  const [alertRule, setAlertRule] = useState<LogAlertRule>({
    level: "error",
    keyword: "critical",
  });
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  const [mockMode, setMockMode] = useState<MockModeSettings>({
    enabled: true,
    logGenerationInterval: 5000,
  });
  const { toast } = useToast();

  const applyFilters = useCallback(
    (logsToFilter: Log[]) => {
      const filtered = logsToFilter.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= dateRange.from && logDate <= dateRange.to;
      });
      setFilteredLogs(filtered);
    },
    [dateRange]
  );

  const handleSearch = useCallback(
    (searchTerm: string, searchField: string) => {
      const filtered = logs.filter((log) => {
        if (searchField === "all") {
          return (
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else if (searchField === "message") {
          return log.message.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === "source") {
          return log.source.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
      applyFilters(filtered);
    },
    [logs, applyFilters]
  );

  const handleFilter = useCallback(
    (level: string) => {
      const filtered =
        level === "all" ? logs : logs.filter((log) => log.level === level);
      applyFilters(filtered);
    },
    [logs, applyFilters]
  );

  const handleDateRangeChange = useCallback(
    (range: { from: Date; to: Date }) => {
      setDateRange(range);
      applyFilters(logs);
    },
    [logs, applyFilters]
  );

  useEffect(() => {
    if (realtimeUpdates && mockMode.enabled) {
      const interval = setInterval(() => {
        const newLog = generateSingleMockLog();
        setLogs((prevLogs) => [newLog, ...prevLogs]);
      }, mockMode.logGenerationInterval);
      return () => clearInterval(interval);
    }
  }, [realtimeUpdates, mockMode]);

  useEffect(() => {
    const now = new Date();
    const retentionDate = subDays(now, retentionPolicy.days);
    setLogs((prevLogs) =>
      prevLogs.filter((log) => new Date(log.timestamp) >= retentionDate)
    );
  }, [retentionPolicy.days]);

  useEffect(() => {
    const checkAlerts = (log: Log) => {
      if (
        log.level === alertRule.level &&
        log.message.includes(alertRule.keyword)
      ) {
        toast({
          title: "日志告警",
          description: `检测到符合告警规则的日志: ${log.message}`,
        });
      }
    };
    logs.forEach(checkAlerts);
  }, [logs, alertRule, toast]);

  return (
    <div className="flex flex-col h-screen space-y-6 overflow-hidden max-h-screen">
      <div className="flex-none border-b">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
          <LogSearch onSearch={handleSearch} />
          <LogFilter onFilter={handleFilter} />
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <ExportLogs logs={filteredLogs} />
        </div>
      </div>
      <Tabs
        defaultValue="logs"
        className="flex-grow flex flex-col overflow-hidden"
      >
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full">
          <TabsTrigger value="logs">日志列表</TabsTrigger>
          <TabsTrigger value="stats">统计信息</TabsTrigger>
          <TabsTrigger value="aggregation">日志聚合</TabsTrigger>
          <TabsTrigger value="analysis">日志分析</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="flex-grow overflow-auto">
          <LogDisplay logs={filteredLogs} logLevelColors={logLevelColors} />
        </TabsContent>
        <TabsContent value="stats" className="flex-grow overflow-auto">
          <LogStats logs={filteredLogs} />
        </TabsContent>
        <TabsContent value="aggregation" className="flex-grow overflow-auto">
          <LogAggregation logs={filteredLogs} />
        </TabsContent>
        <TabsContent value="analysis" className="flex-grow overflow-auto">
          <LogAnalysis logs={filteredLogs} />
        </TabsContent>
        <TabsContent value="settings" className="flex-grow overflow-auto">
          <Settings
            logLevelColors={logLevelColors}
            setLogLevelColors={setLogLevelColors}
            retentionPolicy={retentionPolicy}
            setRetentionPolicy={setRetentionPolicy}
            alertRule={alertRule}
            setAlertRule={setAlertRule}
            realtimeUpdates={realtimeUpdates}
            setRealtimeUpdates={setRealtimeUpdates}
            mockMode={mockMode}
            setMockMode={setMockMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
