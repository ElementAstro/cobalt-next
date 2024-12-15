import { create } from "zustand";
import {
  GuideSettings,
  TrackingParams,
  GuidePoint,
  CustomColors,
} from "@/types/guiding/guiding";
import { getColorScheme } from "@/utils/color-schemes";

interface GuideStore {
  settings: GuideSettings;
  setSettings: (settings: Partial<GuideSettings>) => void;
  tracking: TrackingParams;
  setTracking: (tracking: Partial<TrackingParams>) => void;
  waveformData: number[];
  setWaveformData: (data: number[]) => void;
  currentPosition: { x: number; y: number };
  setCurrentPosition: (position: { x: number; y: number }) => void;
  historyPoints: GuidePoint[];
  setHistoryPoints: (points: GuidePoint[]) => void;
  colors: CustomColors;
  setColors: (colors: CustomColors) => void;
  guideImage: string | null;
  setGuideImage: (image: string | null) => void;
}

export const useGuideStore = create<GuideStore>((set) => ({
  settings: {
    radius: 2.0,
    zoom: 100,
    xScale: 100,
    yScale: '+/-4"',
    correction: true,
    trendLine: false,
    animationSpeed: 1,
    colorScheme: "dark",
  },
  setSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  tracking: {
    mod: 70,
    flow: 10,
    value: 0.27,
    agr: 100,
    guideLength: 2500,
  },
  setTracking: (newTracking) =>
    set((state) => ({ tracking: { ...state.tracking, ...newTracking } })),
  waveformData: Array.from({ length: 100 }, () => Math.random() * 2 - 1),
  setWaveformData: (data) => set({ waveformData: data }),
  currentPosition: { x: 0, y: 0 },
  setCurrentPosition: (position) => set({ currentPosition: position }),
  historyPoints: [],
  setHistoryPoints: (points) => set({ historyPoints: points }),
  colors: getColorScheme("dark"),
  setColors: (colors) => set({ colors }),
  guideImage: null,
  setGuideImage: (image) => set({ guideImage: image }),
}));
