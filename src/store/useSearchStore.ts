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

  // Actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
  toggleFavorite: (objectId: string) => void;
  fetchObjects: () => Promise<void>;
  fetchRealTimeData: () => Promise<void>;
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
          set({ realTimeData: data });
        } catch (error) {
          console.error("Failed to fetch real-time data:", error);
        }
      },
    }),
    {
      name: "search-store",
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

export default useSearchStore;
