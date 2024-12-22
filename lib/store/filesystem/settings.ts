import { create } from "zustand";
import { CustomizationOptions } from "@/types/filesystem";

interface SettingsState {
  options: CustomizationOptions;
  setOptions: (options: CustomizationOptions) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  options: {
    isOpen: false,
    onClose: () => {},
    options: {
      gridSize: "medium",
      showHiddenFiles: false,
      listView: "comfortable",
      sortBy: "name",
      sortDirection: "asc",
      thumbnailQuality: "medium",
      autoBackup: false,
      defaultView: "grid"
    },
    setOptions: () => {}
  },
  setOptions: (options) => set({ options }),
}));