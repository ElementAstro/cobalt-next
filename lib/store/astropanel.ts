import { create } from "zustand";
import { CelestialData } from "@/types/astropanel";
import mockData from "@/utils/mock-astropanel";

interface Store {
  celestialData: CelestialData;
  isMockMode: boolean;
  activeTab: string;
  isConnected: boolean;
  lastUpdate: string;
  setActiveTab: (tab: string) => void;
  toggleMockMode: () => void;
  updateCelestialData: (data: CelestialData) => void;
  setIsConnected: (status: boolean) => void;
  setLastUpdate: (time: string) => void;
}

const useStore = create<Store>((set) => ({
  celestialData: {} as CelestialData,
  isMockMode: false,
  activeTab: "polaris",
  isConnected: false,
  lastUpdate: "",
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleMockMode: () =>
    set((state) => ({
      isMockMode: !state.isMockMode,
      celestialData: state.isMockMode ? ({} as CelestialData) : mockData,
    })),
  updateCelestialData: (data) => set({ celestialData: data }),
  setIsConnected: (status) => set({ isConnected: status }),
  setLastUpdate: (time) => set({ lastUpdate: time }),
}));

export default useStore;
