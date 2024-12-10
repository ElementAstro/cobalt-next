import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AdvancedSettings, DeviceData } from "@/types/connection";

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
      (set, get) => {
        const api = useApiService();

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
