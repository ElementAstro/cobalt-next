import { create } from "zustand";

interface DomeState {
  azimuth: number;
  shutterStatus: "open" | "closed" | "opening" | "closing";
  isConnected: boolean;
  isSynced: boolean;
  isSlewing: boolean;
  error: string | null;
  setAzimuth: (azimuth: number) => void;
  setShutterStatus: (status: "open" | "closed" | "opening" | "closing") => void;
  setConnected: (isConnected: boolean) => void;
  setSynced: (isSynced: boolean) => void;
  setSlewing: (isSlewing: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDomeStore = create<DomeState>((set) => ({
  azimuth: 0,
  shutterStatus: "closed",
  isConnected: false,
  isSynced: false,
  isSlewing: false,
  error: null,
  setAzimuth: (azimuth) => set({ azimuth }),
  setShutterStatus: (status) => set({ shutterStatus: status }),
  setConnected: (isConnected) => set({ isConnected }),
  setSynced: (isSynced) => set({ isSynced }),
  setSlewing: (isSlewing) => set({ isSlewing }),
  setError: (error) => set({ error }),
}));
