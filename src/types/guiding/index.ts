export interface GuidePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface GuideSettings {
  radius: number;
  zoom: number;
  xScale: number;
  yScale: string;
  correction: boolean;
  trendLine: boolean;
  animationSpeed: number;
  colorScheme: "dark" | "light";
  autoGuide: boolean;
  exposureTime: number;
}

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

export interface TrackingParams {
  mod: number;
  flow: number;
  value: number;
  agr: number;
  guideLength: number;
}

export interface CustomColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface MeasurementState {
  startTime: string;
  exposureTime: string;
  snr: number;
  elapsedTime: string;
  starCenter: string;
  sampleCount: number;
}

export interface HighFrequencyMeasurement {
  redRMS: number;
  greenRMS: number;
  blueRMS: number;
}

export interface StarPosition {
  redPeak: number;
  greenPeak: number;
  bluePeak: number;
  driftRate: number;
  maxDriftRate: number;
  noStarExposureTime: number;
  driftSpeed: number;
  periodicalError: number;
  polarAxisError: number;
}

export interface CustomOptions {
  snrThreshold: number;
  measurementInterval: number;
  autoStopDuration: number;
}
