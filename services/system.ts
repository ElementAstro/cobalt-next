import axios from "axios";
import { Process, SystemInfo, User, ResourceLimits } from "@/types/system";
import { config } from "@/types/config";

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

// Mock data
const mockProcesses: Process[] = [
  {
    pid: 1,
    name: "System",
    user: "root",
    status: "running",
    memory: 1024,
    cpu: 2.5,
    startTime: "2023-01-01T00:00:00Z",
    command: "/sbin/init",
    threads: 2,
    parentPid: 0,
  },
  {
    pid: 2,
    name: "Chrome",
    user: "user",
    status: "running",
    memory: 2048,
    cpu: 5.0,
    startTime: "2023-01-01T01:00:00Z",
    command: "/usr/bin/chrome",
    threads: 10,
    parentPid: 1,
  },
];

const mockSystemInfo: SystemInfo = {
  cpuUsage: 30,
  memoryUsage: 60,
  diskUsage: 45,
  networkUsage: { upload: 1.5, download: 2.5 },
  temperature: 50,
  loadAverage: [1.5, 1.2, 1.0],
};

const mockUser: User = {
  id: "1",
  name: "John Doe",
  role: "admin",
  settings: {
    darkMode: false,
    refreshRate: 5,
    cpuWarningThreshold: 80,
    memoryWarningThreshold: 80,
    diskWarningThreshold: 80,
    networkWarningThreshold: 80,
  },
};

const mockResourceLimits: ResourceLimits = {
  maxCpuUsage: 90,
  maxMemoryUsage: 90,
  maxDiskUsage: 90,
  maxNetworkUsage: 100,
};

export const api = {
  fetchProcesses: async (): Promise<Process[]> => {
    if (config.useMockData) {
      return mockProcesses;
    }
    const response = await axiosInstance.get<Process[]>("/processes");
    return response.data;
  },

  killProcess: async (pid: number): Promise<void> => {
    if (config.useMockData) {
      console.log(`Mock: Killing process ${pid}`);
      return;
    }
    await axiosInstance.post(`/processes/${pid}/kill`);
  },

  fetchSystemInfo: async (): Promise<SystemInfo> => {
    if (config.useMockData) {
      return mockSystemInfo;
    }
    const response = await axiosInstance.get<SystemInfo>("/system-info");
    return response.data;
  },

  login: async (username: string, password: string): Promise<User> => {
    if (config.useMockData) {
      return mockUser;
    }
    const response = await axiosInstance.post<User>("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    if (config.useMockData) {
      console.log("Mock: Logging out");
      return;
    }
    await axiosInstance.post("/auth/logout");
  },

  fetchCurrentUser: async (): Promise<User> => {
    if (config.useMockData) {
      return mockUser;
    }
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  },

  updateUserSettings: async (
    settings: Partial<User["settings"]>
  ): Promise<User> => {
    if (config.useMockData) {
      mockUser.settings = { ...mockUser.settings, ...settings };
      return mockUser;
    }
    const response = await axiosInstance.put<User>("/user/settings", settings);
    return response.data;
  },

  fetchResourceLimits: async (): Promise<ResourceLimits> => {
    if (config.useMockData) {
      return mockResourceLimits;
    }
    const response = await axiosInstance.get<ResourceLimits>(
      "/resource-limits"
    );
    return response.data;
  },

  updateResourceLimits: async (
    limits: Partial<ResourceLimits>
  ): Promise<ResourceLimits> => {
    if (config.useMockData) {
      Object.assign(mockResourceLimits, limits);
      return mockResourceLimits;
    }
    const response = await axiosInstance.put<ResourceLimits>(
      "/resource-limits",
      limits
    );
    return response.data;
  },
};
