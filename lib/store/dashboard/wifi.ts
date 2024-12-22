import { create } from "zustand";

export interface NetworkSpeed {
  download: number;
  upload: number;
  timestamp: number;
}

export interface NetworkInfo {
  type: string;
  latency: number;
  dataUsage: {
    download: number;
    upload: number;
  };
}

interface NetworkStore {
  status: "online" | "offline" | "slow";
  currentSpeed: NetworkSpeed;
  speedHistory: NetworkSpeed[];
  networkInfo: NetworkInfo;
  updateStatus: (newStatus: "online" | "offline" | "slow") => void;
  updateSpeed: (newSpeed: NetworkSpeed) => void;
  updateNetworkInfo: (info: Partial<NetworkInfo>) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  status: "online",
  currentSpeed: { download: 0, upload: 0, timestamp: Date.now() },
  speedHistory: [],
  networkInfo: {
    type: "unknown",
    latency: 0,
    dataUsage: {
      download: 0,
      upload: 0,
    },
  },
  updateStatus: (newStatus) => set({ status: newStatus }),
  updateSpeed: (newSpeed) =>
    set((state) => ({
      currentSpeed: newSpeed,
      speedHistory: [...state.speedHistory.slice(-11), newSpeed],
    })),
  updateNetworkInfo: (info) =>
    set((state) => ({
      networkInfo: { ...state.networkInfo, ...info },
    })),
}));
