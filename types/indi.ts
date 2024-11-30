export type PropertyState = "Idle" | "Ok" | "Busy" | "Alert";
export type DeviceState = "Disconnected" | "Connecting" | "Connected" | "Error";

export interface INDIProperty {
  name: string;
  label: string;
  group: string;
  state: PropertyState;
  perm: "ro" | "wo" | "rw";
  type: "text" | "number" | "switch" | "light" | "blob";
  value: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  format?: string;
  items?: string[];
  history?: { timestamp: Date; value: number | string | boolean }[];
}

export interface INDIGroup {
  name: string;
  properties: INDIProperty[];
}

export interface INDIDevice {
  name: string;
  state: DeviceState;
  groups: INDIGroup[];
}

export interface INDIPanelProps {
  devices: INDIDevice[];
  onPropertyChange: (
    deviceName: string,
    propertyName: string,
    value: string | number | boolean
  ) => Promise<void>;
  onRefresh: (deviceName: string, propertyName?: string) => Promise<void>;
  onConnect: (deviceName: string) => Promise<void>;
  onDisconnect: (deviceName: string) => Promise<void>;
  onExportConfig: (deviceName: string) => Promise<void>;
  onImportConfig: (deviceName: string, config: string) => Promise<void>;
}

export interface FilterOptions {
  searchTerm: string;
  propertyTypes: string[];
  propertyStates: PropertyState[];
  groups: string[];
}
