import { create } from "zustand";

export interface UpdateLog {
  version: string;
  date: string;
  changes: string[];
}

interface UpdateLogState {
  logs: UpdateLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
}

export const useUpdateLogStore = create<UpdateLogState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,
  fetchLogs: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/update-logs");
      if (!response.ok) {
        throw new Error("Failed to fetch update logs");
      }
      const data = await response.json();
      set({ logs: data, isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
