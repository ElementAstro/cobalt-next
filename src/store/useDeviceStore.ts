"use client";

import { create } from "zustand";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import WebSocketClient from "@/utils/websocket-client";
import { DeviceInfo, DeviceType } from "@/types/device";

interface DeviceSelectorState {
  devices: DeviceInfo[];
  remoteDrivers: DeviceInfo[];
  selectedDevice: DeviceInfo | null;
  isConnected: boolean;
  isScanning: boolean;
  connectionProgress: number;
  lastScanTime: string;
  error: string | null;

  setDevices: (devices: DeviceInfo[]) => void;
  setRemoteDrivers: (drivers: DeviceInfo[]) => void;
  selectDevice: (device: DeviceInfo) => void;
  startScanning: () => void;
  stopScanning: () => void;
  connect: () => void;
  disconnect: () => void;
  setError: (error: string | null) => void;
  setConnectionProgress: (progress: number) => void;

  // 新增状态
  deviceGroups: { [key: string]: string[] };
  favoriteDevices: string[];
  deviceNotes: { [key: string]: string };
  deviceSettings: { [key: string]: any };
  lastConnectionAttempt: string;
  connectionHistory: Array<{
    deviceId: string;
    timestamp: string;
    success: boolean;
    error?: string;
  }>;

  // 新增方法
  addDeviceGroup: (name: string, deviceIds: string[]) => void;
  removeDeviceGroup: (name: string) => void;
  toggleFavoriteDevice: (deviceId: string) => void;
  updateDeviceNote: (deviceId: string, note: string) => void;
  updateDeviceSettings: (deviceId: string, settings: any) => void;
  setConnectionHistory: (history: any) => void;
  clearConnectionHistory: () => void;
}

// 设备模拟数据
const deviceTemplates: Record<DeviceType, DeviceInfo[]> = {
  Camera: [
    {
      id: "camera-1",
      name: "ZWO ASI294MM Pro",
      type: "Camera",
      manufacturer: "ZWO",
      model: "ASI294MM Pro",
      firmware: "v2.1.0",
      serial: "SN2024001",
      lastConnected: new Date().toISOString(),
      capabilities: ["Cooling", "High Speed", "16bit ADC"],
      connected: false,
      isFavorite: true,
    },
    {
      id: "camera-2",
      name: "QHY268M",
      type: "Camera",
      manufacturer: "QHYCCD",
      model: "QHY268M",
      firmware: "v1.0.4",
      serial: "SN2024002",
      lastConnected: new Date().toISOString(),
      capabilities: ["Cooling", "High Speed", "16bit ADC"],
      connected: false,
      isFavorite: false,
    },
  ],
  Telescope: [
    {
      id: "telescope-1",
      name: "Celestron CGX",
      type: "Telescope",
      manufacturer: "Celestron",
      model: "CGX",
      firmware: "v3.2",
      serial: "SN2024003",
      lastConnected: new Date().toISOString(),
      capabilities: ["Goto", "Tracking", "PEC"],
      connected: false,
      isFavorite: true,
    },
  ],
  Focuser: [
    {
      id: "focuser-1",
      name: "ZWO EAF",
      type: "Focuser",
      manufacturer: "ZWO",
      model: "EAF",
      firmware: "v2.0",
      serial: "SN2024004",
      lastConnected: new Date().toISOString(),
      capabilities: ["Temperature Compensation"],
      connected: false,
      isFavorite: false,
    },
  ],
  FilterWheel: [
    {
      id: "filterwheel-1",
      name: "ZWO EFW",
      type: "FilterWheel",
      manufacturer: "ZWO",
      model: "EFW",
      firmware: "v1.5",
      serial: "SN2024005",
      lastConnected: new Date().toISOString(),
      capabilities: ["7-Position"],
      connected: false,
      isFavorite: true,
    },
  ],
  Guider: [
    {
      id: "guider-1",
      name: "ZWO ASI120MM Mini",
      type: "Guider",
      manufacturer: "ZWO",
      model: "ASI120MM Mini",
      firmware: "v1.2",
      serial: "SN2024006",
      lastConnected: new Date().toISOString(),
      capabilities: ["High Speed", "Small Pixel"],
      connected: false,
      isFavorite: false,
    },
  ],
  Dome: [
    {
      id: "dome-1",
      name: "Explora-Dome",
      type: "Dome",
      manufacturer: "Explora-Dome",
      model: "Explora-Dome",
      firmware: "v1.0",
      serial: "SN2024007",
      lastConnected: new Date().toISOString(),
      capabilities: ["Automatic", "Remote Control"],
      connected: false,
      isFavorite: true,
    },
  ],
  Rotator: [
    {
      id: "rotator-1",
      name: "PrimaLuceLab EAGLE Rotator",
      type: "Rotator",
      manufacturer: "PrimaLuceLab",
      model: "EAGLE Rotator",
      firmware: "v1.1",
      serial: "SN2024008",
      lastConnected: new Date().toISOString(),
      capabilities: ["High Precision", "Remote Control"],
      connected: false,
      isFavorite: true,
    },
  ],
};

// 初始化 WebSocket 客户端和消息总线
const wsClient = new WebSocketClient({
  url: "ws://localhost:8081",
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  debug: true,
});

