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

// Mock device data with updated interface
const mockDevices: DeviceData[] = [
  {
    id: "mount-01",
    name: "EQ6-R Pro Mount",
    type: "Mount",
    model: "EQ6-R Pro",
    connected: false,
    status: {
      isOnline: false,
      temperature: 25.0,
      humidity: 45.0,
      lastUpdate: "2023-07-01T10:00:00Z",
      batteryLevel: 100,
      signalStrength: 95,
    },
  },
  {
    id: "camera-01",
    name: "ZWO ASI294MM Pro",
    type: "Camera",
    model: "ASI294MM Pro",
    connected: false,
    status: {
      isOnline: false,
      temperature: -10.0,
      humidity: 20.0,
      lastUpdate: "2023-07-01T10:00:00Z",
      batteryLevel: 100,
      signalStrength: 98,
    },
  },
  {
    id: "focuser-01",
    name: "ZWO EAF",
    type: "Focuser",
    model: "EAF",
    connected: false,
    status: {
      isOnline: false,
      temperature: 22.0,
      humidity: 40.0,
      lastUpdate: "2023-07-01T10:00:00Z",
      batteryLevel: 95,
      signalStrength: 92,
    },
  },
  {
    id: "filterwheel-01",
    name: "ZWO EFW",
    type: "FilterWheel",
    model: "EFW 7x36mm",
    connected: false,
    status: {
      isOnline: false,
      temperature: 23.0,
      humidity: 42.0,
      lastUpdate: "2023-07-01T10:00:00Z",
      batteryLevel: 90,
      signalStrength: 94,
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
  maxConnections: 5,
  bufferSize: 1024,
  autoBackup: true,
  backupInterval: 24,
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
            };
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
