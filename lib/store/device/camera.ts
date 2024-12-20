import { create } from "zustand";
import { cameraApi } from "@/services/device/camera";
import logger from "@/lib/logger";

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
  fetchStatus: () => Promise<void>;
}

export interface CameraStatus {
  status: string;
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
  isConnected: boolean;
}

export const useCameraStore = create<CameraState>((set, get) => ({
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
  fetchStatus: async () => {
    try {
      const status = await cameraApi.getStatus();
      set({
        exposure: status.exposure ?? 0,
        gain: status.gain ?? 0, 
        iso: status.iso ?? 100,
        offset: status.offset ?? 0,
        binning: status.binning ?? 1,
        coolerOn: status.coolerOn ?? false,
        temperature: status.temperature ?? 20,
        power: status.power ?? 0,
        targetTemperature: status.targetTemperature ?? 0,
        targetCoolingPower: status.targetCoolingPower ?? 0,
        isConnected: status.isConnected ?? false
      });
    } catch (e) {
      logger.error("Failed to fetch camera status:", e);
      // Set default values on error
      set({
        exposure: 0,
        gain: 0,
        iso: 100, 
        offset: 0,
        binning: 1,
        coolerOn: false,
        temperature: 20,
        power: 0,
        targetTemperature: 0,
        targetCoolingPower: 0,
        isConnected: false
      });
    }
  },
}));
