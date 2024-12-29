import { CustomColors, GuideSettings, TrackingParams } from "@/types/guiding";
import { create } from "zustand";
import type {
  MeasurementState,
  HighFrequencyMeasurement,
  StarPosition,
  CustomOptions,
} from "@/types/guiding";

interface WaveformState {
  imageUrl: string | null;
  centroid: number | null;
  intensityData: { x: number; y: number }[];
  setImageUrl: (url: string) => void;
  setCentroid: (x: number) => void;
  setIntensityData: (data: { x: number; y: number }[]) => void;
  exportData: () => void;
}

export const useWaveformStore = create<WaveformState>((set, get) => ({
  imageUrl: null,
  centroid: null,
  intensityData: [],
  setImageUrl: (url) => set({ imageUrl: url }),
  setCentroid: (x) => set({ centroid: x }),
  setIntensityData: (data) => set({ intensityData: data }),
  exportData: () => {
    const { centroid, intensityData } = get();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      intensityData.map((point) => `${point.x},${point.y}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "waveform_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
}));

// 计算质心和强度数据
useWaveformStore.subscribe((state) => {
  if (state.imageUrl) {
    const img = new Image();
    img.src = state.imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        let sumX = 0;
        let sumIntensity = 0;
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const index = (y * img.width + x) * 4;
            const intensity =
              data[index] * 0.3 +
              data[index + 1] * 0.59 +
              data[index + 2] * 0.11;
            sumX += x * intensity;
            sumIntensity += intensity;
          }
        }
        const centroid = sumIntensity ? sumX / sumIntensity : img.width / 2;
        setTimeout(() => {
          useWaveformStore.getState().setCentroid(Math.round(centroid));
          const intensityLine: { x: number; y: number }[] = [];
          for (let x = 0; x < img.width; x++) {
            let intensitySum = 0;
            for (let y = 0; y < img.height; y++) {
              const index = (y * img.width + x) * 4;
              const intensity =
                data[index] * 0.3 +
                data[index + 1] * 0.59 +
                data[index + 2] * 0.11;
              intensitySum += intensity;
            }
            const avgIntensity = img.height ? intensitySum / img.height : 0;
            intensityLine.push({ x, y: avgIntensity });
          }
          useWaveformStore.getState().setIntensityData(intensityLine);
        }, 100);
      }
    };
  } else {
    useWaveformStore.setState({ centroid: null, intensityData: [] });
  }
});

interface GuidePoint {
  x: number;
  y: number;
}

interface HistoryGraphState {
  points: GuidePoint[];
  showTrendLine: boolean;
  colors: CustomColors;
  animationSpeed: number;
  gridSpacing: number;
  showStats: boolean;
  enableZoom: boolean;
  showAxisLabels: boolean;
  pointRadius: number;
  lineThickness: number;
  refreshData: () => void;
  exportData: () => void;
}

export const useHistoryGraphStore = create<HistoryGraphState>((set, get) => ({
  points: [],
  showTrendLine: true,
  colors: {
    primary: "#4ade80",
    secondary: "#818cf8",
    accent: "#f472b6",
    background: "#1f2937",
    text: "#ffffff",
    grid: "#374151",
    avgLine: "#f59e0b",
  },
  animationSpeed: 0.5,
  gridSpacing: 50,
  showStats: true,
  enableZoom: true,
  showAxisLabels: true,
  pointRadius: 3,
  lineThickness: 2,
  refreshData: () => {
    // 模拟实时数据刷新
    const newPoints: GuidePoint[] = Array.from({ length: 50 }, (_, i) => ({
      x: i,
      y: Math.random() * 100,
    }));
    set({ points: newPoints });
  },
  exportData: () => {
    const { points } = get();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["x,y", ...points.map((p) => `${p.x},${p.y}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "history_graph_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
}));

// 初始化数据刷新
useHistoryGraphStore.getState().refreshData();
setInterval(() => {
  useHistoryGraphStore.getState().refreshData();
}, 5000); // 每5秒刷新一次

export const darkScheme: CustomColors = {
  background: "#1a1a2e",
  text: "#ffffff",
  primary: "#0f3460",
  secondary: "#16213e",
  accent: "#e94560",
};

export const lightScheme: CustomColors = {
  background: "#f0f0f0",
  text: "#333333",
  primary: "#3498db",
  secondary: "#ecf0f1",
  accent: "#e74c3c",
};

export function getColorScheme(scheme: "dark" | "light"): CustomColors {
  return scheme === "dark" ? darkScheme : lightScheme;
}

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
    autoGuide: false,
    exposureTime: 1000,
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

interface GuidingConfigStore {
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

export const useGuidingConfigStore = create<GuidingConfigStore>((set) => ({
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

interface PeakChartSettings {
  height: number;
  width: number;
  strokeColor: string;
  strokeWidth: number;
  showGrid: boolean;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setShowGrid: (show: boolean) => void;
}

export const usePeakChartStore = create<PeakChartSettings>((set) => ({
  height: 100,
  width: 100,
  strokeColor: "#ffffff",
  strokeWidth: 2,
  showGrid: true,
  setHeight: (height) => set({ height }),
  setWidth: (width) => set({ width }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setShowGrid: (show) => set({ showGrid: show }),
}));
