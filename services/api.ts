import { useState, useCallback } from "react";

// Define types for our API responses
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

// Mock data
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

// API Service
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
    } else {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile data");
      return response.json();
    }
  }, [useMock]);

  const updateProfileData = useCallback(
    async (data: Partial<ProfileData>): Promise<ProfileData> => {
      if (useMock) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ...mockProfileData, ...data }), 500)
        );
      } else {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update profile data");
        return response.json();
      }
    },
    [useMock]
  );

  const fetchDevices = useCallback(async (): Promise<DeviceData[]> => {
    if (useMock) {
      return new Promise((resolve) =>
        setTimeout(() => resolve(mockDevices), 500)
      );
    } else {
      const response = await fetch("/api/devices");
      if (!response.ok) throw new Error("Failed to fetch devices");
      return response.json();
    }
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
      } else {
        const response = await fetch(`/api/devices/${deviceName}/connect`, {
          method: "POST",
        });
        if (!response.ok) throw new Error("Failed to connect device");
        return response.json();
      }
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
      } else {
        const response = await fetch(`/api/devices/${deviceName}/disconnect`, {
          method: "POST",
        });
        if (!response.ok) throw new Error("Failed to disconnect device");
        return response.json();
      }
    },
    [useMock]
  );

  const fetchAdvancedSettings =
    useCallback(async (): Promise<AdvancedSettings> => {
      if (useMock) {
        return new Promise((resolve) =>
          setTimeout(() => resolve(mockAdvancedSettings), 500)
        );
      } else {
        const response = await fetch("/api/settings/advanced");
        if (!response.ok) throw new Error("Failed to fetch advanced settings");
        return response.json();
      }
    }, [useMock]);

  const updateAdvancedSettings = useCallback(
    async (data: Partial<AdvancedSettings>): Promise<AdvancedSettings> => {
      if (useMock) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ...mockAdvancedSettings, ...data }), 500)
        );
      } else {
        const response = await fetch("/api/settings/advanced", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update advanced settings");
        return response.json();
      }
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
