import { create } from "zustand";
import {
  Plugin,
  Review,
  User as UserType,
  SearchFilters,
} from "@/types/plugin";

interface PluginStore {
  plugins: Plugin[];
  activeTab: string;
  currentUser: UserType | null;
  reviews: Review[];
  searchFilters: SearchFilters;
  setActiveTab: (tab: string) => void;
  installPlugin: (id: number) => void;
  uninstallPlugin: (id: number) => void;
  addReview: (review: Review) => void;
  setCurrentUser: (user: UserType | null) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  searchPlugins: (query: string) => Plugin[];
}

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: [],
  activeTab: "",
  currentUser: null,
  reviews: [],
  searchFilters: {},
  setActiveTab: (tab) => set({ activeTab: tab }),
  installPlugin: (id) => {
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === id ? { ...plugin, installed: true } : plugin
      ),
    }));
  },
  uninstallPlugin: (id) => {
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === id ? { ...plugin, installed: false } : plugin
      ),
    }));
  },
  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, review],
      plugins: state.plugins.map((plugin) =>
        plugin.id === review.pluginId
          ? { ...plugin, reviews: [...plugin.reviews, review] }
          : plugin
      ),
    })),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  searchPlugins: (query) =>
    get().plugins.filter((plugin) =>
      plugin.name.toLowerCase().includes(query.toLowerCase())
    ),
}));
