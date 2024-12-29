import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SettingsState, SettingValue } from "@/types/config";
import { getSettingByPath } from "@/utils/config-utils";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: [],
      isLoading: false,
      error: null,
      history: [],
      tags: [],
      searchQuery: "",
      activeCategory: null,
      activeTags: [],

      fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/settings");
          if (!response.ok) throw new Error("Failed to fetch settings");
          const data = await response.json();
          set({ settings: data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateSetting: async (path: string[], value: SettingValue) => {
        const state = get();
        const oldValue = getSettingByPath(state.settings, path)?.value ?? null;
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, value }),
          });
          if (!response.ok) throw new Error("Failed to update setting");
          const data = await response.json();
          set({ settings: data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
        state.addHistoryEntry({
          timestamp: Date.now(),
          path,
          oldValue,
          newValue: value,
        });
      },

      resetSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/settings", { method: "PUT" });
          if (!response.ok) throw new Error("Failed to reset settings");
          const data = await response.json();
          set({ settings: data, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addHistoryEntry: (entry) => {
        set((state) => ({
          history: [...state.history.slice(-99), entry],
        }));
      },

      clearHistory: () => set({ history: [] }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setActiveCategory: (category) => set({ activeCategory: category }),

      setActiveTags: (tags) => set({ activeTags: tags }),

      exportSettings: async () => {
        const settings = get().settings;
        const blob = new Blob([JSON.stringify(settings, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "settings.json";
        a.click();
        URL.revokeObjectURL(url);
      },

      importSettings: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await fetch("/api/settings/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          await get().fetchSettings();
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        history: state.history,
        activeTags: state.activeTags,
        activeCategory: state.activeCategory,
      }),
    }
  )
);
