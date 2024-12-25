import { create } from "zustand";
import { CelestialData, CelestialDataSchema } from "@/types/astropanel";
import SunCalc from "suncalc";

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
}

const calculateCelestialData = (
  latitude: number,
  longitude: number
): CelestialData | null => {
  try {
    const now = new Date();
    const sunTimes = SunCalc.getTimes(now, latitude, longitude);
    const moonTimes = SunCalc.getMoonTimes(now, latitude, longitude);
    const moonPhase = SunCalc.getMoonIllumination(now);

    // Calculate current positions
    const sunPosition = SunCalc.getPosition(now, latitude, longitude);
    const moonPosition = SunCalc.getMoonPosition(now, latitude, longitude);

    const data: CelestialData = {
      current_time: now.toISOString(),
      observing_conditions: {
        seeing: "Good",
        transparency: "Clear",
        darkness: "New Moon",
        recommended: true,
      },
      location: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
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
        ra: "00:00:00", // Calculate from position
        dec: "00:00:00", // Calculate from position
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
        transit: "00:00", // Calculate
        az: ((moonPosition.azimuth * 180) / Math.PI).toFixed(1) + "°",
        alt: ((moonPosition.altitude * 180) / Math.PI).toFixed(1) + "°",
        ra: "00:00:00", // Calculate from position
        dec: "00:00:00", // Calculate from position
        new: "2024-03-10",
        full: "2024-03-25",
      },
      polaris: {
        next_transit: "00:00",
        alt: "90.0°",
        hour_angle: 0,
      },
      weather: {
        temperature: "N/A",
        humidity: "N/A",
        pressure: "N/A",
        wind_speed: "N/A",
        wind_direction: "N/A",
        cloud_cover: "N/A",
        visibility: "N/A",
        forecast: [
          { time: "00:00", temp: "N/A", condition: "Clear" },
          { time: "03:00", temp: "N/A", condition: "Clear" },
          { time: "06:00", temp: "N/A", condition: "Clear" },
          { time: "09:00", temp: "N/A", condition: "Clear" },
          { time: "12:00", temp: "N/A", condition: "Clear" },
          { time: "15:00", temp: "N/A", condition: "Clear" },
          { time: "18:00", temp: "N/A", condition: "Clear" },
          { time: "21:00", temp: "N/A", condition: "Clear" },
        ],
      },
      celestial_events: ["Meteor Shower", "Equinox"],
      upcoming_events: [
        {
          name: "Spring Equinox",
          date: "2024-03-20",
          description: "Sun crosses celestial equator northward",
        },
      ],
      solarSystem: {
        planets: [
          {
            name: "Mercury",
            rise: "00:00",
            transit: "00:00",
            set: "00:00",
            altitude: 0,
            azimuth: 0,
            magnitude: 0,
            distance: 0,
            phase: 0,
          },
          {
            name: "Venus",
            rise: "00:00",
            transit: "00:00",
            set: "00:00",
            altitude: 0,
            azimuth: 0,
            magnitude: -4,
            distance: 0,
            phase: 0.8,
          },
          {
            name: "Mars",
            rise: "00:00",
            transit: "00:00",
            set: "00:00",
            altitude: 0,
            azimuth: 0,
            magnitude: 1.5,
            distance: 0,
          },
          {
            name: "Jupiter",
            rise: "00:00",
            transit: "00:00",
            set: "00:00",
            altitude: 0,
            azimuth: 0,
            magnitude: -2,
            distance: 0,
          },
          {
            name: "Saturn",
            rise: "00:00",
            transit: "00:00",
            set: "00:00",
            altitude: 0,
            azimuth: 0,
            magnitude: 0.5,
            distance: 0,
          },
        ],
        lastUpdate: now.toISOString(),
      },
      errorLogs: [
        {
          timestamp: now.toISOString(),
          message: "Initial data loaded",
          severity: "info",
        },
      ],
    };

    // 验证数据结构
    CelestialDataSchema.parse(data);

    return data;
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

  updateData: async () => {
    const { location, isLive, setLoadingState, logError } = get();
    if (!isLive) return;

    setLoadingState("data", true);
    try {
      const newData = calculateCelestialData(
        location.latitude,
        location.longitude
      );

      if (newData) {
        CelestialDataSchema.parse(newData);
        set({
          data: newData,
          lastUpdate: new Date().toISOString(),
          error: null,
        });
      } else {
        set({ error: "更新数据失败，返回的数据为空。" });
      }
    } catch (error: any) {
      logError(error?.message || "Unknown error occurred", "error");
    } finally {
      setLoadingState("data", false);
    }

    // 真实的计算功能，例如天体位置计算
    // { 这里可以添加更多的计算逻辑 }
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
