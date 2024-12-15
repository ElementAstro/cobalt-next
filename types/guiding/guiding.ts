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
