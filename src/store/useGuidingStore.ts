import { CustomColors, GuideSettings, TrackingParams } from "@/types/guiding";
import { create } from "zustand";
import type {
  MeasurementState,
  HighFrequencyMeasurement,
  StarPosition,
  CustomOptions,
} from "@/types/guiding";
import { toast } from "@/hooks/use-toast";

interface GuidingStore {
  // 基础设置
  settings: GuideSettings;
  setSettings: (settings: Partial<GuideSettings>) => void;

  // 跟踪参数
  tracking: TrackingParams;
  setTracking: (tracking: Partial<TrackingParams>) => void;

  // 波形数据
  waveform: {
    imageUrl: string | null;
    centroid: number | null;
    intensityData: { x: number; y: number }[];
    setImageUrl: (url: string) => void;
    setCentroid: (x: number) => void;
    setIntensityData: (data: { x: number; y: number }[]) => void;
    exportData: () => void;
  };

  // 历史图表
  historyGraph: {
    points: { x: number; y: number }[];
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
  };

  // 校准数据
  calibration: {
    data: CalibrationData;
    settings: CalibrationSettings;
    isLandscape: boolean;
    showAnimation: boolean;
    lineLength: number;
    showGrid: boolean;
    autoRotate: boolean;
    rotationSpeed: number;
    zoomLevel: number;
    updateData: (data: Partial<CalibrationData>) => void;
    updateSettings: (data: Partial<CalibrationSettings>) => void;
    handleRecalibrate: () => void;
    setIsLandscape: (value: boolean) => void;
    setShowAnimation: (value: boolean) => void;
    setLineLength: (value: number) => void;
    setShowGrid: (value: boolean) => void;
    setAutoRotate: (value: boolean) => void;
    setRotationSpeed: (value: number) => void;
    setZoomLevel: (value: number) => void;
  };

  // 暗场库
  darkField: {
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
    resetSettings: () => void;
    startCreation: () => Promise<void>;
    cancelCreation: () => void;
  };
}

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

interface CalibrationSettings {
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

export const useGuidingStore = create<GuidingStore>((set, get) => ({
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

  waveform: {
    imageUrl: null,
    centroid: null,
    intensityData: [],
    setImageUrl: (url) =>
      set((state) => ({ waveform: { ...state.waveform, imageUrl: url } })),
    setCentroid: (x) =>
      set((state) => ({ waveform: { ...state.waveform, centroid: x } })),
    setIntensityData: (data) =>
      set((state) => ({
        waveform: { ...state.waveform, intensityData: data },
      })),
    exportData: () => {
      const { intensityData } = get().waveform;
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
      toast({
        title: "数据导出成功",
        description: "波形数据已成功导出为CSV文件",
      });
    },
  },

  historyGraph: {
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
      const newPoints = Array.from({ length: 50 }, (_, i) => ({
        x: i,
        y: Math.random() * 100,
      }));
      set((state) => ({
        historyGraph: { ...state.historyGraph, points: newPoints },
      }));
    },
    exportData: () => {
      const { points } = get().historyGraph;
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
      toast({
        title: "数据导出成功",
        description: "历史图表数据已成功导出为CSV文件",
      });
    },
  },

  calibration: {
    data: {
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
    settings: {
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
    isLandscape: false,
    showAnimation: false,
    lineLength: 100,
    showGrid: true,
    autoRotate: false,
    rotationSpeed: 0,
    zoomLevel: 1,
    updateData: (data) =>
      set((state) => ({
        calibration: {
          ...state.calibration,
          data: { ...state.calibration.data, ...data },
        },
      })),
    updateSettings: (data) =>
      set((state) => ({
        calibration: {
          ...state.calibration,
          settings: { ...state.calibration.settings, ...data },
        },
      })),
    handleRecalibrate: () => {
      toast({
        title: "重新校准中...",
        description: "系统正在进行重新校准",
      });
    },
    setIsLandscape: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, isLandscape: value },
      })),
    setShowAnimation: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, showAnimation: value },
      })),
    setLineLength: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, lineLength: value },
      })),
    setShowGrid: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, showGrid: value },
      })),
    setAutoRotate: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, autoRotate: value },
      })),
    setRotationSpeed: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, rotationSpeed: value },
      })),
    setZoomLevel: (value) =>
      set((state) => ({
        calibration: { ...state.calibration, zoomLevel: value },
      })),
  },

  darkField: {
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
    resetSettings: () => {
      const { resetSettings, startCreation, cancelCreation } = get().darkField;
      set({
        darkField: {
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
          isLoading: false,
          isSuccess: false,
          isError: false,
          errorMessage: "",
          progress: 0,
          isMockMode: false,
          resetSettings,
          startCreation,
          cancelCreation,
        },
      });
      toast({
        title: "设置已重置",
        description: "所有设置已恢复为默认值",
      });
    },
    startCreation: async () => {
      set((state) => ({
        darkField: {
          ...state.darkField,
          isLoading: true,
          isSuccess: false,
          isError: false,
          progress: 0,
        },
      }));

      try {
        const totalFrames = get().darkField.darkFrameCount;
        const interval = setInterval(() => {
          set((state) => {
            const newProgress = state.darkField.progress + 100 / totalFrames;
            if (newProgress >= 100) {
              clearInterval(interval);
              return {
                darkField: {
                  ...state.darkField,
                  progress: 100,
                  isLoading: false,
                  isSuccess: true,
                },
              };
            }
            return {
              darkField: {
                ...state.darkField,
                progress: newProgress,
              },
            };
          });
        }, 1000);

        toast({
          title: "创建成功",
          description: "暗场库已成功创建",
        });
      } catch (error) {
        set((state) => ({
          darkField: {
            ...state.darkField,
            isLoading: false,
            isError: true,
            errorMessage: error instanceof Error ? error.message : "创建失败",
          },
        }));
        toast({
          title: "创建失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive",
        });
      }
    },
    cancelCreation: () => {
      set((state) => ({
        darkField: {
          ...state.darkField,
          isLoading: false,
          progress: 0,
        },
      }));
      toast({
        title: "创建已取消",
        description: "暗场库创建过程已中止",
      });
    },
  },
}));

// 初始化数据刷新
setInterval(() => {
  useGuidingStore.getState().historyGraph.refreshData();
}, 5000);

// 颜色方案
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
