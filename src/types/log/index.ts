export interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  tags?: string[];
  note?: string;
  source?: string;
  user?: string;
  sessionId?: string;
}
