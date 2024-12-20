import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryItem {
  id: string;
  config: {
    method: string;
    url: string;
    timestamp: number;
  };
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (config: { method: string; url: string }) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  selectHistory: (id: string) => HistoryItem | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (config) => {
        const newHistory: HistoryItem = {
          id: Date.now().toString(),
          config: {
            ...config,
            timestamp: Date.now(),
          },
        };
        set({ history: [newHistory, ...get().history] });
      },
      removeHistory: (id) => {
        set({ history: get().history.filter((item) => item.id !== id) });
      },
      clearHistory: () => {
        set({ history: [] });
      },
      selectHistory: (id) => {
        return get().history.find((item) => item.id === id);
      },
    }),
    {
      name: "history-storage", // 存储名称
    }
  )
);
