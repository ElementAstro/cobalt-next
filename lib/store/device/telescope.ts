import { create } from "zustand";

interface MountState {
  parkSwitch: boolean;
  homeSwitch: boolean;
  trackSwitch: boolean;
  speedNum: number;
  speedTotalNum: number[];
  isIdle: boolean;
  isConnected: boolean;
  nightMode: boolean;
  currentRA: number;
  currentDec: number;
  currentAz: number;
  currentAlt: number;
  setCurrentRA: (ra: number) => void;
  setCurrentDec: (dec: number) => void;
  setCurrentAz: (az: number) => void;
  setCurrentAlt: (alt: number) => void;
  toggleParkSwitch: () => void;
  toggleHomeSwitch: () => void;
  toggleTrackSwitch: () => void;
  incrementSpeed: () => void;
  decrementSpeed: () => void;
  setSpeedTotalNum: (nums: number[]) => void;
  setIsIdle: (idle: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  toggleNightMode: () => void;
}

export const useMountStore = create<MountState>((set) => ({
  parkSwitch: false,
  homeSwitch: false,
  trackSwitch: false,
  speedNum: 0,
  speedTotalNum: [],
  isIdle: true,
  isConnected: true,
  nightMode: false,
  currentRA: 0,
  currentDec: 0,
  currentAz: 0,
  currentAlt: 0,
  setCurrentRA: (ra) => set({ currentRA: ra }),
  setCurrentDec: (dec) => set({ currentDec: dec }),
  setCurrentAz: (az) => set({ currentAz: az }),
  setCurrentAlt: (alt) => set({ currentAlt: alt }),
  toggleParkSwitch: () => set((state) => ({ parkSwitch: !state.parkSwitch })),
  toggleHomeSwitch: () => set((state) => ({ homeSwitch: !state.homeSwitch })),
  toggleTrackSwitch: () =>
    set((state) => ({ trackSwitch: !state.trackSwitch })),
  incrementSpeed: () =>
    set((state) => ({
      speedNum: Math.min(state.speedNum + 1, state.speedTotalNum.length - 1),
    })),
  decrementSpeed: () =>
    set((state) => ({ speedNum: Math.max(state.speedNum - 1, 0) })),
  setSpeedTotalNum: (nums) => set({ speedTotalNum: nums }),
  setIsIdle: (idle) => set({ isIdle: idle }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  toggleNightMode: () => set((state) => ({ nightMode: !state.nightMode })),
}));
