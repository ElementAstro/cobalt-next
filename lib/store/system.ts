import { create } from "zustand";

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temperature: number;
  loadAverage: number[];
}

interface SystemStore {
  systemInfo: SystemInfo;
  setSystemInfo: (info: SystemInfo) => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  systemInfo: {
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    temperature: 0,
    loadAverage: [0, 0, 0],
  },
  setSystemInfo: (info) => set({ systemInfo: info }),
}));

interface StorageUsage {
  used: number;
  total: number;
}

interface StorageStore {
  defaultStorage: string;
  storageUsage: StorageUsage;
  setDefaultStorage: (storage: string) => void;
  updateStorageUsage: (usage: StorageUsage) => void;
}

export const useStorageStore = create<StorageStore>((set) => ({
  defaultStorage: "internal",
  storageUsage: { used: 0, total: 0 },
  setDefaultStorage: (storage) => set({ defaultStorage: storage }),
  updateStorageUsage: (usage) => set({ storageUsage: usage }),
}));
