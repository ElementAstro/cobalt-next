import { create } from "zustand";

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  totalMemory: number;
  diskUsage: number;
  totalDisk: number;
  temperature: number;
  temperatureDetails: string[];
  loadAverage: number[];
  networkUsage: number;
  downloadSpeed: number;
  uploadSpeed: number;
  gpuUsage: number;
  gpuTemperature: number;
  defaultStorage: string;
  storageUsage: { used: number; total: number };
}

interface SystemStore {
  systemInfo: SystemInfo;
  setSystemInfo: (info: SystemInfo) => void;
  setDefaultStorage: (storage: string) => void;
  updateStorageUsage: (usage: { used: number; total: number }) => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  systemInfo: {
    cpuUsage: 0,
    memoryUsage: 0,
    totalMemory: 0,
    diskUsage: 0,
    totalDisk: 0,
    temperature: 0,
    temperatureDetails: [],
    loadAverage: [0, 0, 0],
    networkUsage: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    gpuUsage: 0,
    gpuTemperature: 0,
    defaultStorage: "internal",
    storageUsage: { used: 0, total: 0 },
  },
  setSystemInfo: (info) => set({ systemInfo: info }),
  setDefaultStorage: (storage) =>
    set((state) => ({
      systemInfo: { ...state.systemInfo, defaultStorage: storage },
    })),
  updateStorageUsage: (usage) =>
    set((state) => ({
      systemInfo: { ...state.systemInfo, storageUsage: usage },
    })),
}));
