import { LogEntry } from "@/types/log";
import { z } from "zod";
import * as yaml from "yaml";
import logger from "@/utils/logger";

// 日志数据验证schema
const logSchema = z.object({
  id: z.number(),
  timestamp: z.string(),
  level: z.enum(["info", "warn", "error"]),
  message: z.string(),
  source: z.string().optional(),
  details: z.record(z.any()).optional(),
});

const logsArraySchema = z.array(logSchema);

export async function uploadLogs(file: File): Promise<LogEntry[]> {
  try {
    // 1. 验证文件类型
    if (!file.name.match(/\.(json|csv|xml|yaml|yml)$/)) {
      throw new Error(
        "不支持的文件格式。请上传 .json, .csv, .xml, .yaml 或 .yml 文件"
      );
    }

    const fileContent = await file.text();
    let parsedLogs: LogEntry[];

    // 2. 根据文件类型解析内容
    if (file.name.endsWith(".json")) {
      parsedLogs = await parseJsonLogs(fileContent);
    } else if (file.name.endsWith(".csv")) {
      parsedLogs = await parseCsvLogs(fileContent);
    } else if (file.name.match(/\.(yaml|yml)$/)) {
      parsedLogs = await parseYamlLogs(fileContent);
    } else {
      throw new Error("不支持的文件格式");
    }

    // 3. 验证日志数据
    const validationResult = logsArraySchema.safeParse(parsedLogs);

    if (!validationResult.success) {
      throw new Error(`日志数据格式无效: ${validationResult.error.message}`);
    }

    // 4. 格式化日期并排序
    const formattedLogs = formatAndSortLogs(validationResult.data);

    // 5. 记录成功上传日志
    logger.info(`成功上传 ${formattedLogs.length} 条日志`);

    return formattedLogs;
  } catch (error) {
    logger.error("日志上传失败:", error);
    throw new Error(error instanceof Error ? error.message : "日志上传失败");
  }
}

async function parseJsonLogs(content: string): Promise<LogEntry[]> {
  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON 文件必须包含日志数组");
    }
    return parsed;
  } catch (error) {
    throw new Error(
      "JSON 解析失败: " + (error instanceof Error ? error.message : "未知错误")
    );
  }
}

async function parseCsvLogs(content: string): Promise<LogEntry[]> {
  try {
    const lines = content.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim());

    // 验证必需的列
    const requiredColumns = ["id", "timestamp", "level", "message"];
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      throw new Error(`CSV 缺少必需的列: ${missingColumns.join(", ")}`);
    }

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const log: any = {};

      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          // 特殊处理某些字段
          if (header === "details") {
            try {
              log[header] = JSON.parse(values[index]);
            } catch {
              log[header] = {};
            }
          } else {
            log[header] = values[index];
          }
        }
      });

      return log;
    });
  } catch (error) {
    throw new Error(
      "CSV 解析失败: " + (error instanceof Error ? error.message : "未知错误")
    );
  }
}

async function parseYamlLogs(content: string): Promise<LogEntry[]> {
  try {
    const parsed = yaml.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error("YAML 文件必须包含日志数组");
    }
    return parsed;
  } catch (error) {
    throw new Error(
      "YAML 解析失败: " + (error instanceof Error ? error.message : "未知错误")
    );
  }
}

function formatAndSortLogs(logs: LogEntry[]): LogEntry[] {
  return logs
    .map((log) => ({
      ...log,
      // 确保时间戳格式一致
      timestamp: new Date(log.timestamp).toISOString(),
      // 确保日志级别格式一致
      level: log.level.toLowerCase() as "info" | "warn" | "error",
    }))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

// 新增功能：日志过滤
export function filterLogs(
  logs: LogEntry[],
  level?: string,
  source?: string
): LogEntry[] {
  return logs.filter((log) => {
    return (
      (!level || log.level === level) && (!source || log.source === source)
    );
  });
}

// 新增功能：日志聚合
export function aggregateLogs(logs: LogEntry[]): Record<string, number> {
  return logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

// 新增功能：日志导出
export function exportLogs(logs: LogEntry[], format: "json" | "csv"): string {
  if (format === "json") {
    return JSON.stringify(logs, null, 2);
  } else if (format === "csv") {
    const headers = [
      "id",
      "timestamp",
      "level",
      "message",
      "source",
      "details",
    ];
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        headers
          .map((header) => {
            const value = log[header as keyof LogEntry];
            return typeof value === "object" ? JSON.stringify(value) : value;
          })
          .join(",")
      ),
    ].join("\n");
    return csvContent;
  } else {
    throw new Error("不支持的导出格式");
  }
}