const messageBus = new MessageBus(wsClient, {
  logLevel: LogLevel.DEBUG,
  maxRetries: 5,
  retryDelay: 1000,
});

// 使用消息中间件处理
messageBus.use((message, topic, next) => {
  // 示例中间件：日志记录
  console.log(`Middleware: Received message on topic "${topic}":`, message);
  next();
});

export const useDeviceSelectorStore = create<DeviceSelectorState>(
  (set, get) => {
    messageBus.subscribe("device/update", (data: DeviceInfo[]) => {
      set({ devices: data });
    });

    messageBus.subscribe("device/connected", (data: DeviceInfo) => {
      set({
        selectedDevice: data,
        isConnected: true,
        lastScanTime: new Date().toISOString(),
      });
    });

    messageBus.subscribe("device/disconnected", () => {
      set({ selectedDevice: null, isConnected: false });
    });

    messageBus.subscribe("scan/progress", (progress: number) => {
      set({ connectionProgress: progress });
    });

    messageBus.subscribe("scan/error", (error: string) => {
      set({ error });
    });

    messageBus.subscribe("scan/completed", (devices: DeviceInfo[]) => {
      set({
        devices,
        isScanning: false,
        lastScanTime: new Date().toISOString(),
      });
    });

    // 开始扫描设备
    const startScanning = () => {
      set({ isScanning: true, error: null, devices: [] });
      messageBus.publish("scan/start", {});
    };

    // 停止扫描设备
    const stopScanning = () => {
      set({ isScanning: false });
      messageBus.publish("scan/stop", {});
    };

    // 连接设备
    const connect = () => {
      const { selectedDevice } = get();
      if (selectedDevice) {
        messageBus.publish("device/connect", selectedDevice.id);
      } else {
        set({ error: "未选择设备" });
      }
    };

    // 断开设备连接
    const disconnect = () => {
      const { selectedDevice } = get();
      if (selectedDevice) {
        messageBus.publish("device/disconnect", selectedDevice.id);
      } else {
        set({ error: "未选择设备" });
      }
    };

    return {
      devices: [],
      remoteDrivers: [],
      selectedDevice: null,
      isConnected: false,
      isScanning: false,
      connectionProgress: 0,
      lastScanTime: "",
      error: null,

      setDevices: (devices) => set({ devices }),
      setRemoteDrivers: (drivers) => set({ remoteDrivers: drivers }),
      selectDevice: (device) => set({ selectedDevice: device }),
      startScanning,
      stopScanning,
      connect,
      disconnect,
      setError: (error) => set({ error }),
      setConnectionProgress: (progress) =>
        set({ connectionProgress: progress }),

      deviceGroups: {},
      favoriteDevices: [],
      deviceNotes: {},
      deviceSettings: {},
      lastConnectionAttempt: "",
      connectionHistory: [],

      addDeviceGroup: (name, deviceIds) =>
        set((state) => ({
          deviceGroups: {
            ...state.deviceGroups,
            [name]: deviceIds,
          },
        })),

      removeDeviceGroup: (name) =>
        set((state) => {
          const { [name]: removed, ...rest } = state.deviceGroups;
          return { deviceGroups: rest };
        }),

      toggleFavoriteDevice: (deviceId) =>
        set((state) => ({
          favoriteDevices: state.favoriteDevices.includes(deviceId)
            ? state.favoriteDevices.filter((id) => id !== deviceId)
            : [...state.favoriteDevices, deviceId],
        })),

      updateDeviceNote: (deviceId, note) =>
        set((state) => ({
          deviceNotes: {
            ...state.deviceNotes,
            [deviceId]: note,
          },
        })),

      updateDeviceSettings: (deviceId, settings) =>
        set((state) => ({
          deviceSettings: {
            ...state.deviceSettings,
            [deviceId]: settings,
          },
        })),

      setConnectionHistory: (history) => set({ connectionHistory: history }),

      clearConnectionHistory: () => set({ connectionHistory: [] }),
    };
  }
);

export const getDeviceTemplates = (type: DeviceType) => deviceTemplates[type];

import { ProfileData } from "@/types/device";

interface ProfileState {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
  updateProfileField: (field: keyof ProfileData, value: any) => void;
  isUpdating: boolean;
  error: string | null;
}

export const useProfileStore = create<ProfileState>((set, get) => {
  // 订阅与Profile相关的消息主题
  messageBus.subscribe("profile/update", (data: Partial<ProfileData>) => {
    set((state) => ({
      profile: { ...state.profile, ...data },
      isUpdating: false,
    }));
  });

  messageBus.subscribe("profile/error", (error: string) => {
    set({ error, isUpdating: false });
  });

  // 更新Profile字段
  const updateProfileField = (field: keyof ProfileData, value: any) => {
    set({ isUpdating: true, error: null });
    messageBus.publish("profile/updateField", { field, value });
  };

  return {
    profile: {
      name: "",
      autoConnect: false,
      mode: "remote",
      host: "",
      port: "",
      guiding: "internal",
      indiWebManager: false,
      protocol: "tcp",
      retry: 3,
    },
    setProfile: (profile) => set({ profile }),
    updateProfileField,
    isUpdating: false,
    error: null,
  };
});
