import { LogEntry } from "@/types/log";
import api from "../axios";

export interface LogResponse<T> {
  data: T;
  message: string;
  status: "success" | "error";
}

export const logApi = {
  // 获取日志列表
  getLogs: (params?: {
    level?: string;
    startTime?: string;
    endTime?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) =>
    api.request<LogResponse<LogEntry[]>>({
      url: "/logs",
      method: "GET",
      params,
    }),

  // 获取单条日志详情
  getLogDetail: (id: number) =>
    api.request<LogResponse<LogEntry>>({
      url: `/logs/${id}`,
      method: "GET",
    }),

  // 添加日志注释
  addNote: (id: number, note: string) =>
    api.request<LogResponse<LogEntry>>({
      url: `/logs/${id}/note`,
      method: "POST",
      data: { note },
    }),

  // 添加日志标签
  addTag: (id: number, tag: string) =>
    api.request<LogResponse<LogEntry>>({
      url: `/logs/${id}/tags`,
      method: "POST",
      data: { tag },
    }),

  // 删除日志标签
  removeTag: (id: number, tag: string) =>
    api.request<LogResponse<void>>({
      url: `/logs/${id}/tags/${encodeURIComponent(tag)}`,
      method: "DELETE",
    }),

  // 获取日志统计信息
  getStats: (timeRange: string) =>
    api.request<
      LogResponse<{
        total: number;
        byLevel: Record<string, number>;
        byTime: { timestamp: string; count: number }[];
      }>
    >({
      url: "/logs/stats",
      method: "GET",
      params: { timeRange },
    }),

  // 导出日志
  exportLogs: (
    format: "json" | "csv",
    params?: {
      level?: string;
      startTime?: string;
      endTime?: string;
      search?: string;
    }
  ) =>
    api.request<LogResponse<Blob>>({
      url: "/logs/export",
      method: "GET",
      params: { format, ...params },
      responseType: "blob",
    }),

  // 清理日志
  clearLogs: (params: { before?: string; level?: string }) =>
    api.request<LogResponse<void>>({
      url: "/logs",
      method: "DELETE",
      params,
    }),
};
