import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AdvancedSettings } from "@/types/connection";

interface SettingsStore {
  settings: AdvancedSettings;
  errors: { [key: string]: string };
  isLoading: boolean;
  setSettings: (settings: Partial<AdvancedSettings>) => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
  setLoading: (state: boolean) => void;
  validateField: (field: string, value: any) => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        settings: {
          updateInterval: 1000,
          connectionTimeout: 30,
          debugMode: false,
          newSetting: "",
          theme: "dark",
          notifications: true,
          autoSave: true,
          language: "zh-CN",
          maxConnections: 5,
          bufferSize: 100,
          autoBackup: true,
          backupInterval: 24,
        },
        errors: {},
        isLoading: false,

        setSettings: (newSettings) =>
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          })),

        setError: (field, error) =>
          set((state) => ({
            errors: { ...state.errors, [field]: error },
          })),

        clearErrors: () => set({ errors: {} }),

        setLoading: (loading) => set({ isLoading: loading }),

        validateField: (field: string, value: any) => {
          let error = "";
          switch (field) {
            case "updateInterval":
              if (value < 500 || value > 10000) {
                error = "更新间隔必须在500ms到10000ms之间";
              }
              break;
            case "connectionTimeout":
              if (value < 10 || value > 120) {
                error = "连接超时必须在10秒到120秒之间";
              }
              break;
          }
          set((state) => ({
            errors: { ...state.errors, [field]: error },
          }));
          return error === "";
        },
      }),
      {
        name: "settings-storage",
      }
    )
  )
);