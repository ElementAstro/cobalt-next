import { NetworkSettings } from "@/lib/store/hotspot";

export const mockNetworkData = async (): Promise<Partial<NetworkSettings>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    ssid: `Mock_Network_${Math.floor(Math.random() * 1000)}`,
    password: `mock${Math.random().toString(36).slice(2, 10)}`,
    frequency: Math.random() > 0.5 ? "2.4 GHz" : "5 GHz",
    channel: Math.floor(Math.random() * 11) + 1,
    security: ["WPA2", "WPA3", "Open"][Math.floor(Math.random() * 3)] as
      | "WPA2"
      | "WPA3"
      | "Open",
    maxClients: Math.floor(Math.random() * 10) + 1,
    autoShutdownTime: Math.floor(Math.random() * 12) * 5,
    connectedDevices: Math.floor(Math.random() * 8),
    internetSharing: ["以太网", "Wi-Fi", "移动数据"][
      Math.floor(Math.random() * 3)
    ],
    shareTo: Math.random() > 0.5 ? "WLAN" : "蓝牙",
    maxDevices: 10,
  };
};
