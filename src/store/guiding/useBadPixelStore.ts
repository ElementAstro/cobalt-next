import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PixelData {
  width: number;
  height: number;
  hotPixels: number[];
  coldPixels: number[];
  correctionLevels: {
    hot: number;
    cold: number;
  };
}

interface BadPixelOptions {
  language: "zh" | "en";
  theme: "light" | "dark";
  autoRefresh: boolean;
  refreshInterval: number;
  displayMode: "scatter" | "heatmap" | "grid";
  showOverlay: boolean;
  filterThreshold: number;
  darkFrameEnabled: boolean;
  autoSave: boolean;
  saveInterval: number;
}

interface BadPixelStore {
  data: PixelData;
  options: BadPixelOptions;
  setData: (data: Partial<PixelData>) => void;
  setOptions: (options: Partial<BadPixelOptions>) => void;
  resetCorrectionLevels: () => void;
  generateBadPixels: () => Promise<void>;
  addBadPixel: (pixel: number) => void;
  removeBadPixel: (pixel: number) => void;
  undoHistory: () => void;
  redoHistory: () => void;
}

const initialData: PixelData = {
  width: 1920,
  height: 1080,
  hotPixels: [],
  coldPixels: [],
  correctionLevels: {
    hot: 0.8,
    cold: 0.2,
  },
};

const initialOptions: BadPixelOptions = {
  language: "zh",
  theme: "dark",
  autoRefresh: false,
  refreshInterval: 5000,
  displayMode: "scatter",
  showOverlay: true,
  filterThreshold: 5.0,
  darkFrameEnabled: false,
  autoSave: false,
  saveInterval: 30000,
};

export const useBadPixelStore = create<BadPixelStore>()(
  devtools((set, get) => ({
    data: initialData,
    options: initialOptions,

    setData: (newData) => {
      set((state) => ({
        data: { ...state.data, ...newData },
      }));
    },

    setOptions: (newOptions) => {
      set((state) => ({
        options: { ...state.options, ...newOptions },
      }));
    },

    resetCorrectionLevels: () => {
      set((state) => ({
        data: {
          ...state.data,
          correctionLevels: {
            hot: 0.8,
            cold: 0.2,
          },
        },
      }));
    },

    generateBadPixels: async () => {
      // 模拟坏点生成过程
      return new Promise((resolve) => {
        setTimeout(() => {
          const hotPixels = Array.from({ length: 50 }, () =>
            Math.floor(Math.random() * (1920 * 1080))
          );
          const coldPixels = Array.from({ length: 30 }, () =>
            Math.floor(Math.random() * (1920 * 1080))
          );

          set((state) => ({
            data: {
              ...state.data,
              hotPixels,
              coldPixels,
            },
          }));
          resolve();
        }, 1000);
      });
    },

    addBadPixel: (pixel: number) => {
      set((state) => {
        const hotPixels = [...state.data.hotPixels];
        if (!hotPixels.includes(pixel)) {
          hotPixels.push(pixel);
        }
        return {
          data: {
            ...state.data,
            hotPixels,
          },
        };
      });
    },

    removeBadPixel: (pixel: number) => {
      set((state) => {
        const hotPixels = state.data.hotPixels.filter((p) => p !== pixel);
        const coldPixels = state.data.coldPixels.filter((p) => p !== pixel);
        return {
          data: {
            ...state.data,
            hotPixels,
            coldPixels,
          },
        };
      });
    },

    undoHistory: () => {
      // 实现撤销功能
    },

    redoHistory: () => {
      // 实现重做功能
    },
  }))
);
