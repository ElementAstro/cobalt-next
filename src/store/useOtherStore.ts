import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Dependency = {
  name: string;
  version: string;
  latestVersion?: string;
  license: string;
  description: string;
  status?: "up-to-date" | "update-available" | "outdated";
  dependencies?: string[];
};

type DependencyStore = {
  dependencies: Dependency[];
  isLoading: boolean;
  isChecking: boolean;
  search: string;
  currentPage: number;
  sortColumn: keyof Dependency;
  sortDirection: "asc" | "desc";
  setDependencies: (dependencies: Dependency[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsChecking: (isChecking: boolean) => void;
  setSearch: (search: string) => void;
  setCurrentPage: (page: number) => void;
  setSortColumn: (column: keyof Dependency) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
};

export const useDependencyStore = create<DependencyStore>()(
  persist(
    (set) => ({
      dependencies: [],
      isLoading: true,
      isChecking: false,
      search: "",
      currentPage: 1,
      sortColumn: "name",
      sortDirection: "asc",
      setDependencies: (dependencies) => set({ dependencies }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsChecking: (isChecking) => set({ isChecking }),
      setSearch: (search) => set({ search }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setSortColumn: (sortColumn) => set({ sortColumn }),
      setSortDirection: (sortDirection) => set({ sortDirection }),
    }),
    {
      name: "dependency-storage",
    }
  )
);
