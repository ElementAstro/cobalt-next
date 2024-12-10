import { useState, useCallback } from "react";
import api from "./axios";

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

type DeviceData = {
  name: string;
  type: string;
  connected: boolean;
};

type AdvancedSettings = {
  updateInterval: number;
  connectionTimeout: number;
  debugMode: boolean;
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

const mockDevices: DeviceData[] = [
  { name: "Mount", type: "Mount Simulator", connected: false },
  { name: "Camera 1", type: "CCD Simulator", connected: false },
  { name: "Focuser", type: "Focuser Simulator", connected: false },
  { name: "Filter Wheel", type: "Filter Simulator", connected: false },
];

const mockAdvancedSettings: AdvancedSettings = {
  updateInterval: 1000,
  connectionTimeout: 30,
  debugMode: false,
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
              device.connected = true;
              resolve(device);
            } else {
              throw new Error("Device not found");
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
              device.connected = false;
              resolve(device);
            } else {
              throw new Error("Device not found");
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
