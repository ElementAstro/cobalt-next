import { create } from "zustand";

export interface TargetSettings {
  delayStart: string;
  sequenceMode: string;
  estimatedDownload: string;
  startTime: string;
  endTime: string;
  duration: string;
  retryCount?: number;
  timeout?: number;
}

interface TargetState {
  settings: TargetSettings;
  setSetting: (field: keyof TargetSettings, value: string) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: TargetSettings = {
  delayStart: "0",
  sequenceMode: "one-after-another",
  estimatedDownload: "00:00:00",
  startTime: "15:39",
  endTime: "15:39",
  duration: "01s",
  retryCount: 0,
  timeout: 0,
};

export const useTargetStore = create<TargetState>((set) => ({
  settings: DEFAULT_SETTINGS,
  setSetting: (field, value) =>
    set((state) => ({
      settings: { ...state.settings, [field]: value },
    })),
  saveSettings: () => {
    const settings = (set as any).getState().settings;
    localStorage.setItem("targetSettings", JSON.stringify(settings));
    alert("设置已保存");
  },
  resetSettings: () =>
    set({
      settings: DEFAULT_SETTINGS,
    }),
}));

// 在应用启动时加载保存的设置
if (typeof window !== "undefined") {
  const savedSettings = localStorage.getItem("targetSettings");
  if (savedSettings) {
    useTargetStore.setState({ settings: JSON.parse(savedSettings) });
  }
}
