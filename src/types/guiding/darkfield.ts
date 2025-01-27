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
  progress: number;
  isMockMode: boolean;
  darkFrameCount: number;
  gainValue: number;
  offsetValue: number;
}
