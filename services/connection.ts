import { useState, useCallback } from "react";
import api from "./axios";
import { DeviceData, AdvancedSettings } from "@/types/connection";
import logger from "@/lib/logger";

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

export function createApiService(useMock: boolean) {
  const fetchProfileData = async (): Promise<ProfileData> => {
    logger.info("Fetching profile data...");
    if (useMock) {
      logger.info("Using mock data for profile");
      return new Promise((resolve) =>
        setTimeout(() => {
          logger.info("Returning mock profile data");
          resolve(mockProfileData);
        }, 500)
      );
    }
    logger.info("Fetching profile data from API");
    try {
      const response = await api.request<ProfileData>({
        url: API_ENDPOINTS.profile,
        method: "GET",
      });
      logger.info("Profile data fetched successfully");
      return response;
    } catch (error) {
      logger.error("Failed to fetch profile data:", error);
      throw new Error("Failed to fetch profile data");
    }
  };

  const updateProfileData = async (
    data: Partial<ProfileData>
  ): Promise<ProfileData> => {
    logger.info("Updating profile data...", data);
    if (useMock) {
      logger.info("Using mock data for profile update");
      return new Promise((resolve) =>
        setTimeout(() => {
          logger.info("Returning updated mock profile data");
          resolve({ ...mockProfileData, ...data });
        }, 500)
      );
    }
    logger.info("Updating profile data via API");
    try {
      const response = await api.request<ProfileData>({
        url: API_ENDPOINTS.profile,
        method: "PUT",
        data,
      });
      logger.info("Profile data updated successfully");
      return response;
    } catch (error) {
      logger.error("Failed to update profile data:", error);
      throw new Error("Failed to update profile data");
    }
  };

  const fetchDevices = async (): Promise<DeviceData[]> => {
    logger.info("Fetching devices...");
    if (useMock) {
      logger.info("Using mock data for devices");
      return new Promise((resolve) =>
        setTimeout(() => {
          logger.info("Returning mock devices data");
          resolve(mockDevices);
        }, 500)
      );
    }
    logger.info("Fetching devices data from API");
    try {
      const response = await api.request<DeviceData[]>({
        url: API_ENDPOINTS.devices,
        method: "GET",
      });
      logger.info("Devices data fetched successfully");
      return response;
    } catch (error) {
      logger.error("Failed to fetch devices data:", error);
      throw new Error("Failed to fetch devices data");
    }
  };

  const connectDevice = async (deviceName: string): Promise<DeviceData> => {
    logger.info(`Connecting to device: ${deviceName}...`);
    if (useMock) {
      logger.info("Using mock data for device connection");
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
            logger.info("Returning updated mock device data", updatedDevice);
            resolve(updatedDevice);
          } else {
            logger.error("Device not found");
            throw new Error("设备未找到");
          }
        }, 1000);
      });
    }
    logger.info("Connecting to device via API");
    try {
      const response = await api.request<DeviceData>({
        url: `${API_ENDPOINTS.devices}/${deviceName}/connect`,
        method: "POST",
      });
      logger.info("Device connected successfully");
      return response;
    } catch (error) {
      logger.error("Failed to connect to device:", error);
      throw new Error("Failed to connect to device");
    }
  };

  const disconnectDevice = async (deviceName: string): Promise<DeviceData> => {
    logger.info(`Disconnecting from device: ${deviceName}...`);
    if (useMock) {
      logger.info("Using mock data for device disconnection");
      return new Promise((resolve) => {
        setTimeout(() => {
          const device = mockDevices.find((d) => d.name === deviceName);
          if (device) {
            const updatedDevice = {
              ...device,
              connected: false,
              status: "offline" as const,
            };
            logger.info("Returning updated mock device data", updatedDevice);
            resolve(updatedDevice);
          } else {
            logger.error("Device not found");
            throw new Error("设备未找到");
          }
        }, 1000);
      });
    }
    logger.info("Disconnecting from device via API");
    try {
      const response = await api.request<DeviceData>({
        url: `${API_ENDPOINTS.devices}/${deviceName}/disconnect`,
        method: "POST",
      });
      logger.info("Device disconnected successfully");
      return response;
    } catch (error) {
      logger.error("Failed to disconnect from device:", error);
      throw new Error("Failed to disconnect from device");
    }
  };

  const fetchAdvancedSettings = async (): Promise<AdvancedSettings> => {
    logger.info("Fetching advanced settings...");
    if (useMock) {
      logger.info("Using mock data for advanced settings");
      return new Promise((resolve) =>
        setTimeout(() => {
          logger.info("Returning mock advanced settings data");
          resolve(mockAdvancedSettings);
        }, 500)
      );
    }
    logger.info("Fetching advanced settings data from API");
    try {
      const response = await api.request<AdvancedSettings>({
        url: API_ENDPOINTS.advancedSettings,
        method: "GET",
      });
      logger.info("Advanced settings data fetched successfully");
      return response;
    } catch (error) {
      logger.error("Failed to fetch advanced settings data:", error);
      throw new Error("Failed to fetch advanced settings data");
    }
  };

  const updateAdvancedSettings = async (
    data: Partial<AdvancedSettings>
  ): Promise<AdvancedSettings> => {
    logger.info("Updating advanced settings...", data);
    if (useMock) {
      logger.info("Using mock data for advanced settings update");
      return new Promise((resolve) =>
        setTimeout(() => {
          logger.info("Returning updated mock advanced settings data");
          resolve({ ...mockAdvancedSettings, ...data });
        }, 500)
      );
    }
    logger.info("Updating advanced settings via API");
    try {
      const response = await api.request<AdvancedSettings>({
        url: API_ENDPOINTS.advancedSettings,
        method: "PUT",
        data,
      });
      logger.info("Advanced settings updated successfully");
      return response;
    } catch (error) {
      logger.error("Failed to update advanced settings:", error);
      throw new Error("Failed to update advanced settings");
    }
  };

  return {
    fetchProfileData,
    updateProfileData,
    fetchDevices,
    connectDevice,
    disconnectDevice,
    fetchAdvancedSettings,
    updateAdvancedSettings,
  };
}

export function useApiService() {
  const [useMock, setUseMock] = useState(true);

  const toggleMockMode = useCallback(() => {
    logger.info("Toggling mock mode...");
    setUseMock((prev) => !prev);
    logger.info(`Mock mode is now ${!useMock}`);
  }, [useMock]);

  const apiService = createApiService(useMock);

  return {
    useMock,
    toggleMockMode,
    ...apiService,
  };
}
