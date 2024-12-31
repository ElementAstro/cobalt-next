"use client";

import { create } from "zustand";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import WebSocketClient from "@/utils/websocket-client";
import { useEffect } from "react";

export type DeviceType =
  | "Camera"
  | "Telescope"
  | "Focuser"
  | "FilterWheel"
  | "Guider"
  | "Dome"
  | "Rotator";

interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  firmware: string;
  serial: string;
  lastConnected: string;
  manufacturer?: string;
  model?: string;
  capabilities?: string[];
}

interface DeviceSelectorState {
  devices: DeviceInfo[];
  selectedDevice: DeviceInfo | null;
  isConnected: boolean;
  isScanning: boolean;
  connectionProgress: number;
  lastScanTime: string;
  error: string | null;

  setDevices: (devices: DeviceInfo[]) => void;
  selectDevice: (device: DeviceInfo) => void;
  startScanning: () => void;
  stopScanning: () => void;
  connect: () => void;
  disconnect: () => void;
  setError: (error: string | null) => void;
  setConnectionProgress: (progress: number) => void;
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
    // 订阅设备相关主题
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
      selectedDevice: null,
      isConnected: false,
      isScanning: false,
      connectionProgress: 0,
      lastScanTime: "",
      error: null,

      setDevices: (devices) => set({ devices }),
      selectDevice: (device) => set({ selectedDevice: device }),
      startScanning,
      stopScanning,
      connect,
      disconnect,
      setError: (error) => set({ error }),
      setConnectionProgress: (progress) =>
        set({ connectionProgress: progress }),
    };
  }
);

export const getDeviceTemplates = (type: DeviceType) => deviceTemplates[type];
