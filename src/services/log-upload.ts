import { LogEntry } from "@/types/log";
import { z } from "zod";

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
    if (!file.name.match(/\.(json|csv)$/)) {
      throw new Error("不支持的文件格式。请上传 .json 或 .csv 文件");
    }

    const fileContent = await file.text();
    let parsedLogs: LogEntry[];

    // 2. 根据文件类型解析内容
    if (file.name.endsWith(".json")) {
      parsedLogs = await parseJsonLogs(fileContent);
    } else {
      parsedLogs = await parseCsvLogs(fileContent);
    }

    // 3. 验证日志数据
    const validationResult = logsArraySchema.safeParse(parsedLogs);

    if (!validationResult.success) {
      throw new Error(`日志数据格式无效: ${validationResult.error.message}`);
    }

    // 4. 格式化日期并排序
    return formatAndSortLogs(validationResult.data);
  } catch (error) {
    console.error("日志上传失败:", error);
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
