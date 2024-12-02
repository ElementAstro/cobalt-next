"use client";

import { useState, useCallback, useEffect, useReducer } from "react";
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
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultMockLogs = generateMockLogs(100);

interface LogDashboardProps {
  initialLogs?: Log[];
}

type State = {
  logs: Log[];
  filteredLogs: Log[];
  dateRange: { from: Date; to: Date };
  logLevelColors: LogLevelColor;
  retentionPolicy: LogRetentionPolicy;
  alertRule: LogAlertRule;
  realtimeUpdates: boolean;
  mockMode: MockModeSettings;
  searchTerm: string;
  searchField: string;
  filterLevel: string;
  theme: "light" | "dark";
};

type Action =
  | { type: "SET_LOGS"; payload: Log[] }
  | { type: "ADD_LOG"; payload: Log }
  | { type: "SET_DATE_RANGE"; payload: { from: Date; to: Date } }
  | { type: "SET_FILTER"; payload: { level: string } }
  | { type: "SET_SEARCH"; payload: { term: string; field: string } }
  | { type: "SET_LOG_LEVEL_COLORS"; payload: LogLevelColor }
  | { type: "SET_RETENTION_POLICY"; payload: LogRetentionPolicy }
  | { type: "SET_ALERT_RULE"; payload: LogAlertRule }
  | { type: "SET_REALTIME_UPDATES"; payload: boolean }
  | { type: "SET_MOCK_MODE"; payload: MockModeSettings }
  | { type: "SET_THEME"; payload: "light" | "dark" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOGS":
      return { ...state, logs: action.payload };
    case "ADD_LOG":
      return { ...state, logs: [action.payload, ...state.logs] };
    case "SET_DATE_RANGE":
      return { ...state, dateRange: action.payload };
    case "SET_FILTER":
      return { ...state, filterLevel: action.payload.level };
    case "SET_SEARCH":
      return {
        ...state,
        searchTerm: action.payload.term,
        searchField: action.payload.field,
      };
    case "SET_LOG_LEVEL_COLORS":
      return { ...state, logLevelColors: action.payload };
    case "SET_RETENTION_POLICY":
      return { ...state, retentionPolicy: action.payload };
    case "SET_ALERT_RULE":
      return { ...state, alertRule: action.payload };
    case "SET_REALTIME_UPDATES":
      return { ...state, realtimeUpdates: action.payload };
    case "SET_MOCK_MODE":
      return { ...state, mockMode: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(reducer, {
    logs: initialLogs,
    filteredLogs: initialLogs,
    dateRange: { from: subDays(new Date(), 7), to: new Date() },
    logLevelColors: {
      info: "#3498db",
      warning: "#f39c12",
      error: "#e74c3c",
    },
    retentionPolicy: { days: 30 },
    alertRule: { level: "error", keyword: "critical" },
    realtimeUpdates: true,
    mockMode: { enabled: true, logGenerationInterval: 5000 },
    searchTerm: "",
    searchField: "all",
    filterLevel: "all",
    theme: "light",
  });

  const { toast } = useToast();

  const applyFilters = useCallback(() => {
    let filtered = state.logs;

    // 日期过滤
    filtered = filtered.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= state.dateRange.from && logDate <= state.dateRange.to;
    });

    // 日志级别过滤
    if (state.filterLevel !== "all") {
      filtered = filtered.filter((log) => log.level === state.filterLevel);
    }

    // 搜索过滤
    if (state.searchTerm) {
      filtered = filtered.filter((log) => {
        if (state.searchField === "all") {
          return (
            log.message
              .toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(state.searchTerm.toLowerCase())
          );
        } else if (state.searchField === "message") {
          return log.message
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase());
        } else if (state.searchField === "source") {
          return log.source
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase());
        }
        return false;
      });
    }

    dispatch({ type: "SET_LOGS", payload: state.logs });
    dispatch({ type: "SET_LOGS", payload: filtered });
  }, [
    state.logs,
    state.dateRange,
    state.filterLevel,
    state.searchTerm,
    state.searchField,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, state.logs, state.dateRange, state.filterLevel, state.searchTerm, state.searchField]);

  useEffect(() => {
    if (state.realtimeUpdates && state.mockMode.enabled) {
      const interval = setInterval(() => {
        const newLog = generateSingleMockLog();
        dispatch({ type: "ADD_LOG", payload: newLog });
      }, state.mockMode.logGenerationInterval);
      return () => clearInterval(interval);
    }
  }, [state.realtimeUpdates, state.mockMode.enabled, state.mockMode.logGenerationInterval]);

  useEffect(() => {
    const now = new Date();
    const retentionDate = subDays(now, state.retentionPolicy.days);
    const freshLogs = state.logs.filter(
      (log) => new Date(log.timestamp) >= retentionDate
    );
    dispatch({ type: "SET_LOGS", payload: freshLogs });
  }, [state.retentionPolicy.days, state.logs]);

  useEffect(() => {
    const latestLog = state.logs[0];
    if (latestLog) {
      if (
        latestLog.level === state.alertRule.level &&
        latestLog.message.includes(state.alertRule.keyword)
      ) {
        toast({
          title: "日志告警",
          description: `检测到符合告警规则的日志: ${latestLog.message}`,
        });
      }
    }
  }, [state.logs, state.alertRule.level, state.alertRule.keyword, toast]);

  const handleSearch = (term: string, field: string) => {
    dispatch({ type: "SET_SEARCH", payload: { term, field } });
  };

  const handleFilter = (level: string) => {
    dispatch({ type: "SET_FILTER", payload: { level } });
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    dispatch({ type: "SET_DATE_RANGE", payload: range });
  };

  const toggleTheme = () => {
    dispatch({
      type: "SET_THEME",
      payload: state.theme === "light" ? "dark" : "light",
    });
  };

  return (
    <div
      className={`flex flex-col h-screen space-y-4 overflow-hidden max-h-screen ${state.theme}`}
    >
      <div className="flex-none border-b bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto p-4 gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={toggleTheme}>
              {state.theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <LogSearch onSearch={handleSearch} />
          </div>
          <LogFilter onFilter={handleFilter} />
          <DateRangePicker
            dateRange={state.dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <ExportLogs logs={state.filteredLogs} />
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
          <LogDisplay
            logs={state.filteredLogs}
            logLevelColors={state.logLevelColors}
          />
        </TabsContent>
        <TabsContent value="stats" className="flex-grow overflow-auto">
          <LogStats logs={state.filteredLogs} />
        </TabsContent>
        <TabsContent value="aggregation" className="flex-grow overflow-auto">
          <LogAggregation logs={state.filteredLogs} />
        </TabsContent>
        <TabsContent value="analysis" className="flex-grow overflow-auto">
          <LogAnalysis logs={state.filteredLogs} />
        </TabsContent>
        <TabsContent value="settings" className="flex-grow overflow-auto">
          <Settings
            logLevelColors={state.logLevelColors}
            setLogLevelColors={(colors) =>
              dispatch({ type: "SET_LOG_LEVEL_COLORS", payload: colors })
            }
            retentionPolicy={state.retentionPolicy}
            setRetentionPolicy={(policy) =>
              dispatch({ type: "SET_RETENTION_POLICY", payload: policy })
            }
            alertRule={state.alertRule}
            setAlertRule={(rule) =>
              dispatch({ type: "SET_ALERT_RULE", payload: rule })
            }
            realtimeUpdates={state.realtimeUpdates}
            setRealtimeUpdates={(value) =>
              dispatch({ type: "SET_REALTIME_UPDATES", payload: value })
            }
            mockMode={state.mockMode}
            setMockMode={(mode) =>
              dispatch({ type: "SET_MOCK_MODE", payload: mode })
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
