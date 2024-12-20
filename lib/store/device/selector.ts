import { create } from "zustand";

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

export const useDeviceSelectorStore = create<DeviceSelectorState>((set) => ({
  devices: [],
  selectedDevice: null,
  isConnected: false,
  isScanning: false,
  connectionProgress: 0,
  lastScanTime: "",
  error: null,

  setDevices: (devices) => set({ devices }),
  selectDevice: (device) => set({ selectedDevice: device }),
  startScanning: () => set({ isScanning: true }),
  stopScanning: () => set({ isScanning: false }),
  connect: () => set({ isConnected: true }),
  disconnect: () => set({ isConnected: false, connectionProgress: 0 }),
  setError: (error) => set({ error }),
  setConnectionProgress: (progress) => set({ connectionProgress: progress }),
}));

export const getDeviceTemplates = (type: DeviceType) => deviceTemplates[type];
