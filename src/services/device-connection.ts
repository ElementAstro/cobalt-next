import { useState, useCallback } from "react";
import { ProfileData,DeviceInfo, AdvancedSettings } from "@/types/device";

// Mock data
const mockProfileData: ProfileData = {
  name: "测试",
  autoConnect: true,
  mode: "remote",
  host: "127.0.0.1",
  port: "7624",
  guiding: "internal",
  indiWebManager: false,
  protocol: "tcp",
  retry: 3,
};

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
    fetchAdvancedSettings,
    updateAdvancedSettings,
  };
}
