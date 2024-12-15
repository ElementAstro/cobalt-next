import { create } from "zustand";
import type {
  MeasurementState,
  HighFrequencyMeasurement,
  StarPosition,
  CustomOptions,
} from "@/types/guiding/config";

interface Store {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  measurePeriodical: boolean;
  setMeasurePeriodical: (measurePeriodical: boolean) => void;
  customOptions: CustomOptions;
  setCustomOptions: (customOptions: Partial<CustomOptions>) => void;
  measurements: MeasurementState;
  setMeasurements: (measurements: Partial<MeasurementState>) => void;
  highFrequency: HighFrequencyMeasurement;
  setHighFrequency: (highFrequency: Partial<HighFrequencyMeasurement>) => void;
  starPosition: StarPosition;
  setStarPosition: (starPosition: Partial<StarPosition>) => void;
}

export const useStore = create<Store>((set) => ({
  isRunning: false,
  setIsRunning: (isRunning) => set({ isRunning }),
  measurePeriodical: false,
  setMeasurePeriodical: (measurePeriodical) => set({ measurePeriodical }),
  customOptions: {
    snrThreshold: 10,
    measurementInterval: 1000,
    autoStopDuration: 3600000,
  },
  setCustomOptions: (customOptions) =>
    set((state) => ({
      customOptions: { ...state.customOptions, ...customOptions },
    })),
  measurements: {
    startTime: "",
    exposureTime: "",
    snr: 0,
    elapsedTime: "",
    starCenter: "",
    sampleCount: 0,
  },
  setMeasurements: (measurements) =>
    set((state) => ({
      measurements: { ...state.measurements, ...measurements },
    })),
  highFrequency: {
    redRMS: 0,
    greenRMS: 0,
    blueRMS: 0,
  },
  setHighFrequency: (highFrequency) =>
    set((state) => ({
      highFrequency: { ...state.highFrequency, ...highFrequency },
    })),
  starPosition: {
    redPeak: 0,
    greenPeak: 0,
    bluePeak: 0,
    driftRate: 0,
    maxDriftRate: 0,
    noStarExposureTime: 0,
    driftSpeed: 0,
    periodicalError: 0,
    polarAxisError: 0,
  },
  setStarPosition: (starPosition) =>
    set((state) => ({
      starPosition: { ...state.starPosition, ...starPosition },
    })),
}));
