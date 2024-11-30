export type LogLevel = "info" | "warning" | "error";

export interface Log {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
}

export interface LogLevelColor {
  info: string;
  warning: string;
  error: string;
}

export interface LogRetentionPolicy {
  days: number;
}

export interface LogAlertRule {
  level: LogLevel;
  keyword: string;
}

export interface MockModeSettings {
  enabled: boolean;
  logGenerationInterval: number; // in milliseconds
}
