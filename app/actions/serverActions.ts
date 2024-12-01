"use server";

import { revalidatePath } from "next/cache";

type DeviceCategory =
  | "camera"
  | "mount"
  | "focuser"
  | "filterWheel"
  | "powerManagement"
  | "guider"
  | "solver";

interface Driver {
  id: string;
  name: string;
  category: DeviceCategory;
}

interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  driverId: string;
}

export async function fetchConfigFiles(isMockMode: boolean) {
  if (isMockMode) {
    return [
      { id: "1", name: "Config 1" },
      { id: "2", name: "Config 2" },
    ];
  }
  // Implement actual API call here
  return []; // Add return statement to avoid undefined
}

export async function createConfigFile(
  config: { name: string; port: string },
  isMockMode: boolean
) {
  if (isMockMode) {
    return { id: "3", ...config };
  }
  // Implement actual API call here
  return null; // Add return statement to avoid undefined
}

export async function fetchDrivers(isMockMode: boolean): Promise<Driver[]> {
  if (isMockMode) {
    return [
      { id: "1", name: "ASCOM Camera Driver", category: "camera" },
      { id: "2", name: "ZWO ASI Camera Driver", category: "camera" },
      { id: "3", name: "ASCOM Mount Driver", category: "mount" },
      { id: "4", name: "Celestron Mount Driver", category: "mount" },
      { id: "5", name: "ASCOM Focuser Driver", category: "focuser" },
      { id: "6", name: "Pegasus FocusCube Driver", category: "focuser" },
      { id: "7", name: "ASCOM Filter Wheel Driver", category: "filterWheel" },
      { id: "8", name: "ZWO EFW Driver", category: "filterWheel" },
      { id: "9", name: "Pegasus UPB Driver", category: "powerManagement" },
      { id: "10", name: "PHD2 Guider Driver", category: "guider" },
      { id: "11", name: "ASTAP Solver Driver", category: "solver" },
    ];
  }
  // Implement actual API call here
  return []; // Add return statement to avoid undefined
}

export async function fetchDevices(
  driverId: string,
  isMockMode: boolean
): Promise<Device[]> {
  if (isMockMode) {
    const devices: { [key: string]: Device[] } = {
      "1": [
        { id: "1", name: "ASCOM Camera 1", category: "camera", driverId: "1" },
      ],
      "2": [
        {
          id: "2",
          name: "ZWO ASI294MM Pro",
          category: "camera",
          driverId: "2",
        },
      ],
      "3": [
        { id: "3", name: "ASCOM Mount 1", category: "mount", driverId: "3" },
      ],
      "4": [
        { id: "4", name: "Celestron AVX", category: "mount", driverId: "4" },
      ],
      "5": [
        {
          id: "5",
          name: "ASCOM Focuser 1",
          category: "focuser",
          driverId: "5",
        },
      ],
      "6": [
        {
          id: "6",
          name: "Pegasus FocusCube 2",
          category: "focuser",
          driverId: "6",
        },
      ],
      "7": [
        {
          id: "7",
          name: "ASCOM Filter Wheel 1",
          category: "filterWheel",
          driverId: "7",
        },
      ],
      "8": [
        {
          id: "8",
          name: "ZWO EFW 7x36mm",
          category: "filterWheel",
          driverId: "8",
        },
      ],
      "9": [
        {
          id: "9",
          name: "Pegasus UPB v2",
          category: "powerManagement",
          driverId: "9",
        },
      ],
      "10": [
        { id: "10", name: "PHD2 Guider", category: "guider", driverId: "10" },
      ],
      "11": [
        { id: "11", name: "ASTAP Solver", category: "solver", driverId: "11" },
      ],
    };
    return devices[driverId] || [];
  }
  // Implement actual API call here
  return []; // Add return statement to avoid undefined
}

export async function startServer(config: any, isMockMode: boolean) {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    return { success: true };
  }
  // Implement actual API call here
  return { success: false }; // Add return statement to avoid undefined
}
