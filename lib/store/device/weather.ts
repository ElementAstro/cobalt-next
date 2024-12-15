import { create } from "zustand";

export interface WeatherDataPoint {
  timestamp: number;
  temperature: number;
  humidity: number;
}

interface WeatherStore {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  dataHistory: WeatherDataPoint[];
  autoUpdate: boolean;
  setTemperature: (value: number) => void;
  setHumidity: (value: number) => void;
  setPressure: (value: number) => void;
  setWindSpeed: (value: number) => void;
  setWindDirection: (value: string) => void;
  addDataPoint: (point: WeatherDataPoint) => void;
  toggleAutoUpdate: () => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  temperature: 20,
  humidity: 50,
  pressure: 1013.25,
  windSpeed: 0,
  windDirection: "N",
  dataHistory: [],
  autoUpdate: true,
  setTemperature: (value) => set({ temperature: value }),
  setHumidity: (value) => set({ humidity: value }),
  setPressure: (value) => set({ pressure: value }),
  setWindSpeed: (value) => set({ windSpeed: value }),
  setWindDirection: (value) => set({ windDirection: value }),
  addDataPoint: (point) =>
    set((state) => ({
      dataHistory: [...state.dataHistory, point].slice(-100),
    })),
  toggleAutoUpdate: () => set((state) => ({ autoUpdate: !state.autoUpdate })),
}));
