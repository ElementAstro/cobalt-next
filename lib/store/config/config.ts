import { create } from "zustand";
import { SettingsState, SettingsData, SettingValue } from "../types/settings";

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: [],
  isLoading: false,
  error: null,

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
}));
