export interface BadPixelData {
  timestamp: string;
  simulator: string;
  mainFieldExposureTime: number;
  mainFieldBrightness: number;
  correctionLevelHot: number;
  correctionLevelCold: number;
  average: number;
  standardDeviation: number;
  median: number;
  medianAbsoluteDeviation: number;
  hotPixelCount: number;
  coldPixelCount: number;
}

export interface CustomOptions {
  theme: "light" | "dark";
  language: "zh" | "en";
  autoRefresh: boolean;
  refreshInterval: number;
}
