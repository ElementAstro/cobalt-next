import { create } from 'zustand';

interface FilterOptions {
  searchTerm: string;
  propertyTypes: string[];
  propertyStates: string[];
  groups: string[];
}

interface INDIPanelState {
  // Filter state
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  
  // UI state
  showAdvancedFilter: boolean;
  setShowAdvancedFilter: (show: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  
  // Property state
  selectedProperties: Set<string>;
  setSelectedProperties: (properties: Set<string>) => void;
  
  // Auto refresh
  autoRefreshInterval: number;
  setAutoRefreshInterval: (interval: number) => void;
  
  // Logs
  logs: string[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const useINDIPanelStore = create<INDIPanelState>((set) => ({
  filterOptions: {
    searchTerm: "",
    propertyTypes: [],
    propertyStates: [],
    groups: [],
  },
  setFilterOptions: (options) => set({ filterOptions: options }),
  
  showAdvancedFilter: false,
  setShowAdvancedFilter: (show) => set({ showAdvancedFilter: show }),
  
  darkMode: true,
  setDarkMode: (darkMode) => set({ darkMode }),
  
  showDashboard: true,
  setShowDashboard: (show) => set({ showDashboard: show }),
  
  selectedProperties: new Set(),
  setSelectedProperties: (properties) => set({ selectedProperties: properties }),
  
  autoRefreshInterval: 0,
  setAutoRefreshInterval: (interval) => set({ autoRefreshInterval: interval }),
  
  logs: [],
  addLog: (message) => set((state) => ({ logs: [...state.logs, message] })),
  clearLogs: () => set({ logs: [] }),
}));
