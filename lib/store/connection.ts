import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AdvancedSettings, DeviceData } from "@/types/connection";
import { createApiService } from "@/services/connection";

interface SettingsStore {
  settings: AdvancedSettings;
  errors: { [key: string]: string };
  isLoading: boolean;
  setSettings: (settings: Partial<AdvancedSettings>) => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
  setLoading: (state: boolean) => void;
  validateField: (field: string, value: any) => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        settings: {
          updateInterval: 1000,
          connectionTimeout: 30,
          debugMode: false,
          newSetting: "",
          theme: "dark",
          notifications: true,
          autoSave: true,
          language: "zh-CN",
          maxConnections: 5,
          bufferSize: 100,
          autoBackup: true,
          backupInterval: 24,
        },
        errors: {},
        isLoading: false,

        setSettings: (newSettings) =>
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          })),

        setError: (field, error) =>
          set((state) => ({
            errors: { ...state.errors, [field]: error },
          })),

        clearErrors: () => set({ errors: {} }),

        setLoading: (loading) => set({ isLoading: loading }),

        validateField: (field: string, value: any) => {
          let error = "";
          switch (field) {
            case "updateInterval":
              if (value < 500 || value > 10000) {
                error = "更新间隔必须在500ms到10000ms之间";
              }
              break;
            case "connectionTimeout":
              if (value < 10 || value > 120) {
                error = "连接超时必须在10秒到120秒之间";
              }
              break;
          }
          set((state) => ({
            errors: { ...state.errors, [field]: error },
          }));
          return error === "";
        },
      }),
      {
        name: "settings-storage",
      }
    )
  )
);

interface DevicesState {
  devices: DeviceData[];
  loading: boolean;
  error: string | null;
  remoteDrivers: string;
  filter: string;
  selectedDevice: string | null;

  setDevices: (devices: DeviceData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRemoteDrivers: (drivers: string) => void;
  setFilter: (filter: string) => void;
  setSelectedDevice: (deviceId: string | null) => void;

  fetchDevices: () => Promise<void>;
  connectDevice: (deviceName: string) => Promise<void>;
  disconnectDevice: (deviceName: string) => Promise<void>;
  updateDeviceProperties: (
    deviceId: string,
    properties: Record<string, any>
  ) => void;
}

export const useDevicesStore = create<DevicesState>()(
  devtools(
    persist(
      (set) => {
        const api = createApiService(true); // 使用默认的 mock 模式

        return {
          devices: [],
          loading: false,
          error: null,
          remoteDrivers: "",
          filter: "",
          selectedDevice: null,

          setDevices: (devices) => set({ devices }),
          setLoading: (loading) => set({ loading }),
          setError: (error) => set({ error }),
          setRemoteDrivers: (drivers) => set({ remoteDrivers: drivers }),
          setFilter: (filter) => set({ filter }),
          setSelectedDevice: (deviceId) => set({ selectedDevice: deviceId }),

          fetchDevices: async () => {
            set({ loading: true, error: null });
            try {
              const devices = await api.fetchDevices();
              set({ devices, loading: false });
            } catch (error) {
              set({ error: (error as Error).message, loading: false });
            }
          },

          connectDevice: async (deviceName) => {
            set({ loading: true, error: null });
            try {
              const updatedDevice = await api.connectDevice(deviceName);
              set((state) => ({
                devices: state.devices.map((d) =>
                  d.name === deviceName ? updatedDevice : d
                ),
                loading: false,
              }));
            } catch (error) {
              set({ error: (error as Error).message, loading: false });
            }
          },

          disconnectDevice: async (deviceName) => {
            set({ loading: true, error: null });
            try {
              const updatedDevice = await api.disconnectDevice(deviceName);
              set((state) => ({
                devices: state.devices.map((d) =>
                  d.name === deviceName ? updatedDevice : d
                ),
                loading: false,
              }));
            } catch (error) {
              set({ error: (error as Error).message, loading: false });
            }
          },

          updateDeviceProperties: (deviceId, properties) => {
            set((state) => ({
              devices: state.devices.map((d) =>
                d.id === deviceId
                  ? { ...d, properties: { ...d.properties, ...properties } }
                  : d
              ),
            }));
          },
        };
      },
      {
        name: "devices-storage",
      }
    )
  )
);

interface Log {
  timestamp: string;
  message: string;
  type: "info" | "error" | "warning";
}

interface LogsStore {
  logs: Log[];
  filter: string;
  setFilter: (filter: string) => void;
  addLog: (log: Log) => void;
  clearLogs: () => void;
}

export const useLogsStore = create<LogsStore>((set) => ({
  logs: [
    {
      timestamp: "2023-07-01 10:00:15",
      message: "Connected to Mount",
      type: "info",
    },
    {
      timestamp: "2023-07-01 10:00:16",
      message: "Camera 1 initialized",
      type: "info",
    },
    {
      timestamp: "2023-07-01 10:00:17",
      message: "Focuser ready",
      type: "info",
    },
    {
      timestamp: "2023-07-01 10:00:18",
      message: "Filter wheel connected",
      type: "info",
    },
    {
      timestamp: "2023-07-01 10:00:19",
      message: "Weather station data received",
      type: "warning",
    },
    {
      timestamp: "2023-07-01 10:00:20",
      message: "All systems operational",
      type: "info",
    },
  ],
  filter: "",
  setFilter: (filter) => set({ filter }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
}));

export interface Profile {
  id: string;
  name: string;
  autoConnect: boolean;
  mode: "local" | "remote";
  host: string;
  port: string;
  guiding: "internal" | "external";
  indiWebManager: boolean;
  theme: "light" | "dark" | "system";
  isConnected: boolean;
  lastConnected?: Date;
}

export type ActiveProfile = Profile | undefined;

interface ProfileState {
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
  setActiveProfile: (profile: Profile) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfile: null,
      isLoading: false,
      error: null,
      setActiveProfile: (profile) => set({ activeProfile: profile }),
      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, data) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        })),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: "profile-storage",
    }
  )
);
