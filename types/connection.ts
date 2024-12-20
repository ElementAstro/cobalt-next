export interface AdvancedSettings {
  updateInterval: number;
  connectionTimeout: number;
  debugMode: boolean;
  newSetting: string;
  theme: "dark" | "light";
  notifications: boolean;
  autoSave: boolean;
  language: string;
  maxConnections: number;
  bufferSize: number;
  autoBackup: boolean;
  backupInterval: number;
}

export interface DeviceStatus {
  isOnline: boolean;
  temperature: number;
  humidity: number;
  lastUpdate: string;
  batteryLevel: number;
  signalStrength: number;
}

export interface DeviceData {
  id: string;
  name: string;
  type: string;
  model: string;
  connected: boolean;
  status: DeviceStatus;
}

export type DeviceType =
  | "Camera"
  | "Mount"
  | "Focuser"
  | "FilterWheel"
  | "Guider"
  | "Weather"
  | "Dome"
  | "Rotator";

export const DEVICE_TYPES: DeviceType[] = [
  "Camera",
  "Mount",
  "Focuser",
  "FilterWheel",
  "Guider",
  "Weather",
  "Dome",
  "Rotator",
];
