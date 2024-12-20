import { create } from "zustand";

interface GuiderInfo {
  pixelScale: number;
  state: string;
  showCorrections: boolean;
  phd2Profile: string;
  filters: string[];
  description: string;
  currentFilter: string; // 新增：当前滤镜
  exposureTime: number; // 新增：曝光时间
  calibrationStatus: string; // 新增：校准状态
  guidingAccuracy: number; // 新增：导星精度
  isCalibrating: boolean; // 新增：是否正在校准
  lastError: string | null; // 新增：最后一次错误信息
  guidingStats: {          // 新增：导星统计信息
    rms: number;
    peak: number;
    total: number;
  };
}

interface GuiderSettings {
  ditherPixels: number;
  settleTimeout: number;
  phd2Profile: string;
  exposureTime: number; // 新增：曝光时间
  calibrationSteps: number; // 新增：校准步骤
}

interface GuiderState {
  guiderInfo: GuiderInfo;
  selectedFilter: string;
  isConnected: boolean;
  guidingHistory: string[];
  setSelectedFilter: (filter: string) => void;
  changeFilter: (filterIndex: number) => void;
  startGuiding: () => void;
  stopGuiding: () => void;
  dither: (pixels: number) => void;
  setGuiderSettings: (settings: Partial<GuiderSettings>) => void;
  setConnected: (connected: boolean) => void;
  addGuidingHistory: (action: string) => void;
  setExposureTime: (time: number) => void; // 新增：设置曝光时间
  setCalibrationStatus: (status: string) => void; // 新增：设置校准状态
  setGuidingAccuracy: (accuracy: number) => void; // 新增：设置导星精度
  setCalibrating: (calibrating: boolean) => void; // 新增：设置是否正在校准
  setLastError: (error: string | null) => void; // 新增：设置最后一次错误信息
  setGuidingStats: (stats: GuiderInfo['guidingStats']) => void; // 新增：设置导星统计信息
}

export const useGuiderStore = create<GuiderState>((set) => ({
  guiderInfo: {
    pixelScale: 1.23,
    state: "Idle",
    showCorrections: false,
    phd2Profile: "default",
    filters: ["Red", "Green", "Blue", "Luminance"],
    description: "高精度导星仪，支持多种导星模式。",
    currentFilter: "Red", // 默认当前滤镜
    exposureTime: 1.0, // 默认曝光时间
    calibrationStatus: "Not Calibrated", // 默认校准状态
    guidingAccuracy: 0.0, // 默认导星精度
    isCalibrating: false, // 默认是否正在校准
    lastError: null, // 默认最后一次错误信息
    guidingStats: { // 默认导星统计信息
      rms: 0.0,
      peak: 0.0,
      total: 0.0,
    },
  },
  selectedFilter: "1",
  isConnected: false,
  guidingHistory: [],
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  changeFilter: (filterIndex) =>
    set((state) => ({
      guiderInfo: {
        ...state.guiderInfo,
        currentFilter: state.guiderInfo.filters[filterIndex - 1],
      },
    })),
  startGuiding: () =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, state: "Guiding" },
    })),
  stopGuiding: () =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, state: "Idle" },
    })),
  dither: (pixels) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo },
      guidingHistory: [...state.guidingHistory, `Dithered by ${pixels} pixels`],
    })),
  setGuiderSettings: (settings) =>
    set((state) => ({
      guiderInfo: {
        ...state.guiderInfo,
        ...settings,
      },
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  addGuidingHistory: (action) =>
    set((state) => ({
      guidingHistory: [...state.guidingHistory, action],
    })),
  setExposureTime: (time) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, exposureTime: time },
    })),
  setCalibrationStatus: (status) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, calibrationStatus: status },
    })),
  setGuidingAccuracy: (accuracy) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, guidingAccuracy: accuracy },
    })),
  setCalibrating: (calibrating) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, isCalibrating: calibrating },
    })),
  setLastError: (error) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, lastError: error },
    })),
  setGuidingStats: (stats) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, guidingStats: stats },
    })),
}));
