export interface DarkFieldState {
  minExposure: number;
  maxExposure: number;
  framesPerExposure: number;
  libraryType: "modify" | "create";
  isoValue: number;
  binningMode: string;
  coolingEnabled: boolean;
  targetTemperature: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  isMockMode: boolean;
  darkFrameCount: number;
  gainValue: number;
  offsetValue: number;
  statistics: {
    totalFrames: number;
    averageExposure: number;
    lastCreated: string;
    librarySize: number; // in bytes
    totalTime: number; // in seconds
    avgTemperature: number;
    successRate: number;
    compression: number;
  };
  history: Array<{
    date: string;
    frames: number;
    temperature: number;
    exposure: number;
    successCount: number;
    totalCount: number;
  }>;
  progress: DarkFieldProgress;
  isPaused: boolean;
  validationErrors: string[];
  validationWarnings: string[];
  diskSpace: {
    total: number;
    used: number;
    available: number;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskActivity: number;
    networkSpeed: number;
  };
  calibration: {
    isCalibrated: boolean;
    lastCalibration: string;
    calibrationData: Record<string, unknown>;
  };
  systemStatus: {
    isCameraConnected: boolean;
    isTemperatureStable: boolean;
    isFocusLocked: boolean;
    batteryLevel: number;
  };
}

export interface DarkFieldActions {
  resetSettings: () => void;
  startCreation: () => Promise<void>;
  cancelCreation: () => void;
  setMinExposure: (value: number) => void;
  setMaxExposure: (value: number) => void;
  setFramesPerExposure: (value: number) => void;
  setLibraryType: (value: "modify" | "create") => void;
  setIsoValue: (value: number) => void;
  setBinningMode: (value: string) => void;
  setCoolingEnabled: (value: boolean) => void;
  setTargetTemperature: (value: number) => void;
  setIsMockMode: (value: boolean) => void;
  setDarkFrameCount: (value: number) => void;
  setGainValue: (value: number) => void;
  setOffsetValue: (value: number) => void;
  fetchStatistics: () => Promise<void>;
  fetchHistory: (days: number) => Promise<void>;
  exportReport: () => Promise<void>;
  pauseCreation: () => Promise<void>;
  resumeCreation: () => Promise<void>;
  validateSettings: () => Promise<void>;
  optimizeLibrary: () => Promise<void>;
  getDiskSpace: () => Promise<void>;
}

export type DarkFieldStore = DarkFieldState & DarkFieldActions;

export interface DarkFieldAPI {
  getStatistics(): Promise<DarkFieldState['statistics']>;
  getHistory(days: number): Promise<DarkFieldState['history']>;
  createDarkField(config: {
    minExposure: number;
    maxExposure: number;
    framesPerExposure: number;
    libraryType: string;
    isoValue: number;
    binningMode: string;
    targetTemperature: number;
    gainValue: number;
    offsetValue: number;
  }): Promise<void>;
  cancelCreation(): Promise<void>;
  exportReport(): Promise<Blob>;
  getProgress(): Promise<DarkFieldProgress>;
  pauseCreation(): Promise<void>;
  resumeCreation(): Promise<void>;
  validateSettings(settings: Partial<DarkFieldState>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  getDiskSpace(): Promise<{
    total: number;
    used: number;
    available: number;
  }>;
  optimizeLibrary(): Promise<void>;
}

type DarkFieldStatistics = DarkFieldState['statistics'];

export interface DarkFieldStats extends DarkFieldStatistics {
  lastUpdated: string;
  hasErrors: boolean;
  errorCount: number;
  warnings: Array<{
    type: string;
    message: string;
  }>;
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskSpace: number;
  };
}

export interface DarkFieldProgress {
  currentFrame: number;
  totalFrames: number;
  currentExposure: number;
  estimatedTimeLeft: number;
  currentTemperature: number;
  stage: 'preparing' | 'capturing' | 'processing' | 'saving' | 'completed' | 'error' | 'cancelled' | 'paused';
  warnings: string[];
  performance: {
    frameRate: number;
    processingTime: number;
    savingTime: number;
  };
}
