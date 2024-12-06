import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface NetworkSettings {
  ssid: string;
  password: string;
  frequency: "2.4 GHz" | "5 GHz";
  channel: number;
  security: "WPA2" | "WPA3" | "Open";
  maxClients: number;
  autoShutdownTime: number;
  hotspotEnabled: boolean;
  powerSaving: boolean;
  internetSharing: string;
  shareTo: string;
  connectedDevices: number;
  maxDevices: number;
  isMockMode: boolean;
}

interface NetworkStore {
  settings: NetworkSettings;
  isEditing: boolean;
  error: string | null;
  successMessage: string | null;
  setSettings: (settings: Partial<NetworkSettings>) => void;
  toggleHotspot: () => void;
  togglePowerSaving: () => void;
  setEditing: (editing: boolean) => void;
  resetSettings: () => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  validateSettings: () => boolean;
}

const defaultSettings: NetworkSettings = {
  ssid: "MAXQIAN",
  password: "12345678",
  frequency: "2.4 GHz",
  channel: 6,
  security: "WPA2",
  maxClients: 8,
  autoShutdownTime: 5,
  hotspotEnabled: false,
  powerSaving: true,
  internetSharing: "以太网 2",
  shareTo: "WLAN",
  connectedDevices: 0,
  maxDevices: 8,
  isMockMode: false,
};

export const useNetworkStore = create<NetworkStore>()(
  devtools((set, get) => ({
    settings: defaultSettings,
    isEditing: false,
    error: null,
    successMessage: null,
    setSettings: (newSettings) =>
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
        error: null,
      })),
    toggleHotspot: () =>
      set((state) => ({
        settings: {
          ...state.settings,
          hotspotEnabled: !state.settings.hotspotEnabled,
        },
        successMessage: !state.settings.hotspotEnabled
          ? "移动热点已启用"
          : "移动热点已禁用",
      })),
    togglePowerSaving: () =>
      set((state) => ({
        settings: {
          ...state.settings,
          powerSaving: !state.settings.powerSaving,
        },
        successMessage: state.settings.powerSaving
          ? "节能模式已禁用"
          : "节能模式已启用",
      })),
    setEditing: (editing) => set({ isEditing: editing }),
    resetSettings: () => set({ settings: defaultSettings, error: null }),
    setError: (error) => set({ error }),
    setSuccessMessage: (successMessage) => set({ successMessage }),
    validateSettings: () => {
      const { settings } = get();
      if (settings.ssid.length < 1 || settings.ssid.length > 32) {
        set({ error: "SSID 必须在 1 到 32 个字符之间" });
        return false;
      }
      if (settings.password.length < 8 || settings.password.length > 63) {
        set({ error: "密码必须在 8 到 63 个字符之间" });
        return false;
      }
      if (settings.maxClients < 1 || settings.maxClients > 10) {
        set({ error: "最大客户端数必须在 1 到 10 之间" });
        return false;
      }
      set({ error: null });
      return true;
    },
  }))
);
