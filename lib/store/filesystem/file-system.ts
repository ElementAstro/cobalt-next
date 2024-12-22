import { create } from "zustand";

interface FileSystemStore {
  currentPath: string;
  selectedFiles: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "size" | "type" | "date";
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: string | null;

  setCurrentPath: (path: string) => void;
  setSelectedFiles: (files: string[]) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "name" | "size" | "type" | "date") => void;
  toggleSortOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFileSystemStore = create<FileSystemStore>((set) => ({
  currentPath: "/",
  selectedFiles: [],
  viewMode: "grid",
  sortBy: "name",
  sortOrder: "asc",
  loading: false,
  error: null,

  setCurrentPath: (path) => set({ currentPath: path }),
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleSortOrder: () =>
    set((state) => ({
      sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
