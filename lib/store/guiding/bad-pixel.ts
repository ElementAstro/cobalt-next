import { create } from "zustand";
import { BadPixelData, CustomOptions } from "@/types/guiding/bad-pixel";

interface BadPixelStore {
  data: BadPixelData;
  options: CustomOptions;
  setData: (data: Partial<BadPixelData>) => void;
  setOptions: (options: Partial<CustomOptions>) => void;
  resetCorrectionLevels: () => void;
  generateBadPixels: () => void;
  addBadPixel: (pixel: number) => void;
}

const initialData: BadPixelData = {
  timestamp: new Date().toLocaleString(),
  simulator: "Simulator",
  mainFieldExposureTime: 15.0,
  mainFieldBrightness: 25,
  correctionLevelHot: 75,
  correctionLevelCold: 75,
  average: 27442.51,
  standardDeviation: 380.35,
  median: 27442,
  medianAbsoluteDeviation: 233,
  hotPixelCount: 1118,
  coldPixelCount: 1113,
};

const initialOptions: CustomOptions = {
  theme: "light",
  language: "zh",
  autoRefresh: false,
  refreshInterval: 5000,
};

export const useBadPixelStore = create<BadPixelStore>((set) => ({
  data: initialData,
  options: initialOptions,
  setData: (newData) =>
    set((state) => ({ data: { ...state.data, ...newData } })),
  setOptions: (newOptions) =>
    set((state) => ({ options: { ...state.options, ...newOptions } })),
  resetCorrectionLevels: () =>
    set((state) => ({
      data: {
        ...state.data,
        correctionLevelHot: 75,
        correctionLevelCold: 75,
      },
    })),
  generateBadPixels: () =>
    set((state) => ({
      data: {
        ...state.data,
        hotPixelCount: Math.floor(Math.random() * 2000),
        coldPixelCount: Math.floor(Math.random() * 2000),
        timestamp: new Date().toLocaleString(),
      },
    })),
  addBadPixel: (pixel) =>
    set((state) => ({
      data: {
        ...state.data,
        hotPixelCount: state.data.hotPixelCount + 1,
        timestamp: new Date().toLocaleString(),
      },
    })),
}));
