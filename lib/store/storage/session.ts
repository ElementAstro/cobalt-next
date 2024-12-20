import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StorageItem {
  key: string;
  value: string;
}

interface SessionStorageState {
  items: StorageItem[];
  settings: {
    theme: "light" | "dark";
    itemsPerPage: number;
    showValuePreview: boolean;
  };
  currentPage: number;
  setItems: (items: StorageItem[]) => void;
  addItem: (key: string, value: string) => void;
  editItem: (oldKey: string, newKey: string, value: string) => void;
  deleteItem: (key: string) => void;
  updateSettings: (settings: Partial<SessionStorageState["settings"]>) => void;
  setCurrentPage: (page: number) => void;
}

export const useSessionStorageStore = create<SessionStorageState>()(
  persist(
    (set, get) => ({
      items: [],
      settings: {
        theme: "dark",
        itemsPerPage: 5,
        showValuePreview: true,
      },
      currentPage: 1,
      setItems: (items) => set({ items }),
      addItem: (key, value) => {
        const { items } = get();
        set({ items: [...items, { key, value }] });
        sessionStorage.setItem(key, value);
      },
      editItem: (oldKey, newKey, value) => {
        const { items } = get();
        const newItems = items.map((item) =>
          item.key === oldKey ? { key: newKey, value } : item
        );
        set({ items: newItems });
        if (oldKey !== newKey) {
          sessionStorage.removeItem(oldKey);
        }
        sessionStorage.setItem(newKey, value);
      },
      deleteItem: (key) => {
        const { items } = get();
        set({ items: items.filter((item) => item.key !== key) });
        sessionStorage.removeItem(key);
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: "session-storage-store",
    }
  )
);
