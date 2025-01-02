import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CelestialObject,
  SearchFilters,
  RealTimeData,
} from "@/types/search";

interface SearchState {
  searchTerm: string;
  filters: SearchFilters;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  objects: CelestialObject[];
  favorites: string[];
  realTimeData: RealTimeData | null;
  isLoading: boolean;
  showAdvanced: boolean;
  showSuggestions: boolean;
  suggestions: CelestialObject[];
  searchHistory: string[];

  // Actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
  toggleFavorite: (objectId: string) => void;
  setObjects: (objects: CelestialObject[]) => void;
  fetchObjects: () => Promise<void>;
  fetchRealTimeData: () => Promise<void>;
  setShowAdvanced: (show: boolean) => void;
  setShowSuggestions: (show: boolean) => void;
  setSuggestions: (suggestions: CelestialObject[]) => void;
  addToHistory: (term: string) => void;
  clearHistory: () => void;
}

const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      searchTerm: "",
      filters: {
        constellations: [],
        types: [],
        minMagnitude: -30,
        maxMagnitude: 30,
        minDistance: 0,
        maxDistance: 1000000,
      },
      sortBy: "name",
      sortOrder: "asc",
      currentPage: 1,
      itemsPerPage: 10,
      objects: [],
      favorites: [],
      realTimeData: null,
      isLoading: false,
      showAdvanced: false,
      showSuggestions: false,
      suggestions: [],
      searchHistory: [],

      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),

      setFilters: (filters) => set({ filters, currentPage: 1 }),

      setSortBy: (sortBy) => set({ sortBy }),

      setSortOrder: (order) => set({ sortOrder: order }),

      setCurrentPage: (page) => set({ currentPage: page }),

      toggleFavorite: (objectId) => {
        set((state) => {
          const favorites = state.favorites.includes(objectId)
            ? state.favorites.filter((id) => id !== objectId)
            : [...state.favorites, objectId];
          return { favorites };
        });
      },

      setObjects: (objects) =>
        set({
          objects: objects.map((obj) => ({
            ...obj,
            riseTime: obj.riseTime || "N/A",
            setTime: obj.setTime || "N/A",
            transitTime: obj.transitTime || "N/A",
          })),
        }),

      fetchObjects: async () => {
        set({ isLoading: true });
        try {
          // 这里应该是真实的API调用
          const response = await fetch("/api/celestial-objects");
          const data = await response.json();
          set({ objects: data, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch objects:", error);
          set({ isLoading: false });
        }
      },

      fetchRealTimeData: async () => {
        try {
          const response = await fetch("/api/real-time-data");
          const data = await response.json();
          // Ensure the response matches the expected structure
          const realTimeData = {
            ...data,
            weather: {
              cloudCover: data.weather?.cloudCover || 0,
              temperature: data.weather?.temperature || 0,
              humidity: data.weather?.humidity || 0,
              windSpeed: data.weather?.windSpeed || 0,
              pressure: data.weather?.pressure || 1013,
              visibility: data.weather?.visibility || 10,
            },
            astronomical: {
              sunAltitude: data.astronomical?.sunAltitude || 0,
              moonAltitude: data.astronomical?.moonAltitude || 0,
              twilight: data.astronomical?.twilight || 'none',
              seeing: data.astronomical?.seeing || 1.0,
            }
          };
          set({ realTimeData });
        } catch (error) {
          console.error("Failed to fetch real-time data:", error);
        }
      },

      setShowAdvanced: (show) => set({ showAdvanced: show }),
      setShowSuggestions: (show) => set({ showSuggestions: show }),
      setSuggestions: (suggestions) => set({ suggestions }),

      addToHistory: (term) => {
        if (!term.trim()) return;
        set((state) => {
          const newHistory = [
            term,
            ...state.searchHistory.filter((h) => h !== term),
          ].slice(0, 5);
          return { searchHistory: newHistory };
        });
      },

      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: "search-store",
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
      }),
    }
  )
);

export default useSearchStore;
