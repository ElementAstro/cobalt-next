import { Software } from "@/types/software";
import { create } from "zustand";

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

export const useSoftwareStore = create<SoftwareState>((set) => ({
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
}));