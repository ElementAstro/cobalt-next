export type CalibrationPreset = {
  name: string;
  description: string;
  exposure: number;
  gain: number;
  lineLength: number;
  rotationSpeed: number;
  zoomLevel: number;
  showGrid: boolean;
  autoRotate: boolean;
  showAnimation: boolean;
};

export interface CalibrationData {
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

export interface CalibrationSettings {
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
