import {create} from "zustand";

import { LogEntry } from "@/types/log";

interface LogState {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  filter: string;
  search: string;
  isCollapsed: boolean;
  logCount: number;
  isPaginationEnabled: boolean;
  currentPage: number;
  selectedLogs: number[];
  activeTab: string;
  selectedLogForNote: LogEntry | null;
  newNote: string;
  newTag: string;
  isRealTimeEnabled: boolean;
  exportFormat: "json" | "csv";
  comparisonTimeRange: "1h" | "24h" | "7d";
  isMockMode: boolean;
  theme: "light" | "dark";
  setLogs: (logs: LogEntry[]) => void;
  setFilteredLogs: (logs: LogEntry[]) => void;
  setFilter: (filter: string) => void;
  setSearch: (search: string) => void;
  setIsCollapsed: (collapsed: boolean) => void;
  setLogCount: (count: number) => void;
  setIsPaginationEnabled: (enabled: boolean) => void;
  setCurrentPage: (page: number) => void;
  setSelectedLogs: (ids: number[]) => void;
  setActiveTab: (tab: string) => void;
  setSelectedLogForNote: (log: LogEntry | null) => void;
  setNewNote: (note: string) => void;
  setNewTag: (tag: string) => void;
  setIsRealTimeEnabled: (enabled: boolean) => void;
  setExportFormat: (format: "json" | "csv") => void;
  setComparisonTimeRange: (range: "1h" | "24h" | "7d") => void;
  setIsMockMode: (mode: boolean) => void;
  toggleTheme: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  filteredLogs: [],
  filter: "",
  search: "",
  isCollapsed: false,
  logCount: 1000,
  isPaginationEnabled: false,
  currentPage: 1,
  selectedLogs: [],
  activeTab: "logs",
  selectedLogForNote: null,
  newNote: "",
  newTag: "",
  isRealTimeEnabled: true,
  exportFormat: "json",
  comparisonTimeRange: "24h",
  isMockMode: false,
  theme: "dark",
  setLogs: (logs) => set({ logs }),
  setFilteredLogs: (filteredLogs) => set({ filteredLogs }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
  setLogCount: (logCount) => set({ logCount }),
  setIsPaginationEnabled: (isPaginationEnabled) => set({ isPaginationEnabled }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setSelectedLogs: (selectedLogs) => set({ selectedLogs }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedLogForNote: (selectedLogForNote) => set({ selectedLogForNote }),
  setNewNote: (newNote) => set({ newNote }),
  setNewTag: (newTag) => set({ newTag }),
  setIsRealTimeEnabled: (isRealTimeEnabled) => set({ isRealTimeEnabled }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setComparisonTimeRange: (comparisonTimeRange) => set({ comparisonTimeRange }),
  setIsMockMode: (isMockMode) => set({ isMockMode }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
