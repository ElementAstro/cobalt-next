export type ProfileData = {
  name: string;
  autoConnect: boolean;
  mode: "local" | "remote";
  host: string;
  port: string;
  guiding: "internal" | "external";
  indiWebManager: boolean;
  protocol?: string;
  retry: number;
};

export type DeviceType =
  | "Camera"
  | "Telescope"
  | "Focuser"
  | "FilterWheel"
  | "Guider"
  | "Dome"
  | "Rotator";

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  firmware: string;
  serial: string;
  lastConnected: string;
  manufacturer?: string;
  model?: string;
  capabilities?: string[];
  connected: boolean;
}

export type AdvancedSettings = {
  updateInterval: number;
  connectionTimeout: number;
  debugMode: boolean;
  logLevel?: string;
  maxRetries?: number;
  connectionBuffer?: number;
  keepAliveInterval?: number;
};
