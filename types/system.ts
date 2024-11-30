export interface Process {
  pid: number;
  name: string;
  user: string;
  status: string;
  memory: number;
  cpu: number;
  startTime: string;
  command: string;
  threads: number;
  parentPid: number;
}

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: {
    upload: number;
    download: number;
  };
  temperature: number;
  loadAverage: number[];
}

export type UserRole = "admin" | "powerUser" | "user" | "readonly";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  settings: {
    darkMode: boolean;
    refreshRate: number;
    cpuWarningThreshold: number;
    memoryWarningThreshold: number;
    diskWarningThreshold: number;
    networkWarningThreshold: number;
  };
}

export interface ResourceLimits {
  maxCpuUsage: number;
  maxMemoryUsage: number;
  maxDiskUsage: number;
  maxNetworkUsage: number;
}
