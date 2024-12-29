import { create } from "zustand";
import { CelestialData, CelestialDataSchema } from "@/types/infomation";
import SunCalc from "suncalc";
import api from "@/services/axios";

interface AstroState {
  data: CelestialData;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  isConnected: boolean;
  lastUpdate: string;
  selectedTab: string;
  showWeather: boolean;
  darkMode: boolean;
  isLive: boolean;
  error: string | null;
  loadingStates: {
    [key: string]: boolean;
  };
  errorLogs: Array<{
    timestamp: string;
    message: string;
    severity: "info" | "warning" | "error";
  }>;
}

interface AstroActions {
  setLocation: (lat: number, lng: number, name: string) => void;
  updateData: () => void;
  setSelectedTab: (tab: string) => void;
  toggleWeather: () => void;
  toggleDarkMode: () => void;
  toggleLive: () => void;
  setError: (message: string) => void;
  logError: (message: string, severity: "info" | "warning" | "error") => void;
  clearErrors: () => void;
  setLoadingState: (key: string, isLoading: boolean) => void;
  fetchLocation: () => void;
}

const calculateCelestialData = (
  latitude: number,
  longitude: number
): Partial<CelestialData> | null => {
  try {
    const now = new Date();
    const sunTimes = SunCalc.getTimes(now, latitude, longitude);
    const moonTimes = SunCalc.getMoonTimes(now, latitude, longitude);
    const moonPhase = SunCalc.getMoonIllumination(now);

    const sunPosition = SunCalc.getPosition(now, latitude, longitude);
    const moonPosition = SunCalc.getMoonPosition(now, latitude, longitude);

    const dataPartial: Partial<CelestialData> = {
      current_time: now.toISOString(),
      sun: {
        rise: sunTimes.sunrise.toTimeString().slice(0, 5),
        set: sunTimes.sunset.toTimeString().slice(0, 5),
        transit: sunTimes.solarNoon.toTimeString().slice(0, 5),
        at_start: sunTimes.nightEnd.toTimeString().slice(0, 5),
        ct_start: sunTimes.dawn.toTimeString().slice(0, 5),
        at_end: sunTimes.night.toTimeString().slice(0, 5),
        ct_end: sunTimes.dusk.toTimeString().slice(0, 5),
        az: ((sunPosition.azimuth * 180) / Math.PI).toFixed(1) + "°",
        alt: ((sunPosition.altitude * 180) / Math.PI).toFixed(1) + "°",
        ra: "00:00:00",
        dec: "00:00:00",
        equinox: "2024-03-20",
        solstice: "2024-06-21",
      },
      moon: {
        phase: getMoonPhaseName(moonPhase.phase),
        light: (moonPhase.fraction * 100).toFixed(1),
        rise: moonTimes.rise
          ? moonTimes.rise.toTimeString().slice(0, 5)
          : "N/A",
        set: moonTimes.set ? moonTimes.set.toTimeString().slice(0, 5) : "N/A",
        transit: "00:00",
        az: ((moonPosition.azimuth * 180) / Math.PI).toFixed(1) + "°",
        alt: ((moonPosition.altitude * 180) / Math.PI).toFixed(1) + "°",
        ra: "00:00:00",
        dec: "00:00:00",
        new: "2024-03-10",
        full: "2024-03-25",
      },
      polaris: {
        next_transit: "00:00",
        alt: "90.0°",
        hour_angle: 0,
      },
      // 其他数据从后端获取
    };

    return dataPartial;
  } catch (error) {
    console.error("数据计算或验证失败:", error);
    return null;
  }
};

export const useAstroStore = create<AstroState & AstroActions>((set, get) => ({
  data: {} as CelestialData,
  location: {
    latitude: 39.9042,
    longitude: 116.4074,
    name: "北京",
  },
  isConnected: true,
  lastUpdate: new Date().toISOString(),
  selectedTab: "sun",
  showWeather: true,
  darkMode: true,
  isLive: true,
  error: null,
  loadingStates: {},
  errorLogs: [],

  setLocation: (lat, lng, name) =>
    set({
      location: { latitude: lat, longitude: lng, name },
    }),

  fetchLocation: () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set({
            location: { latitude, longitude, name: "当前位置" },
          });
          get().updateData();
        },
        (error) => {
          get().logError(error.message, "error");
          set({ error: "无法获取位置信息。" });
        }
      );
    } else {
      set({ error: "Geolocation 不被此浏览器支持。" });
    }
  },

  updateData: async () => {
    const { location, isLive, setLoadingState, logError } = get();
    if (!isLive) return;

    setLoadingState("data", true);
    try {
      const celestialDataPartial = calculateCelestialData(
        location.latitude,
        location.longitude
      );

      if (celestialDataPartial) {
        const response = await api.request<CelestialData>({
          url: "/api/astro-data",
          method: "GET",
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });

        const validatedData = CelestialDataSchema.partial().parse(response);
        const mergedData = {
          ...celestialDataPartial,
          ...validatedData,
        } as CelestialData;

        CelestialDataSchema.parse(mergedData);

        set({
          data: mergedData,
          lastUpdate: new Date().toISOString(),
          error: null,
        });
      } else {
        set({ error: "更新数据失败，计算的数据为空。" });
      }
    } catch (error: any) {
      logError(error?.message || "未知错误发生", "error");
      set({ error: "更新数据失败。" });
    } finally {
      setLoadingState("data", false);
    }
  },

  setSelectedTab: (tab) => set({ selectedTab: tab }),
  toggleWeather: () => set((state) => ({ showWeather: !state.showWeather })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleLive: () => set((state) => ({ isLive: !state.isLive })),
  setError: (message) => set({ error: message }),
  logError: (message, severity) =>
    set((state) => ({
      errorLogs: [
        ...state.errorLogs,
        {
          timestamp: new Date().toISOString(),
          message,
          severity,
        },
      ],
    })),
  clearErrors: () => set({ errorLogs: [] }),
  setLoadingState: (key, isLoading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: isLoading },
    })),
}));

function getMoonPhaseName(phase: number): string {
  if (phase <= 0.05 || phase > 0.95) return "新月";
  if (phase <= 0.25) return "眉月";
  if (phase <= 0.35) return "上弦月";
  if (phase <= 0.45) return "盈凸月";
  if (phase <= 0.55) return "满月";
  if (phase <= 0.65) return "亏凸月";
  if (phase <= 0.75) return "下弦月";
  return "残月";
}
