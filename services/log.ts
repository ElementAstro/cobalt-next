import { LogEntry } from "@/types/log";
import { useLogStore } from "@/lib/store/log";

export class LogService {
  private static instance: LogService;
  private ws: WebSocket | null = null;
  private logBuffer: LogEntry[] = [];
  private readonly bufferSize = 1000;

  private constructor() {
    // 私有构造函数
  }

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  // WebSocket 连接管理
  public connectWebSocket(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => resolve();
        this.ws.onerror = (error) => reject(error);

        // 添加消息处理
        this.ws.onmessage = (event) => {
          const logEntry = JSON.parse(event.data) as LogEntry;
          this.addToBuffer(logEntry);

          // 同步到 store
          const store = useLogStore.getState();
          store.setLogs([...store.logs, logEntry]);

          // 如果启用了实时模式，也更新过滤后的日志
          if (store.isRealTimeEnabled) {
            store.setFilteredLogs([...store.filteredLogs, logEntry]);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // 日志获取
  public async fetchLogs(params: {
    startTime?: Date;
    endTime?: Date;
    level?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ logs: LogEntry[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params.startTime)
      queryParams.set("startTime", params.startTime.toISOString());
    if (params.endTime)
      queryParams.set("endTime", params.endTime.toISOString());
    if (params.level) queryParams.set("level", params.level);
    if (params.search) queryParams.set("search", params.search);
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.pageSize)
      queryParams.set("pageSize", params.pageSize.toString());

    const response = await fetch(`/api/logs?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch logs");
    }
    const data = await response.json();

    // 同步到 store
    const store = useLogStore.getState();
    store.setLogs(data.logs);
    store.setFilteredLogs(
      this.filterLogs(data.logs, {
        level: store.logLevel,
        search: store.search,
      })
    );

    return data;
  }

  // 日志过滤
  public filterLogs(
    logs: LogEntry[],
    filters: {
      level?: string;
      search?: string;
      startTime?: Date;
      endTime?: Date;
    }
  ): LogEntry[] {
    return logs.filter((log) => {
      if (
        filters.level &&
        filters.level !== "all" &&
        log.level !== filters.level
      ) {
        return false;
      }
      if (filters.search && !this.matchSearch(log, filters.search)) {
        return false;
      }
      if (filters.startTime && new Date(log.timestamp) < filters.startTime) {
        return false;
      }
      if (filters.endTime && new Date(log.timestamp) > filters.endTime) {
        return false;
      }
      return true;
    });
  }

  // 日志导出
  public async exportLogs(
    logs: LogEntry[],
    format: "json" | "csv"
  ): Promise<Blob> {
    if (format === "json") {
      const data = JSON.stringify(logs, null, 2);
      return new Blob([data], { type: "application/json" });
    } else {
      const header = "Timestamp,Level,Message\n";
      const rows = logs
        .map(
          (log) =>
            `${log.timestamp},${log.level},${log.message.replace(/,/g, ";")}`
        )
        .join("\n");
      return new Blob([header + rows], { type: "text/csv" });
    }
  }

  // 日志聚合
  public aggregateLogs(
    logs: LogEntry[],
    groupBy: "hour" | "day" | "level"
  ): Record<string, number> {
    return logs.reduce((acc, log) => {
      let key: string;
      if (groupBy === "level") {
        key = log.level;
      } else {
        const date = new Date(log.timestamp);
        key =
          groupBy === "hour"
            ? date.toISOString().slice(0, 13)
            : date.toISOString().slice(0, 10);
      }
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // 日志缓存管理
  public addToBuffer(log: LogEntry): void {
    this.logBuffer.push(log);
    if (this.logBuffer.length > this.bufferSize) {
      this.logBuffer.shift();
    }
  }

  public getBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  public clearBuffer(): void {
    this.logBuffer = [];
  }

  // 辅助函数
  private matchSearch(log: LogEntry, search: string): boolean {
    const searchLower = search.toLowerCase();
    return (
      log.message.toLowerCase().includes(searchLower) ||
      log.level.toLowerCase().includes(searchLower)
    );
  }

  // 日志分析
  public analyzeLogTrends(
    logs: LogEntry[],
    timeRange: "1h" | "24h" | "7d"
  ): {
    errorRate: number;
    warningRate: number;
    avgLogsPerHour: number;
    peakTime: string;
  } {
    const now = new Date();
    const timeRangeMs = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    }[timeRange];

    const filteredLogs = logs.filter(
      (log) => now.getTime() - new Date(log.timestamp).getTime() <= timeRangeMs
    );

    const errorCount = filteredLogs.filter(
      (log) => log.level === "error"
    ).length;
    const warningCount = filteredLogs.filter(
      (log) => log.level === "warn"
    ).length;
    const totalCount = filteredLogs.length;

    // 按小时分组统计日志数量
    const hourlyGroups = this.aggregateLogs(filteredLogs, "hour");
    const peakTime =
      Object.entries(hourlyGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    return {
      errorRate: totalCount ? (errorCount / totalCount) * 100 : 0,
      warningRate: totalCount ? (warningCount / totalCount) * 100 : 0,
      avgLogsPerHour: totalCount / (timeRangeMs / (60 * 60 * 1000)),
      peakTime,
    };
  }

  // 日志持久化
  public async persistLogs(logs: LogEntry[]): Promise<void> {
    try {
      await localStorage.setItem("logs_cache", JSON.stringify(logs));
    } catch (error) {
      console.error("Failed to persist logs:", error);
    }
  }

  public async loadPersistedLogs(): Promise<LogEntry[]> {
    try {
      const cached = await localStorage.getItem("logs_cache");
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error("Failed to load persisted logs:", error);
      return [];
    }
  }

  // 模拟数据生成（用于开发和测试）
  public generateMockLogs(count: number): LogEntry[] {
    const levels = ["info", "warn", "error"];
    const messages = [
      "应用程序启动",
      "数据库连接成功",
      "用户认证失败",
      "内存使用率超过阈值",
      "API请求超时",
      "文件上传完成",
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(
        Date.now() - Math.random() * 86400000 * 7
      ).toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)] as
        | "info"
        | "warn"
        | "error",
      message: messages[Math.floor(Math.random() * messages.length)],
      metadata: {
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        requestId: `req_${Math.floor(Math.random() * 1000)}`,
      },
    }));
  }
}

export const logService = LogService.getInstance();
