import { useState, useCallback } from "react";
import api from "./axios";
import { DeviceData, AdvancedSettings } from "@/types/connection";

// API endpoints
const API_ENDPOINTS = {
  profile: "/api/profile",
  devices: "/api/devices",
  advancedSettings: "/api/settings/advanced",
};

type ProfileData = {
  name: string;
  autoConnect: boolean;
  mode: "local" | "remote";
  host: string;
  port: string;
  guiding: "internal" | "external";
  indiWebManager: boolean;
};

const mockProfileData: ProfileData = {
  name: "测试",
  autoConnect: true,
  mode: "remote",
  host: "127.0.0.1",
  port: "7624",
  guiding: "internal",
  indiWebManager: false,
};

// 更新模拟设备数据
const mockDevices: DeviceData[] = [
  {
    id: "mount-01",
    name: "Mount",
    type: "Mount Simulator",
    connected: false,
    status: "offline",
    lastConnected: "2023-07-01T10:00:00Z",
    ipAddress: "192.168.1.100",
    properties: {
      model: "EQ6-R Pro",
      firmware: "v1.0.0",
    },
  },
  {
    id: "camera-01",
    name: "Camera 1",
    type: "CCD Simulator",
    connected: false,
    status: "offline",
    lastConnected: "2023-07-01T10:00:00Z",
    ipAddress: "192.168.1.101",
    properties: {
      resolution: "3096x2080",
      pixelSize: "3.8um",
    },
  },
  {
    id: "focuser-01",
    name: "Focuser",
    type: "Focuser Simulator",
    connected: false,
    status: "offline",
    lastConnected: "2023-07-01T10:00:00Z",
    ipAddress: "192.168.1.102",
    properties: {
      maxTravel: 100000,
      position: 0,
    },
  },
  {
    id: "filterwheel-01",
    name: "Filter Wheel",
    type: "Filter Simulator",
    connected: false,
    status: "offline",
    lastConnected: "2023-07-01T10:00:00Z",
    ipAddress: "192.168.1.103",
    properties: {
      positions: 8,
      currentPosition: 1,
    },
  },
];

const mockAdvancedSettings: AdvancedSettings = {
  updateInterval: 1000,
  connectionTimeout: 30,
  debugMode: false,
  newSetting: "default",
  theme: "dark",
  notifications: true,
  autoSave: true,
  language: "en",
};

export function useApiService() {
  const [useMock, setUseMock] = useState(true);

  const toggleMockMode = useCallback(() => {
    setUseMock((prev) => !prev);
  }, []);

  const fetchProfileData = useCallback(async (): Promise<ProfileData> => {
    if (useMock) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockProfileData), 500)
      );
    }
    return api.request<ProfileData>({
      url: API_ENDPOINTS.profile,
      method: "GET",
    });
  }, [useMock]);

  const updateProfileData = useCallback(
    async (data: Partial<ProfileData>): Promise<ProfileData> => {
      if (useMock) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ...mockProfileData, ...data }), 500)
        );
      }
      return api.request<ProfileData>({
        url: API_ENDPOINTS.profile,
        method: "PUT",
        data,
      });
    },
    [useMock]
  );

  const fetchDevices = useCallback(async (): Promise<DeviceData[]> => {
    if (useMock) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockDevices), 500)
      );
    }
    return api.request<DeviceData[]>({
      url: API_ENDPOINTS.devices,
      method: "GET",
    });
  }, [useMock]);

  const connectDevice = useCallback(
    async (deviceName: string): Promise<DeviceData> => {
      if (useMock) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const device = mockDevices.find((d) => d.name === deviceName);
            if (device) {
              const updatedDevice = {
                ...device,
                connected: true,
                status: "online" as const,
                lastConnected: new Date().toISOString(),
              };
              resolve(updatedDevice);
            } else {
              throw new Error("设备未找到");
            }
          }, 1000);
        });
      }
      return api.request<DeviceData>({
        url: `${API_ENDPOINTS.devices}/${deviceName}/connect`,
        method: "POST",
      });
    },
    [useMock]
  );

  const disconnectDevice = useCallback(
    async (deviceName: string): Promise<DeviceData> => {
      if (useMock) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const device = mockDevices.find((d) => d.name === deviceName);
            if (device) {
              const updatedDevice = {
                ...device,
                connected: false,
                status: "offline" as const,
              };
              resolve(updatedDevice);
            } else {
              throw new Error("设备未找到");
            }
          }, 1000);
        });
      }
      return api.request<DeviceData>({
        url: `${API_ENDPOINTS.devices}/${deviceName}/disconnect`,
        method: "POST",
      });
    },
    [useMock]
  );

  const fetchAdvancedSettings =
    useCallback(async (): Promise<AdvancedSettings> => {
      if (useMock) {
        return new Promise((resolve) =>
          setTimeout(() => resolve(mockAdvancedSettings), 500)
        );
      }
      return api.request<AdvancedSettings>({
        url: API_ENDPOINTS.advancedSettings,
        method: "GET",
      });
    }, [useMock]);

  const updateAdvancedSettings = useCallback(
    async (data: Partial<AdvancedSettings>): Promise<AdvancedSettings> => {
      if (useMock) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ...mockAdvancedSettings, ...data }), 500)
        );
      }
      return api.request<AdvancedSettings>({
        url: API_ENDPOINTS.advancedSettings,
        method: "PUT",
        data,
      });
    },
    [useMock]
  );

  return {
    useMock,
    toggleMockMode,
    fetchProfileData,
    updateProfileData,
    fetchDevices,
    connectDevice,
    disconnectDevice,
    fetchAdvancedSettings,
    updateAdvancedSettings,
  };
}
