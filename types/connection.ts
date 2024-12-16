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

export interface DeviceData {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  status: "online" | "offline" | "error";
  lastConnected?: string;
  ipAddress?: string;
  properties?: Record<string, any>;
}
