import { create } from "zustand";

export interface TempDataPoint {
  time: string;
  temperature: number;
}

interface CameraState {
  exposure: number;
  gain: number;
  iso: number;
  offset: number;
  binning: number;
  coolerOn: boolean;
  temperature: number;
  power: number;
  targetTemperature: number;
  targetCoolingPower: number;
  temperatureHistory: TempDataPoint[];
  isConnected: boolean;
  isRecording: boolean;
  setExposure: (value: number) => void;
  setGain: (value: number) => void;
  setISO: (value: number) => void;
  setOffset: (value: number) => void;
  setBinning: (value: number) => void;
  toggleCooler: () => void;
  setTemperature: (value: number) => void;
  setCurrentCoolingPower: (value: number) => void;
  setTargetTemperature: (value: number) => void;
  setTargetCoolingPower: (value: number) => void;
  addTemperatureHistory: (value: TempDataPoint) => void;
  setConnected: (connected: boolean) => void;
  toggleRecording: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  exposure: 1,
  gain: 0,
  iso: 0,
  offset: 0,
  binning: 1,
  coolerOn: false,
  temperature: 20,
  power: 0,
  targetTemperature: 20,
  targetCoolingPower: 0,
  temperatureHistory: [],
  isConnected: false,
  isRecording: false,
  setExposure: (value) => set({ exposure: value }),
  setGain: (value) => set({ gain: value }),
  setISO: (value) => set({ iso: value }),
  setOffset: (value) => set({ offset: value }),
  setBinning: (value) => set({ binning: value }),
  toggleCooler: () => set((state) => ({ coolerOn: !state.coolerOn })),
  setTemperature: (value) => set({ temperature: value }),
  setCurrentCoolingPower: (value) => set({ power: value }),
  setTargetTemperature: (value) => set({ targetTemperature: value }),
  setTargetCoolingPower: (value) => set({ targetCoolingPower: value }),
  addTemperatureHistory: (value) =>
    set((state) => ({
      temperatureHistory: [...state.temperatureHistory, value],
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
}));
