export interface ScriptHistory {
  id: string;
  timestamp: string;
  status: "pending" | "running" | "completed" | "failed";
  output: string[];
  count: number;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface Script {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt: Date | null;
  version: number;
  executionCount: number;
  successCount: number;
  failureCount: number;
  history?: ScriptHistory[];
  executionHistory?: ScriptHistory[];
}

export interface ScriptExecution {
  id: string;
  scriptId: string;
  status: "pending" | "running" | "completed" | "failed";
  output: string[];
  startedAt: Date | null;
  completedAt: Date | null;
}
