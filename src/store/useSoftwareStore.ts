import { Software } from "@/types/software";
import { create } from "zustand";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import wsClient from "@/utils/ws-client";
import * as z from "zod";

const SoftwareSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  author: z.string(),
  date: z.string(),
  size: z.string(),
  icon: z.string(),
  isInstalled: z.boolean(),
  hasUpdate: z.boolean(),
  isFavorite: z.boolean(),
  isUpdating: z.boolean(),
  autoUpdate: z.boolean(),
  category: z.string(),
  description: z.string(),
  rating: z.number(),
  reviews: z.number(),
  tags: z.array(z.string()),
  requirements: z.object({
    os: z.array(z.string()),
    processor: z.string(),
    memory: z.string(),
    graphics: z.string(),
    storage: z.string(),
  }),
  screenshots: z.array(z.string()),
  lastUpdated: z.string(),
  releaseNotes: z.string(),
  license: z.string(),
  dependencies: z.array(z.string()),
});

export default SoftwareSchema;

const SoftwareUpdateMessageSchema = z.object({
  software: z.array(SoftwareSchema),
});

interface TempDataPoint {
  time: string;
  temperature: number;
}

export interface SoftwareState {
  view: View;
  software: Software[];
  themeMode: ThemeMode;
  sortBy: SortBy;
  orderBy: OrderBy;
  searchQuery: string;
  selectedSoftware: Software | null;
  favorites: Set<string>;
  filterBy: FilterBy;
  currentPage: number;
  viewMode: ViewMode;
  selectedCategory: CategoryType;
  installingMap: Map<string, number>;
  updatingMap: Map<string, number>;
  selectedTags: Set<string>;
  showScreenshots: boolean;
  compareList: Set<string>;

  setView: (view: View) => void;
  setSoftware: (software: Software[]) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSortBy: (sort: SortBy) => void;
  setOrderBy: (order: OrderBy) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSoftware: (software: Software | null) => void;
  toggleFavorite: (id: string) => void;
  setFilterBy: (filter: FilterBy) => void;
  setCurrentPage: (page: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedCategory: (category: CategoryType) => void;
  updateInstallProgress: (id: string, progress: number) => void;
  updateUpdateProgress: (id: string, progress: number) => void;
  toggleTag: (tag: string) => void;
  toggleScreenshots: () => void;
  toggleCompare: (id: string) => void;
}

type View = "list" | "grid" | "detail";
type ThemeMode = "dark" | "light" | "system";
export type SortBy =
  | "name-asc"
  | "name-desc"
  | "date-asc"
  | "date-desc"
  | "size-asc"
  | "size-desc"
  | "author-asc"
  | "author-desc";
type OrderBy = "asc" | "desc";
export type FilterBy = "all" | "system" | "local";
type ViewMode = "comfortable" | "compact";
type CategoryType = "all" | "category1" | "category2";

export const useSoftwareStore = create<SoftwareState>((set, get) => {
  if (!wsClient) {
    throw new Error("WebSocket client is not initialized");
  }

  const messageBus = new MessageBus(wsClient, {
    logLevel: LogLevel.INFO,
    maxRetries: 3,
    retryDelay: 1000,
  });

  messageBus.use((message, topic, next) => {
    if (topic === "software/update") {
      try {
        const parsed = SoftwareUpdateMessageSchema.parse(message);
        console.info(`Received software update:`, parsed);
        next();
      } catch (error) {
        console.error("Software update message validation failed:", error);
      }
    } else {
      next();
    }
  });

  messageBus.subscribe("software/update", (message) => {
    try {
      const parsed = SoftwareUpdateMessageSchema.parse(message);
      set({ software: parsed.software });
    } catch (error) {
      console.error("Error handling software update message:", error);
    }
  });

  messageBus.subscribe("software/error", (error) => {
    console.error("Software error received:", error);
  });

  // 清理函数
  const cleanup = () => {
    console.info("Cleaning up WebSocket and message bus subscriptions");
    messageBus.getTopics().forEach((topic) => {
      messageBus.clearTopic(topic);
    });
    if (wsClient) {
      wsClient.close();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", cleanup);
  }

  return {
    view: "list",
    software: [],
    themeMode: "system",
    sortBy: "name-asc",
    orderBy: "asc",
    searchQuery: "",
    selectedSoftware: null,
    favorites: new Set(),
    filterBy: "all",
    currentPage: 1,
    viewMode: "comfortable",
    selectedCategory: "all",
    installingMap: new Map(),
    updatingMap: new Map(),
    selectedTags: new Set(),
    showScreenshots: true,
    compareList: new Set(),

    setView: (view) => set({ view }),
    setSoftware: (software) => set({ software }),
    setThemeMode: (mode) => set({ themeMode: mode }),
    setSortBy: (sort) => set({ sortBy: sort }),
    setOrderBy: (order) => set({ orderBy: order }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedSoftware: (software) => set({ selectedSoftware: software }),
    toggleFavorite: (id) =>
      set((state) => {
        const newFavorites = new Set(state.favorites);
        if (newFavorites.has(id)) {
          newFavorites.delete(id);
        } else {
          newFavorites.add(id);
        }
        return { favorites: newFavorites };
      }),
    setFilterBy: (filter) => set({ filterBy: filter }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    updateInstallProgress: (id, progress) =>
      set((state) => {
        const newMap = new Map(state.installingMap);
        newMap.set(id, progress);
        if (progress >= 100) newMap.delete(id);
        return { installingMap: newMap };
      }),
    updateUpdateProgress: (id, progress) =>
      set((state) => {
        const newMap = new Map(state.updatingMap);
        newMap.set(id, progress);
        if (progress >= 100) newMap.delete(id);
        return { updatingMap: newMap };
      }),
    toggleTag: (tag) =>
      set((state) => {
        const newTags = new Set(state.selectedTags);
        if (newTags.has(tag)) {
          newTags.delete(tag);
        } else {
          newTags.add(tag);
        }
        return { selectedTags: newTags };
      }),
    toggleScreenshots: () =>
      set((state) => ({ showScreenshots: !state.showScreenshots })),
    toggleCompare: (id) =>
      set((state) => {
        const newCompareList = new Set(state.compareList);
        if (newCompareList.has(id)) {
          newCompareList.delete(id);
        } else {
          newCompareList.add(id);
        }
        return { compareList: newCompareList };
      }),
  };
});
