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
}

export interface Target {
  id: string;
  name: string;
  category?: string;
  coordinates: CoordinateData;
  tasks: Task[];
}
