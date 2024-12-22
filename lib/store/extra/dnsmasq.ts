import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DnsmasqConfig {
  listenAddress: string;
  port: string;
  domainNeeded: boolean;
  bogusPriv: boolean;
  expandHosts: boolean;
  noCacheNegative: boolean;
  strictOrder: boolean;
  noHosts: boolean;
  dnsServers: string;
  cacheSize: string;
}

interface DnsmasqStore {
  config: DnsmasqConfig;
  isAdvancedOpen: boolean;
  updateConfig: (newConfig: Partial<DnsmasqConfig>) => void;
  toggleAdvanced: () => void;
  saveConfig: () => Promise<void>;
}

export const useDnsmasqStore = create<DnsmasqStore>()(
  persist(
    (set, get) => ({
      config: {
        listenAddress: "127.0.0.1",
        port: "53",
        domainNeeded: true,
        bogusPriv: true,
        expandHosts: true,
        noCacheNegative: false,
        strictOrder: false,
        noHosts: false,
        dnsServers: "8.8.8.8,8.8.4.4",
        cacheSize: "150",
      },
      isAdvancedOpen: false,
      updateConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
      toggleAdvanced: () =>
        set((state) => ({ isAdvancedOpen: !state.isAdvancedOpen })),
      saveConfig: async () => {
        const { config } = get();
        console.log("Saving config:", config);
        // Here you would typically make an API call to save the config
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      },
    }),
    {
      name: "dnsmasq-storage",
    }
  )
);
