import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WeatherData, WeatherAPI, ForecastData } from "@/types/weather";

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  city: string;
  units: "metric" | "imperial";
  apiKey: string;
  selectedAPI: WeatherAPI;
  availableAPIs: WeatherAPI[];
  showSettings: boolean;
  showMap: boolean;
  darkMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  favorites: string[];
  historical: {
    [key: string]: WeatherData[];
  };
}

interface WeatherActions {
  setData: (data: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: Date) => void;
  setCity: (city: string) => void;
  setUnits: (units: "metric" | "imperial") => void;
  setApiKey: (key: string) => void;
  setSelectedAPI: (api: WeatherAPI) => void;
  setShowSettings: (show: boolean) => void;
  setShowMap: (show: boolean) => void;
  toggleDarkMode: () => void;
  toggleAutoRefresh: () => void;
  setRefreshInterval: (interval: number) => void;
  addToFavorites: (city: string) => void;
  removeFromFavorites: (city: string) => void;
  addHistoricalData: (city: string, data: WeatherData) => void;
  clearHistoricalData: (city: string) => void;
  fetchWeatherData: () => Promise<void>;
  fetchHistoricalData: (city: string, days: number) => Promise<void>;
  fetchForecastData: (city: string, days: number) => Promise<ForecastData[]>;
}

// API implementations
const OpenWeatherMapAPI: WeatherAPI = {
  name: "OpenWeatherMap",
  fetchWeather: async (city: string, units: string, apiKey: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  },
};

const WeatherAPI2: WeatherAPI = {
  name: "WeatherAPI2",
  fetchWeather: async (city: string, units: string, apiKey: string) => {
    const response = await fetch(
      `https://api.weatherapi2.com/v1/current?q=${city}&units=${units}&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  },
};

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set, get) => ({
      // Initial state
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
      city: "北京",
      units: "metric",
      apiKey: "",
      selectedAPI: OpenWeatherMapAPI,
      availableAPIs: [OpenWeatherMapAPI, WeatherAPI2],
      showSettings: false,
      showMap: false,
      darkMode: true,
      autoRefresh: true,
      refreshInterval: 600000, // 10 minutes
      favorites: [],
      historical: {},

      // Actions
      setData: (data) => set({ data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setLastUpdated: (date) => set({ lastUpdated: date }),
      setCity: (city) => set({ city }),
      setUnits: (units) => set({ units }),
      setApiKey: (key) => set({ apiKey: key }),
      setSelectedAPI: (api) => set({ selectedAPI: api }),
      setShowSettings: (show) => set({ showSettings: show }),
      setShowMap: (show) => set({ showMap: show }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleAutoRefresh: () =>
        set((state) => ({ autoRefresh: !state.autoRefresh })),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),

      addToFavorites: (city) =>
        set((state) => ({
          favorites: [...new Set([...state.favorites, city])],
        })),

      removeFromFavorites: (city) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c !== city),
        })),

      addHistoricalData: (city, data) =>
        set((state) => ({
          historical: {
            ...state.historical,
            [city]: [...(state.historical[city] || []), data].slice(-24), // Keep last 24 records
          },
        })),

      clearHistoricalData: (city) =>
        set((state) => ({
          historical: {
            ...state.historical,
            [city]: [],
          },
        })),

      // Fetch weather data from API
      fetchWeatherData: async () => {
        const {
          city,
          units,
          apiKey,
          selectedAPI,
          setData,
          setLoading,
          setError,
          setLastUpdated,
          addHistoricalData,
        } = get();

        if (!apiKey) {
          setError("请在设置中提供 API 密钥。");
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const data = await selectedAPI.fetchWeather(city, units, apiKey);
          setData(data);
          setLastUpdated(new Date());
          addHistoricalData(city, data);
        } catch (err: any) {
          setError(err.message || "获取天气数据时出错。");
        } finally {
          setLoading(false);
        }
      },

      // Fetch historical weather data
      fetchHistoricalData: async (city, days) => {
        const { apiKey, units, selectedAPI, setError, setLoading } = get();

        if (!apiKey) {
          setError("请在设置中提供 API 密钥。");
          return;
        }

        setLoading(true);
        setError(null);

        try {
          // 实现历史数据获取逻辑
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall/timemachine?q=${city}&units=${units}&appid=${apiKey}&cnt=${days}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch historical data");
          }
          const data = await response.json();
          set((state) => ({
            historical: {
              ...state.historical,
              [city]: data,
            },
          }));
        } catch (err: any) {
          setError(err.message || "获取历史数据时出错。");
        } finally {
          setLoading(false);
        }
      },

      // Fetch forecast data
      fetchForecastData: async (city, days) => {
        const { apiKey, units, selectedAPI, setError, setLoading } = get();

        if (!apiKey) {
          setError("请在设置中提供 API 密钥。");
          return [];
        }

        setLoading(true);
        setError(null);

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}&cnt=${days}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch forecast data");
          }
          const data = await response.json();
          return data.list;
        } catch (err: any) {
          setError(err.message || "获取预报数据时出错。");
          return [];
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        apiKey: state.apiKey,
        favorites: state.favorites,
        darkMode: state.darkMode,
        units: state.units,
        selectedAPI: state.selectedAPI,
      }),
    }
  )
);
