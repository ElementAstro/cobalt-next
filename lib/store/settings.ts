import { create } from "zustand";
import { DiskInfo } from "@/types/settings";
import { mockDiskService } from "@/utils/mock-settings";

interface HotspotSettings {
  hotspotEnabled: boolean;
  powerSaving: boolean;
  isMockMode: boolean;
  ssid: string;
  password: string;
  frequency: "2.4 GHz" | "5 GHz";
  channel: number;
  security: "WPA2" | "WPA3" | "Open";
  maxClients: number;
  autoShutdownTime: number;
  internetSharing: "以太网" | "Wi-Fi" | "移动数据";
  shareTo: "WLAN" | "蓝牙";
  connectedDevices: number;
  maxDevices: number;
}

interface NetworkStore {
  settings: HotspotSettings;
  isEditing: boolean;
  error: string | null;
  successMessage: string | null;
  setSettings: (updatedSettings: Partial<HotspotSettings>) => void;
  toggleHotspot: () => void;
  togglePowerSaving: () => void;
  setEditing: (editing: boolean) => void;
  resetSettings: () => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  validateSettings: () => boolean;
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  settings: {
    hotspotEnabled: false,
    powerSaving: false,
    isMockMode: false,
    ssid: "我的热点",
    password: "password123",
    frequency: "2.4 GHz",
    channel: 6,
    security: "WPA2",
    maxClients: 5,
    autoShutdownTime: 30,
    internetSharing: "Wi-Fi",
    shareTo: "WLAN",
    connectedDevices: 0,
    maxDevices: 10,
  },
  isEditing: false,
  error: null,
  successMessage: null,
  setSettings: (updatedSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...updatedSettings },
    })),
  toggleHotspot: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        hotspotEnabled: !state.settings.hotspotEnabled,
      },
    })),
  togglePowerSaving: () =>
    set((state) => ({
      settings: { ...state.settings, powerSaving: !state.settings.powerSaving },
    })),
  setEditing: (editing) => set({ isEditing: editing }),
  resetSettings: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        ssid: "我的热点",
        password: "password123",
        frequency: "2.4 GHz",
        channel: 6,
        security: "WPA2",
        maxClients: 5,
        autoShutdownTime: 30,
      },
    })),
  setError: (error) => set({ error }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  validateSettings: () => {
    const { ssid, password, channel } = get().settings;
    if (ssid.trim() === "") {
      set({ error: "SSID 不能为空" });
      return false;
    }
    if (password.length < 8) {
      set({ error: "密码长度至少为 8 位" });
      return false;
    }
    if (channel < 1 || channel > 11) {
      set({ error: "信道必须在 1 到 11 之间" });
      return false;
    }
    set({ error: null });
    return true;
  },
}));

interface SystemManagementState {
  isRestartOpen: boolean;
  isShutdownOpen: boolean;
  setRestartOpen: (open: boolean) => void;
  setShutdownOpen: (open: boolean) => void;
}

export const useSystemManagementStore = create<SystemManagementState>(
  (set) => ({
    isRestartOpen: false,
    isShutdownOpen: false,
    setRestartOpen: (open) => set({ isRestartOpen: open }),
    setShutdownOpen: (open) => set({ isShutdownOpen: open }),
  })
);

interface DiskStore {
  disks: DiskInfo[];
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;
  fetchDisks: () => Promise<void>;
  setMockMode: (isMockMode: boolean) => void;
}

export const useDiskStore = create<DiskStore>((set) => ({
  disks: [],
  isLoading: false,
  error: null,
  isMockMode: true,
  fetchDisks: async () => {
    set({ isLoading: true, error: null });
    try {
      const disks = await mockDiskService.getDisks();
      set({ disks, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch disk info", isLoading: false });
    }
  },
  setMockMode: (isMockMode: boolean) => set({ isMockMode }),
}));
