import { create } from "zustand";

interface DomeState {
  azimuth: number;
  shutterStatus: "open" | "closed" | "opening" | "closing";
  isConnected: boolean;
  isSynced: boolean;
  isSlewing: boolean;
  error: string | null;
  temperature: number;
  humidity: number; // 新增：湿度
  pressure: number; // 新增：气压
  windSpeed: number; // 新增：风速
  rainStatus: "none" | "drizzle" | "rain"; // 新增：降雨状态
  setAzimuth: (azimuth: number) => void;
  setShutterStatus: (status: "open" | "closed" | "opening" | "closing") => void;
  setConnected: (isConnected: boolean) => void;
  setSynced: (isSynced: boolean) => void;
  setSlewing: (isSlewing: boolean) => void;
  setError: (error: string | null) => void;
  setTemperature: (temp: number) => void;
  setHumidity: (humidity: number) => void; // 新增：设置湿度
  setPressure: (pressure: number) => void; // 新增：设置气压
  setWindSpeed: (windSpeed: number) => void; // 新增：设置风速
  setRainStatus: (status: "none" | "drizzle" | "rain") => void; // 新增：设置降雨状态
}

export const useDomeStore = create<DomeState>((set) => ({
  azimuth: 0,
  shutterStatus: "closed",
  isConnected: false,
  isSynced: false,
  isSlewing: false,
  error: null,
  temperature: 20,
  humidity: 50, // 默认湿度
  pressure: 1013, // 默认气压
  windSpeed: 0, // 默认风速
  rainStatus: "none", // 默认降雨状态
  setAzimuth: (azimuth) => set({ azimuth }),
  setShutterStatus: (status) => set({ shutterStatus: status }),
  setConnected: (isConnected) => set({ isConnected }),
  setSynced: (isSynced) => set({ isSynced }),
  setSlewing: (isSlewing) => set({ isSlewing }),
  setError: (error) => set({ error }),
  setTemperature: (temp) => set({ temperature: temp }),
  setHumidity: (humidity) => set({ humidity }),
  setPressure: (pressure) => set({ pressure }),
  setWindSpeed: (windSpeed) => set({ windSpeed }),
  setRainStatus: (status) => set({ rainStatus: status }),
}));
