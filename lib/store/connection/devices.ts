import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { DeviceData, DeviceType } from "@/types/connection";
import { createApiService } from "@/services/connection";

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

  updateInterval: number;
  lastUpdate: string | null;
  isAutoRefresh: boolean;
  selectedDeviceType: DeviceType | null;
  deviceStats: {
    total: number;
    connected: number;
    error: number;
  };

  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  setUpdateInterval: (interval: number) => void;
  setSelectedDeviceType: (type: DeviceType | null) => void;
  getDevicesByType: (type: DeviceType) => DeviceData[];
  updateDeviceStats: () => void;
}

export const useDevicesStore = create<DevicesState>()(
  devtools(
    persist(
      (set, get) => {
        const api = createApiService(true); // 使用默认的 mock 模式
        let refreshTimer: NodeJS.Timeout | null = null;

        const startAutoRefresh = () => {
          if (refreshTimer) return;
          refreshTimer = setInterval(() => {
            get().fetchDevices();
          }, get().updateInterval);
          set({ isAutoRefresh: true });
        };

        const stopAutoRefresh = () => {
          if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
          }
          set({ isAutoRefresh: false });
        };

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
              set({
                devices,
                loading: false,
                lastUpdate: new Date().toISOString(),
              });
              get().updateDeviceStats();
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

          updateInterval: 5000,
          lastUpdate: null,
          isAutoRefresh: false,
          selectedDeviceType: null,
          deviceStats: {
            total: 0,
            connected: 0,
            error: 0,
          },

          startAutoRefresh,
          stopAutoRefresh,
          setUpdateInterval: (interval) => set({ updateInterval: interval }),
          setSelectedDeviceType: (type) => set({ selectedDeviceType: type }),

          getDevicesByType: (type) => {
            return get().devices.filter((device) => device.type === type);
          },

          updateDeviceStats: () => {
            const devices = get().devices;
            set({
              deviceStats: {
                total: devices.length,
                connected: devices.filter((d) => d.connected).length,
                error: devices.filter((d) => !d.status.isOnline).length,
              },
            });
          },
        };
      },
      {
        name: "devices-storage",
      }
    )
  )
);
