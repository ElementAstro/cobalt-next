"use client";

import { create } from "zustand";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import { DeviceInfo, DeviceType } from "@/types/device";
import getWsClient from "@/utils/ws-client";
import { z } from "zod";
import logger from "@/utils/logger";

// Zod schemas for Device
const DeviceInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    "Camera",
    "Telescope",
    "Focuser",
    "FilterWheel",
    "Guider",
    "Dome",
    "Rotator",
  ]),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  firmware: z.string(),
  serial: z.string(),
  lastConnected: z.string(),
  capabilities: z.array(z.string()).optional(),
  connected: z.boolean(),
  isFavorite: z.boolean(),
});

// Message type definitions
type MessageType =
  | "device/update"
  | "device/connected"
  | "device/disconnected"
  | "scan/progress"
  | "scan/error"
  | "scan/completed"
  | "scan/start"
  | "scan/stop"
  | "device/connect"
  | "device/disconnect";

interface DeviceMessage {
  type: MessageType;
  payload: {
    devices?: DeviceInfo[];
    device?: DeviceInfo;
    progress?: number;
    error?: string;
  };
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

interface DeviceSelectorState {
  devices: DeviceInfo[];
  remoteDrivers: string[];
  selectedDevice: DeviceInfo | null;
  isConnected: boolean;
  isScanning: boolean;
  connectionProgress: number;
  lastScanTime: string;
  error: string | null;
  deviceGroups: Record<string, string[]>;
  favoriteDevices: string[];
  deviceNotes: Record<string, string>;
  deviceSettings: Record<string, any>;
  lastConnectionAttempt: string;
  connectionHistory: string[];

