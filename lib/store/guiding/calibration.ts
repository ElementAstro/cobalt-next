import { create } from "zustand";

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
