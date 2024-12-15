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

export interface AppState {
  isLandscape: boolean;
  isMobile: boolean;
}