  setDevices: (devices: DeviceInfo[]) => void;
  setRemoteDrivers: (drivers: string[]) => void;
  selectDevice: (device: DeviceInfo) => void;
  startScanning: () => void;
  stopScanning: () => void;
  connect: () => void;
  disconnect: () => void;
  setError: (error: string | null) => void;
  setConnectionProgress: (progress: number) => void;
  addDeviceGroup: (name: string, deviceIds: string[]) => void;
  removeDeviceGroup: (name: string) => void;
  toggleFavoriteDevice: (deviceId: string) => void;
  updateDeviceNote: (deviceId: string, note: string) => void;
  updateDeviceSettings: (deviceId: string, settings: any) => void;
  setConnectionHistory: (history: string[]) => void;
  clearConnectionHistory: () => void;
}

export const useDeviceSelectorStore = create<DeviceSelectorState>(
  (set, get) => {
    const wsClient = getWsClient();
    if (!wsClient) {
      throw new Error("WebSocket client is not initialized");
    }

    const messageBus = new MessageBus<DeviceMessage>(wsClient, {
      logLevel: LogLevel.INFO,
      maxRetries: 3,
      retryDelay: 1000,
    });

    // Add message validation middleware
    messageBus.use((message, topic, next) => {
      try {
        if (topic === "device/update" || topic === "device/connected") {
          // Validate device info
          if (Array.isArray(message.payload)) {
            message.payload.forEach((device) => DeviceInfoSchema.parse(device));
          } else {
            DeviceInfoSchema.parse(message.payload);
          }
        }
        logger.info(`Message received on topic ${topic}:`, message);
        next();
      } catch (error) {
        logger.error("Message validation failed:", error);
      }
    });

    // Subscribe to device updates
    messageBus.subscribe("device/update", (message: DeviceMessage) => {
      try {
        if (message.payload.devices) {
          const devices = message.payload.devices.map((device) => ({
            ...device,
            type: device.type as DeviceType, // 确保类型转换正确
          }));
          logger.info("Device list update received:", devices);
          set({ devices });
        }
      } catch (error) {
        logger.error("Error handling device update:", error);
      }
    });

    messageBus.subscribe("device/connected", (message: DeviceMessage) => {
      try {
        if (message.payload.device) {
          const device = {
            ...message.payload.device,
            type: message.payload.device.type as DeviceType,
          };
          logger.info("Device connected:", device);
          set({
            selectedDevice: device,
            isConnected: true,
            lastScanTime: new Date().toISOString(),
          });
        }
      } catch (error) {
        logger.error("Error handling device connection:", error);
      }
    });

    messageBus.subscribe("device/disconnected", () => {
      set({ selectedDevice: null, isConnected: false });
    });

    messageBus.subscribe("scan/progress", (message: DeviceMessage) => {
      if (typeof message.payload.progress === "number") {
        set({ connectionProgress: message.payload.progress });
      }
    });

    messageBus.subscribe("scan/error", (message: DeviceMessage) => {
      if (message.payload.error) {
        set({ error: message.payload.error });
      }
    });

    messageBus.subscribe("scan/completed", (message: DeviceMessage) => {
      if (message.payload.devices) {
        const devices = message.payload.devices.map((device) => ({
          ...device,
          type: device.type as DeviceType,
        }));
        set({
          devices,
          isScanning: false,
          lastScanTime: new Date().toISOString(),
        });
      }
    });

    // Clean up function
    const cleanup = () => {
      logger.info("Cleaning up WebSocket and message bus subscriptions");
      messageBus.getTopics().forEach((topic) => {
        messageBus.clearTopic(topic);
      });
      if (wsClient) {
        wsClient.close();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", cleanup);
    }

    // 开始扫描设备
    const startScanning = () => {
      try {
        logger.info("Starting device scan");
        set({ isScanning: true, error: null, devices: [] });
        messageBus.publish("scan/start", {});
      } catch (error) {
        logger.error("Error starting scan:", error);
        set({ error: "扫描启动失败" });
      }
    };

    // 停止扫描设备
    const stopScanning = () => {
      try {
        logger.info("Stopping device scan");
        set({ isScanning: false });
        messageBus.publish("scan/stop", {});
      } catch (error) {
        logger.error("Error stopping scan:", error);
        set({ error: "扫描停止失败" });
      }
    };

    // 连接设备
    const connect = () => {
      try {
        const { selectedDevice } = get();
        if (selectedDevice) {
          logger.info("Connecting to device:", selectedDevice.id);
          messageBus.publish("device/connect", selectedDevice.id);
        } else {
          set({ error: "未选择设备" });
        }
      } catch (error) {
        logger.error("Error connecting to device:", error);
        set({ error: "设备连接失败" });
      }
    };

    // 断开设备连接
    const disconnect = () => {
      try {
        const { selectedDevice } = get();
        if (selectedDevice) {
          logger.info("Disconnecting from device:", selectedDevice.id);
          messageBus.publish("device/disconnect", selectedDevice.id);
        } else {
          set({ error: "未选择设备" });
        }
      } catch (error) {
        logger.error("Error disconnecting from device:", error);
        set({ error: "设备断开失败" });
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

      setDevices: (devices: DeviceInfo[]) => set({ devices }),
      setRemoteDrivers: (drivers: string[]) => set({ remoteDrivers: drivers }),
      selectDevice: (device: DeviceInfo) => set({ selectedDevice: device }),
      startScanning,
      stopScanning,
      connect,
      disconnect,
      setError: (error: string | null) => set({ error }),
      setConnectionProgress: (progress: number) =>
        set({ connectionProgress: progress }),

      deviceGroups: {},
      favoriteDevices: [],
      deviceNotes: {},
      deviceSettings: {},
      lastConnectionAttempt: "",
      connectionHistory: [],

      addDeviceGroup: (name: string, deviceIds: string[]) =>
        set((state: DeviceSelectorState) => ({
          deviceGroups: {
            ...state.deviceGroups,
            [name]: deviceIds,
          },
        })),

      removeDeviceGroup: (name: string) =>
        set((state: DeviceSelectorState) => {
          const { [name]: removed, ...rest } = state.deviceGroups;
          return { deviceGroups: rest };
        }),

      toggleFavoriteDevice: (deviceId: string) =>
        set((state: DeviceSelectorState) => ({
          favoriteDevices: state.favoriteDevices.includes(deviceId)
            ? state.favoriteDevices.filter((id: string) => id !== deviceId)
            : [...state.favoriteDevices, deviceId],
        })),

      updateDeviceNote: (deviceId: string, note: string) =>
        set((state: DeviceSelectorState) => ({
          deviceNotes: {
            ...state.deviceNotes,
            [deviceId]: note,
          },
        })),

      updateDeviceSettings: (deviceId: string, settings: any) =>
        set((state: DeviceSelectorState) => ({
          deviceSettings: {
            ...state.deviceSettings,
            [deviceId]: settings,
          },
        })),

      setConnectionHistory: (history: string[]) =>
        set({ connectionHistory: history }),
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

export const useProfileStore = create<ProfileState>((set) => {
  const wsClient = getWsClient();
  if (!wsClient) {
    throw new Error("WebSocket client is not initialized");
  }

  const messageBus = new MessageBus(wsClient);

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
