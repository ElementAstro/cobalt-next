export interface TargetSetOptions {
  coolCamera: boolean;
  unparkMount: boolean;
  meridianFlip: boolean;
  warmCamera: boolean;
  parkMount: boolean;
}

export interface TimelineData {
  time: string;
  value: number;
}

export interface CoordinateData {
  ra: {
    h: number;
    m: number;
    s: number;
  };
  dec: {
    d: number;
    m: number;
    s: number;
  };
  rotation: number;
}

export interface AutofocusSettings {
  enabled: boolean;
  progress: [number, number];
  total: number;
  time: string;
  type: string;
  filter: string;
  binning: string;
  dither: boolean;
  ditherEvery: number;
  gain: string;
  offset: string;
}

export interface Task {
  id: string;
  name: string;
  duration: number;
  type: string;
  filter: string;
  binning: string;
  count: number;
  category: string;
  enabled: boolean;
  total: number;
  time: string;
  progress: [number, number];
}

export interface ExposureTask extends Task {
  metadata: {
    camera: string;
    filter: string;
    exposure: number;
    gain: number;
    binning: string;
    temperature: number;
    [key: string]: any;
  };
  status: {
    state: "pending" | "running" | "completed" | "failed" | "paused";
    progress: number;
    startTime?: Date;
    endTime?: Date;
    error?: string;
    attempts: number;
    logs: Array<{
      timestamp: Date;
      level: "info" | "warn" | "error";
      message: string;
    }>;
  };
  settings: {
    dither: boolean;
    ditherScale: number;
    focusCheck: boolean;
    meridianFlip: boolean;
    autoGuide: boolean;
    delay: number;
    repeat: number;
  };
}

export interface TaskGroup {
  id: string;
  name: string;
  tasks: ExposureTask[];
  status: "pending" | "running" | "completed" | "failed" | "paused";
  progress: number;
  settings: {
    concurrent: boolean;
    maxRetries: number;
    timeout: number;
  };
}

export interface Target {
  id: string;
  name: string;
  category?: string;
  coordinates: CoordinateData;
  tasks: ExposureTask[];
}

// 添加新的类型定义
export interface TargetMetadata {
  altitude: number;
  azimuth: number;
  airmass: number;
  moonPhase: number;
  moonSeparation: number;
  moonAltitude: number;
  siderealTime: string;
  twilight: "astronomical" | "nautical" | "civil" | "day";
}

export interface ExposureSettings {
  gain: number;
  offset: number;
  binning: number;
  temperature: number;
  filter: string;
  duration: number;
  count: number;
}

export interface AutofocusResult {
  timestamp: Date;
  position: number;
  temperature: number;
  hfd: number;
  fwhm: number;
  stars: number;
  filter: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  dewPoint: number;
  cloudCover: number;
  windSpeed: number;
  windGust: number;
  pressure: number;
  rain: boolean;
}

// 添加自动聚焦设置接口
export interface AutofocusConfig {
  enabled: boolean;
  interval: number;
  tempDelta: number;
  minStars: number;
  maxRetries: number;
  filterOffset: Record<string, number>;
  method: "hfd" | "fwhm" | "contrast";
  autofocusOnFilterChange: boolean;
  autofocusOnTemperatureChange: boolean;
}

// 添加任务执行状态接口
export interface ExecutionStatus {
  state: "idle" | "running" | "paused" | "completed" | "error";
  currentTask?: string;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  remainingTime?: number;
  errors: string[];
  warnings: string[];
}
