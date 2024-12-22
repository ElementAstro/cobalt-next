import { create } from "zustand";

interface Tag {
  value: string;
  description: string;
}

interface Section {
  title: string;
  icon: string;
  tags: Tag[];
}

interface ImageSettingsState {
  filePath: string;
  filePattern: string;
  darkMode: boolean;
  autoSave: boolean;
  compressionLevel: number;
  tags: Tag[];
  filePatternConfig: {
    sections: Section[];
  };
  setFilePath: (path: string) => void;
  setFilePattern: (pattern: string) => void;
  setDarkMode: (isDark: boolean) => void;
  setAutoSave: (isAutoSave: boolean) => void;
  setCompressionLevel: (level: number) => void;
  addTag: (tag: Tag) => void;
  removeTag: (index: number) => void;
  reorderTags: (newOrder: Tag[]) => void;
  setFilePatternConfig: (config: { sections: Section[] }) => void;
}

export const useImageSettingsStore = create<ImageSettingsState>((set) => ({
  filePath: "C:/Users/Documents/Images",
  filePattern: "",
  darkMode: false,
  autoSave: true,
  compressionLevel: 5,
  tags: [],
  filePatternConfig: {
    sections: [
      {
        title: "Time Parameters",
        icon: "Settings",
        tags: [
          { value: "$$DATE$$", description: "Date with format YYYY-MM-DD" },
          { value: "$$TIME$$", description: "Time with format HH-mm-ss" },
          { value: "$$DATEMINUS12$$", description: "Date 12 hours ago" },
        ],
      },
      {
        title: "Camera Settings",
        icon: "Camera",
        tags: [
          { value: "$$CAMERA$$", description: "Camera name" },
          { value: "$$GAIN$$", description: "Camera gain" },
          { value: "$$SENSORTEMP$$", description: "Camera temperature" },
        ],
      },
      {
        title: "Image Properties",
        icon: "Image",
        tags: [
          {
            value: "$$EXPOSURETIME$$",
            description: "Camera exposure time, in seconds",
          },
          {
            value: "$$FRAMENR$$",
            description: "# of the frame with format ####",
          },
          {
            value: "$$IMAGETYPE$$",
            description: "Light, Flat, Dark, Bias, Snapshot",
          },
        ],
      },
      {
        title: "Guider Settings",
        icon: "Crosshair",
        tags: [
          {
            value: "$$PEAKDEC$$",
            description: "Peak Dec guiding error during exposure in pixels",
          },
          {
            value: "$$PEAKRA$$",
            description: "Peak RA guiding error during exposure in pixels",
          },
        ],
      },
    ],
  },
  setFilePath: (path) => set({ filePath: path }),
  setFilePattern: (pattern) => set({ filePattern: pattern }),
  setDarkMode: (isDark) => set({ darkMode: isDark }),
  setAutoSave: (isAutoSave) => set({ autoSave: isAutoSave }),
  setCompressionLevel: (level) => set({ compressionLevel: level }),
  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, tag],
      filePattern:
        state.filePattern + (state.filePattern ? "_" : "") + tag.value,
    })),
  removeTag: (index) =>
    set((state) => {
      const newTags = state.tags.filter((_, i) => i !== index);
      return {
        tags: newTags,
        filePattern: newTags.map((tag) => tag.value).join("_"),
      };
    }),
  reorderTags: (newOrder) =>
    set({
      tags: newOrder,
      filePattern: newOrder.map((tag) => tag.value).join("_"),
    }),
  setFilePatternConfig: (config) => set({ filePatternConfig: config }),
}));
