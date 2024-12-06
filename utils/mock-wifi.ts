import { WiFiNetwork } from "@/types/wifi";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockNetworks: WiFiNetwork[] = [
  {
    id: "1",
    name: "NJUPT-CHINANET",
    status: "开放式",
    isConnected: false,
    signalStrength: 90,
    isSecure: false,
    frequency: "2.4GHz",
    lastConnected: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    name: "NJUPT",
    signalStrength: 80,
    isSecure: true,
    frequency: "5GHz",
    lastConnected: "2023-06-14T15:45:00Z",
  },
  {
    id: "3",
    name: "NJUPT-CMCC",
    signalStrength: 70,
    isSecure: true,
    frequency: "2.4GHz",
  },
  {
    id: "4",
    name: "ChinaNet-FE61",
    signalStrength: 60,
    isSecure: true,
    frequency: "5GHz",
  },
];

export const mockWifiService = {
  getNetworks: async (): Promise<WiFiNetwork[]> => {
    await delay(1000); // Simulate network delay
    return mockNetworks;
  },

  connectToNetwork: async (networkId: string): Promise<WiFiNetwork> => {
    await delay(1500); // Simulate connection delay
    const network = mockNetworks.find((n) => n.id === networkId);
    if (!network) {
      throw new Error("Network not found");
    }
    return {
      ...network,
      isConnected: true,
      lastConnected: new Date().toISOString(),
    };
  },

  disconnectFromNetwork: async (): Promise<void> => {
    await delay(1000); // Simulate disconnection delay
  },
};
