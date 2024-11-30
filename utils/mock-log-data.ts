import { Log, LogLevel } from "../types/log";

const sources = ["Server", "Database", "API", "Frontend", "Auth"];

export function generateMockLogs(count: number): Log[] {
  const logs: Log[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    logs.push(generateSingleMockLog(now.getTime() - i * 60000));
  }

  return logs;
}

export function generateSingleMockLog(timestamp?: number): Log {
  const now = timestamp ? new Date(timestamp) : new Date();
  return {
    id: `log-${now.getTime()}`,
    timestamp: now.toISOString(),
    level: ["info", "warning", "error"][
      Math.floor(Math.random() * 3)
    ] as LogLevel,
    message: `This is a sample log message ${now.getTime()}`,
    source: sources[Math.floor(Math.random() * sources.length)],
  };
}
