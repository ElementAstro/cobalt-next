import { faker } from "@faker-js/faker";
import { LogEntry } from "@/types/log";
import { LogResponse } from "../api/log";

// 生成随机日志等级
const generateLogLevel = () =>
  faker.helpers.arrayElement(["info", "warn", "error"] as const);

// 生成随机日志条目
const generateLogEntry = (overrides?: Partial<LogEntry>): LogEntry => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  timestamp: faker.date.recent().toISOString(),
  level: generateLogLevel(),
  message: faker.lorem.sentence(),
  tags: faker.helpers.arrayElements(
    ["system", "user", "performance", "security", "error"],
    { min: 0, max: 3 }
  ),
  note: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
  source: faker.helpers.arrayElement([
    "app.js",
    "server.js",
    "database.js",
    "api.js",
  ]),
  user: faker.datatype.boolean() ? faker.internet.userName() : undefined,
  sessionId: faker.datatype.boolean() ? faker.string.uuid() : undefined,
  ...overrides,
});

export const mockLogApi = {
  // 获取日志列表
  getLogs: async (params?: {
    level?: string;
    startTime?: string;
    endTime?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<LogResponse<LogEntry[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let logs = Array(params?.pageSize || 100)
      .fill(null)
      .map(() => generateLogEntry());

    // 应用过滤条件
    if (params?.level) {
      logs = logs.filter((log) => log.level === params.level);
    }

    if (params?.search) {
      logs = logs.filter((log) =>
        log.message.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    if (params?.startTime) {
      logs = logs.filter(
        (log) => new Date(log.timestamp) >= new Date(params.startTime!)
      );
    }

    if (params?.endTime) {
      logs = logs.filter(
        (log) => new Date(log.timestamp) <= new Date(params.endTime!)
      );
    }

    return {
      data: logs,
      message: "Logs retrieved successfully",
      status: "success",
    };
  },

  // 获取单条日志详情
  getLogDetail: async (id: number): Promise<LogResponse<LogEntry>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      data: generateLogEntry({ id }),
      message: "Log detail retrieved successfully",
      status: "success",
    };
  },

  // 添加日志注释
  addNote: async (id: number, note: string): Promise<LogResponse<LogEntry>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: generateLogEntry({ id, note }),
      message: "Note added successfully",
      status: "success",
    };
  },

  // 添加日志标签
  addTag: async (id: number, tag: string): Promise<LogResponse<LogEntry>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const entry = generateLogEntry({ id });
    entry.tags = [...(entry.tags || []), tag];

    return {
      data: entry,
      message: "Tag added successfully",
      status: "success",
    };
  },

  // 删除日志标签
  removeTag: async (id: number, tag: string): Promise<LogResponse<void>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: undefined,
      message: "Tag removed successfully",
      status: "success",
    };
  },

  // 获取日志统计信息
  getStats: async (
    timeRange: string
  ): Promise<
    LogResponse<{
      total: number;
      byLevel: Record<string, number>;
      byTime: { timestamp: string; count: number }[];
    }>
  > => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      data: {
        total: faker.number.int({ min: 1000, max: 10000 }),
        byLevel: {
          info: faker.number.int({ min: 500, max: 5000 }),
          warn: faker.number.int({ min: 100, max: 1000 }),
          error: faker.number.int({ min: 10, max: 100 }),
        },
        byTime: Array(24)
          .fill(null)
          .map((_, i) => ({
            timestamp: new Date(
              new Date().setHours(new Date().getHours() - 23 + i)
            ).toISOString(),
            count: faker.number.int({ min: 10, max: 200 }),
          })),
      },
      message: "Statistics retrieved successfully",
      status: "success",
    };
  },

  // 导出日志
  exportLogs: async (
    format: "json" | "csv",
    params?: {
      level?: string;
      startTime?: string;
      endTime?: string;
      search?: string;
    }
  ): Promise<LogResponse<Blob>> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const logs = Array(100)
      .fill(null)
      .map(() => generateLogEntry());
    const content =
      format === "json"
        ? JSON.stringify(logs, null, 2)
        : "id,timestamp,level,message\n" +
          logs
            .map(
              (log) => `${log.id},${log.timestamp},${log.level},${log.message}`
            )
            .join("\n");

    return {
      data: new Blob([content], {
        type: format === "json" ? "application/json" : "text/csv",
      }),
      message: "Logs exported successfully",
      status: "success",
    };
  },

  // 清理日志
  clearLogs: async (params: {
    before?: string;
    level?: string;
  }): Promise<LogResponse<void>> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      data: undefined,
      message: "Logs cleared successfully",
      status: "success",
    };
  },
};
