import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  autoLaunch: boolean;
  notificationsEnabled: boolean;
  updateInterval: number;
  language: string;
  shortcuts: Record<string, string>;
  appearance: {
    theme: 'system' | 'light' | 'dark';
    accentColor: string;
    fontSize: number;
    compactMode: boolean;
  };
  performance: {
    animations: boolean;
    reducedMotion: boolean;
    prefetch: boolean;
    cacheTimeout: number;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: number;
    backupLocation: string;
  };
}

interface SettingsActions {
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
  toggleSetting: (key: keyof SettingsState) => void;
  setSetting: <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => void;
}

const defaultSettings: SettingsState = {
  autoLaunch: false,
  notificationsEnabled: true,
  updateInterval: 3600,
  language: 'zh-CN',
  shortcuts: {
    search: 'ctrl+space',
    settings: 'ctrl+,',
    newApp: 'ctrl+n',
  },
  appearance: {
    theme: 'system',
    accentColor: '#0066cc',
    fontSize: 14,
    compactMode: false,
  },
  performance: {
    animations: true,
    reducedMotion: false,
    prefetch: true,
    cacheTimeout: 3600,
  },
  backup: {
    autoBackup: true,
    backupInterval: 86400,
    backupLocation: 'local',
  },
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({ ...state, ...newSettings })),
      resetSettings: () => set(defaultSettings),
      toggleSetting: (key) =>
        set((state) => ({
          ...state,
          [key]: !state[key],
        })),
      setSetting: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),
    }),
    {
      name: 'app-settings',
    }
  )
);
