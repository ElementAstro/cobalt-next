import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface BadPixelState {
  data: {
    timestamp: string;
    simulator: string;
    mainFieldExposureTime: number;
    mainFieldBrightness: number;
    average: number;
    standardDeviation: number;
    median: number;
    medianAbsoluteDeviation: number;
    hotPixelCount: number;
    coldPixelCount: number;
    width: number;
    height: number;
    hotPixels: number[];
    coldPixels: number[];
  };
  options: {
    theme: "light" | "dark";
    language: "zh" | "en";
    autoRefresh: boolean;
    refreshInterval: number;
    correctionLevelHot: number;
    correctionLevelCold: number;
  };
  setData: (data: Partial<BadPixelState["data"]>) => void;
  setOptions: (options: Partial<BadPixelState["options"]>) => void;
  resetCorrectionLevels: () => void;
  generateBadPixels: () => Promise<void>;
  addBadPixel: (pixel: number) => void;
}

export const useBadPixelStore = create<BadPixelState>()(
  devtools((set) => ({
    data: {
      timestamp: new Date().toISOString(),
      simulator: "ZWO ASI294MM Pro",
      mainFieldExposureTime: 1000,
      mainFieldBrightness: 100,
      average: 0,
      standardDeviation: 0,
      median: 0,
      medianAbsoluteDeviation: 0,
      hotPixelCount: 0,
      coldPixelCount: 0,
      width: 4144,
      height: 2822,
      hotPixels: [],
      coldPixels: [],
    },
    options: {
      theme: "dark",
      language: "zh",
      autoRefresh: false,
      refreshInterval: 5000,
      correctionLevelHot: 3,
      correctionLevelCold: 3,
    },
    setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
    setOptions: (options) =>
      set((state) => ({ options: { ...state.options, ...options } })),
    resetCorrectionLevels: () =>
      set((state) => ({
        options: {
          ...state.options,
          correctionLevelHot: 3,
          correctionLevelCold: 3,
        },
      })),
    generateBadPixels: async () => {
      // 模拟生成坏点数据
      const hotPixels = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * (4144 * 2822))
      );
      const coldPixels = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * (4144 * 2822))
      );
      set((state) => ({
        data: {
          ...state.data,
          hotPixels,
          coldPixels,
          hotPixelCount: hotPixels.length,
          coldPixelCount: coldPixels.length,
        },
      }));
    },
    addBadPixel: (pixel) =>
      set((state) => ({
        data: {
          ...state.data,
          hotPixels: [...state.data.hotPixels, pixel],
          hotPixelCount: state.data.hotPixels.length + 1,
        },
      })),
  }))
);
