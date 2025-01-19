import { CustomColors, GuideSettings, TrackingParams } from "@/types/guiding";
import { create } from "zustand";
import type {
  MeasurementState,
  HighFrequencyMeasurement,
  StarPosition,
  CustomOptions,
} from "@/types/guiding";
import { toast } from "@/hooks/use-toast";

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

interface DarkFieldLibraryState {
  minExposure: number;
  maxExposure: number;
  framesPerExposure: number;
  libraryType: "modify" | "create";
  isoValue: number;
  binningMode: number;
  coolingEnabled: boolean;
  targetTemperature: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  progress: number;
  isMockMode: boolean;
  darkFrameCount: number;
  gainValue: number;
  offsetValue: number;
  setMinExposure: (value: number) => void;
  setMaxExposure: (value: number) => void;
  setFramesPerExposure: (value: number) => void;
  setLibraryType: (value: "modify" | "create") => void;
  setIsoValue: (value: number) => void;
  setBinningMode: (value: number) => void;
  setCoolingEnabled: (value: boolean) => void;
  setTargetTemperature: (value: number) => void;
  setIsMockMode: (value: boolean) => void;
  setDarkFrameCount: (value: number) => void;
  setGainValue: (value: number) => void;
  setOffsetValue: (value: number) => void;
  resetSettings: () => void;
  startCreation: () => Promise<void>;
  cancelCreation: () => void;
}

export const useDarkFieldStore = create<DarkFieldLibraryState>((set, get) => ({
  minExposure: 0.5,
  maxExposure: 3.0,
  framesPerExposure: 10,
  libraryType: "create",
  isoValue: 800,
  binningMode: 1,
  coolingEnabled: true,
  targetTemperature: -10,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  progress: 0,
  isMockMode: false,
  darkFrameCount: 50,
  gainValue: 0,
  offsetValue: 0,
  setMinExposure: (value) => set({ minExposure: value }),
  setMaxExposure: (value) => set({ maxExposure: value }),
  setFramesPerExposure: (value) => set({ framesPerExposure: value }),
  setLibraryType: (value) => set({ libraryType: value }),
  setIsoValue: (value) => set({ isoValue: value }),
  setBinningMode: (value) => set({ binningMode: value }),
  setCoolingEnabled: (value) => set({ coolingEnabled: value }),
  setTargetTemperature: (value) => set({ targetTemperature: value }),
  setIsMockMode: (value) => set({ isMockMode: value }),
  setDarkFrameCount: (value) => set({ darkFrameCount: value }),
  setGainValue: (value) => set({ gainValue: value }),
  setOffsetValue: (value) => set({ offsetValue: value }),
  resetSettings: () => {
    set({
      minExposure: 0.5,
      maxExposure: 3.0,
      framesPerExposure: 10,
      libraryType: "create",
      isoValue: 800,
      binningMode: 1,
      coolingEnabled: true,
      targetTemperature: -10,
      darkFrameCount: 50,
      gainValue: 0,
      offsetValue: 0,
    });
    toast({
      title: "设置已重置",
      description: "所有设置已恢复为默认值",
    });
  },
  startCreation: async () => {
    set({ isLoading: true, isSuccess: false, isError: false, progress: 0 });

    try {
      // 模拟创建过程
      const totalFrames = get().darkFrameCount;
      const interval = setInterval(() => {
        set((state) => {
          const newProgress = state.progress + 100 / totalFrames;
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              progress: 100,
              isLoading: false,
              isSuccess: true,
            };
          }
          return { progress: newProgress };
        });
      }, 1000);

      toast({
        title: "创建成功",
        description: "暗场库已成功创建",
      });
    } catch (error) {
      set({
        isLoading: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : "创建失败",
      });
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  },
  cancelCreation: () => {
    set({ isLoading: false, progress: 0 });
    toast({
      title: "创建已取消",
      description: "暗场库创建过程已中止",
    });
  },
}));

interface CalibrationData {
  raStars: number;
  decStars: number;
  cameraAngle: number;
  orthogonalError: number;
  raSpeed: string;
  decSpeed: string;
  predictedRaSpeed: string;
  predictedDecSpeed: string;
  combined: number;
  raDirection: string;
  createdAt: string;
}

interface SettingsData {
  modifiedAt: string;
  focalLength: string;
  resolution: string;
  raDirection: string;
  combined: string;
  raGuideSpeed: string;
  decGuideSpeed: string;
  decValue: string;
  rotationAngle: string;
}

interface GuidingState {
  isLandscape: boolean;
  showAnimation: boolean;
  lineLength: number;
  showGrid: boolean;
  calibrationData: CalibrationData;
  settingsData: SettingsData;
  autoRotate: boolean;
  rotationSpeed: number;
  zoomLevel: number;
  setAutoRotate: (value: boolean) => void;
  setRotationSpeed: (value: number) => void;
  setZoomLevel: (value: number) => void;
  setIsLandscape: (isLandscape: boolean) => void;
  setShowAnimation: (showAnimation: boolean) => void;
  setLineLength: (lineLength: number) => void;
  setShowGrid: (showGrid: boolean) => void;
  updateCalibrationData: (data: Partial<CalibrationData>) => void;
  updateSettingsData: (data: Partial<SettingsData>) => void;
  handleRecalibrate: () => void;
}

export const useGuidingStore = create<GuidingState>((set) => ({
  isLandscape: false,
  showAnimation: false,
  lineLength: 100,
  showGrid: true,

  calibrationData: {
    raStars: 7,
    decStars: 6,
    cameraAngle: -167.2,
    orthogonalError: 2.8,
    raSpeed: "13.409 角秒/秒\n10.264 像素/秒",
    decSpeed: "14.405 角秒/秒\n11.027 像素/秒",
    predictedRaSpeed: "无",
    predictedDecSpeed: "无",
    combined: 1,
    raDirection: "无",
    createdAt: "2024/11/2 21:11:20",
  },
  settingsData: {
    modifiedAt: "2024/11/2 21:11:20",
    focalLength: "300 毫米",
    resolution: "1.31 角秒/像素",
    raDirection: "无",
    combined: "合并: 1",
    raGuideSpeed: "无",
    decGuideSpeed: "无",
    decValue: "21.4 (est)",
    rotationAngle: "无",
  },
  autoRotate: false,
  rotationSpeed: 0,
  zoomLevel: 1,
  setAutoRotate: (value) => set({ autoRotate: value }),
  setRotationSpeed: (value) => set({ rotationSpeed: value }),
  setZoomLevel: (value) => set({ zoomLevel: value }),
  setIsLandscape: (isLandscape) => set({ isLandscape }),
  setShowAnimation: (showAnimation) => set({ showAnimation }),
  setLineLength: (lineLength) => set({ lineLength }),
  setShowGrid: (showGrid) => set({ showGrid }),
  updateCalibrationData: (data) =>
    set((state) => ({
      calibrationData: { ...state.calibrationData, ...data },
    })),
  updateSettingsData: (data) =>
    set((state) => ({
      settingsData: { ...state.settingsData, ...data },
    })),
  handleRecalibrate: () => {
    console.log("Recalibrating...");
  },
}));