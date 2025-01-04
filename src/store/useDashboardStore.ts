import { create } from "zustand";

// Zustand store
export interface ExposureSettings {
  shutterSpeed: string;
  iso: string;
  aperture: string;
  focusPoint: string;
  filterType: string;
  exposureTime: number;
  exposureMode: string;
  whiteBalance: string;
  gain: number;
  offset: number;
  binning: string;
}

export interface State {
  exposureTime: number;
  burstMode: boolean;
  burstCount: number;
  intervalMode: boolean;
  intervalTime: number;
  exposureMode: string;
  whiteBalance: string;
  iso: number;
  aperture: number;
  focusPoint: number;
  filterType: string;
  gain: number;
  offset: number;
  binning: string;
  resetSettings: (settings: ExposureSettings) => void;
  setExposureTime: (value: number) => void;
  toggleBurstMode: (value: boolean) => void;
  setBurstCount: (value: number) => void;
  toggleIntervalMode: (value: boolean) => void;
  setIntervalTime: (value: number) => void;
  setExposureMode: (value: string) => void;
  setWhiteBalance: (value: string) => void;
  setISO: (value: number) => void;
  setAperture: (value: number) => void;
  setFocusPoint: (value: number) => void;
  setFilterType: (value: string) => void;
  setGain: (value: number) => void;
  setOffset: (value: number) => void;
  setBinning: (value: string) => void;
}

export const useExposureStore = create<State>((set) => ({
  exposureTime: 60,
  burstMode: false,
  burstCount: 3,
  intervalMode: false,
  intervalTime: 60,
  exposureMode: "Manual",
  whiteBalance: "Auto",
  iso: 100,
  aperture: 2.8,
  focusPoint: 50,
  filterType: "None",
  gain: 0,
  offset: 0,
  binning: "1x1",
  resetSettings: (settings: ExposureSettings) =>
    set({
      exposureTime: settings.exposureTime,
      burstMode: false,
      burstCount: 3,
      intervalMode: false,
      intervalTime: 60,
      exposureMode: settings.exposureMode || "Manual",
      whiteBalance: settings.whiteBalance || "Auto",
      iso: parseInt(settings.iso) || 100,
      aperture: parseFloat(settings.aperture) || 2.8,
      focusPoint: parseInt(settings.focusPoint) || 50,
      filterType: settings.filterType || "None",
      gain: settings.gain || 0,
      offset: settings.offset || 0,
      binning: settings.binning || "1x1",
    }),
  setExposureTime: (value) => set({ exposureTime: value }),
  toggleBurstMode: (value) => set({ burstMode: value }),
  setBurstCount: (value) => set({ burstCount: value }),
  toggleIntervalMode: (value) => set({ intervalMode: value }),
  setIntervalTime: (value) => set({ intervalTime: value }),
  setExposureMode: (value) => set({ exposureMode: value }),
  setWhiteBalance: (value) => set({ whiteBalance: value }),
  setISO: (value) => set({ iso: value }),
  setAperture: (value) => set({ aperture: value }),
  setFocusPoint: (value) => set({ focusPoint: value }),
  setFilterType: (value) => set({ filterType: value }),
  setGain: (value) => set({ gain: value }),
  setOffset: (value) => set({ offset: value }),
  setBinning: (value) => set({ binning: value }),
}));

export interface ViewerSettings {
  zoom: number;
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  whiteBalance: string;
  focusPoint: { x: number; y: number };
}

interface CameraState extends ViewerSettings {
  setZoom: (zoom: number) => void;
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
  setSaturation: (saturation: number) => void;
  setRotation: (rotation: number) => void;
  setWhiteBalance: (whiteBalance: string) => void;
  setFocusPoint: (focusPoint: { x: number; y: number }) => void;
  resetSettings: (settings: Partial<ViewerSettings>) => void;
  images: string[];
}

export const useViewerStore = create<CameraState>((set) => ({
  zoom: 1,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  whiteBalance: "Auto",
  focusPoint: { x: 50, y: 50 },
  images: [],
  setZoom: (zoom) => set({ zoom }),
  setBrightness: (brightness) => set({ brightness }),
  setContrast: (contrast) => set({ contrast }),
  setSaturation: (saturation) => set({ saturation }),
  setRotation: (rotation) => set({ rotation }),
  setWhiteBalance: (whiteBalance) => set({ whiteBalance }),
  setFocusPoint: (focusPoint) => set({ focusPoint }),
  resetSettings: (settings) => set((state) => ({ ...state, ...settings })),
}));

export interface Location {
  latitude: number;
  longitude: number;
}

interface DashboardState {
  location: Location | null;
  setLocation: (location: Location) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
}));
