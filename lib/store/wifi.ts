import { create } from "zustand";
import { persist } from "zustand/middleware";

import { WiFiNetwork } from "@/types/wifi";

interface WifiState {
  isWifiOn: boolean;
  networks: WiFiNetwork[];
  connectedNetwork: string | null;
  isMockMode: boolean;
  isLoading: boolean;
  autoJoinNetworks: boolean;
  notifyAvailableNetworks: boolean;
  askToJoinNetworks: boolean;
  preferredBand: "2.4GHz" | "5GHz" | "Auto";
  setWifiOn: (isOn: boolean) => void;
  setNetworks: (networks: WiFiNetwork[]) => void;
  connectToNetwork: (networkId: string) => void;
  disconnectFromNetwork: () => void;
  toggleMockMode: () => void;
  setLoading: (isLoading: boolean) => void;
  setAutoJoinNetworks: (autoJoin: boolean) => void;
  setNotifyAvailableNetworks: (notify: boolean) => void;
  setAskToJoinNetworks: (ask: boolean) => void;
  setPreferredBand: (band: "2.4GHz" | "5GHz" | "Auto") => void;
  recentNetworks: WiFiNetwork[];
}

export const useWifiStore = create<WifiState>()(
  persist(
    (set) => ({
      isWifiOn: true,
      networks: [],
      connectedNetwork: null,
      isMockMode: false,
      isLoading: false,
      autoJoinNetworks: true,
      notifyAvailableNetworks: true,
      askToJoinNetworks: false,
      preferredBand: "Auto",
      setWifiOn: (isOn) => set({ isWifiOn: isOn }),
      setNetworks: (networks) => set({ networks }),
      connectToNetwork: (networkId) => set({ connectedNetwork: networkId }),
      disconnectFromNetwork: () => set({ connectedNetwork: null }),
      toggleMockMode: () => set((state) => ({ isMockMode: !state.isMockMode })),
      setLoading: (isLoading) => set({ isLoading }),
      setAutoJoinNetworks: (autoJoin) => set({ autoJoinNetworks: autoJoin }),
      setNotifyAvailableNetworks: (notify) =>
        set({ notifyAvailableNetworks: notify }),
      setAskToJoinNetworks: (ask) => set({ askToJoinNetworks: ask }),
      setPreferredBand: (band) => set({ preferredBand: band }),
      recentNetworks: [],
    }),
    {
      name: "wifi-storage",
    }
  )
);
