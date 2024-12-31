import { create } from "zustand";
import { z } from "zod";
import log from "@/utils/logger"; // Import the logger

// 定义 Tag 和 Section 的 Zod 模式
const TagSchema = z.object({
  value: z.string(),
  description: z.string(),
});

const SectionSchema = z.object({
  title: z.string(),
  icon: z.string(),
  tags: z.array(TagSchema),
});

// 定义 ImageSettingsState 的 Zod 模式
const ImageSettingsStateSchema = z.object({
  filePath: z.string(),
  filePattern: z.string(),
  darkMode: z.boolean(),
  autoSave: z.boolean(),
  compressionLevel: z.number().int().min(1).max(10),
  tags: z.array(TagSchema),
  filePatternConfig: z.object({
    sections: z.array(SectionSchema),
  }),
});

// 类型定义
type Tag = z.infer<typeof TagSchema>;
type Section = z.infer<typeof SectionSchema>;
type ImageSettingsState = z.infer<typeof ImageSettingsStateSchema> & {
  setFilePath: (path: string) => void;
  setFilePattern: (pattern: string) => void;
  setDarkMode: (isDark: boolean) => void;
  setAutoSave: (isAutoSave: boolean) => void;
  setCompressionLevel: (level: number) => void;
  addTag: (tag: Tag) => void;
  removeTag: (index: number) => void;
  reorderTags: (newOrder: Tag[]) => void;
  setFilePatternConfig: (config: { sections: Section[] }) => void;
};

// 默认状态
const defaultState: Omit<
  ImageSettingsState,
  | "setFilePath"
  | "setFilePattern"
  | "setDarkMode"
  | "setAutoSave"
  | "setCompressionLevel"
  | "addTag"
  | "removeTag"
  | "reorderTags"
  | "setFilePatternConfig"
> = {
  filePath: "C:/Users/Documents/Images",
  filePattern: "",
  darkMode: true,
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
};

// 创建 Zustand store 并实现状态持久化
export const useImageSettingsStore = create<ImageSettingsState>((set) => {
  // 从 localStorage 加载已保存的状态
  let initialState = defaultState;

  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("imageSettings");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const result = ImageSettingsStateSchema.safeParse(parsed);
        if (result.success) {
          initialState = { ...defaultState, ...result.data };
          log.info("Loaded state from localStorage:", initialState);
        } else {
          log.error("LocalStorage 中的状态验证失败:", result.error);
        }
      } catch (error) {
        log.error("解析 LocalStorage 中的状态时出错:", error);
      }
    }
  }

  return {
    ...initialState,
    setFilePath: (path: string) => {
      log.info(`Setting filePath to: ${path}`);
      set({ filePath: path });
    },
    setFilePattern: (pattern: string) => {
      log.info(`Setting filePattern to: ${pattern}`);
      set({ filePattern: pattern });
    },
    setDarkMode: (isDark: boolean) => {
      log.info(`Setting darkMode to: ${isDark}`);
      set({ darkMode: isDark });
    },
    setAutoSave: (isAutoSave: boolean) => {
      log.info(`Setting autoSave to: ${isAutoSave}`);
      set({ autoSave: isAutoSave });
    },
    setCompressionLevel: (level: number) => {
      log.info(`Setting compressionLevel to: ${level}`);
      set({ compressionLevel: level });
    },
    addTag: (tag: Tag) => {
      log.info(`Adding tag: ${tag.value}`);
      set((state) => ({
        tags: [...state.tags, tag],
        filePattern:
          state.filePattern + (state.filePattern ? "_" : "") + tag.value,
      }));
    },
    removeTag: (index: number) => {
      log.info(`Removing tag at index: ${index}`);
      set((state) => {
        const newTags = state.tags.filter((_, i) => i !== index);
        return {
          tags: newTags,
          filePattern: newTags.map((tag) => tag.value).join("_"),
        };
      });
    },
    reorderTags: (newOrder: Tag[]) => {
      log.info("Reordering tags:", newOrder);
      set({
        tags: newOrder,
        filePattern: newOrder.map((tag) => tag.value).join("_"),
      });
    },
    setFilePatternConfig: (config: { sections: Section[] }) => {
      log.info("Setting filePatternConfig:", config);
      set({ filePatternConfig: config });
    },
  };
});

// 订阅 Zustand store 的变化并保存到 localStorage
useImageSettingsStore.subscribe((state) => {
  try {
    // 验证状态
    ImageSettingsStateSchema.parse(state);
    // 保存到 localStorage
    localStorage.setItem("imageSettings", JSON.stringify(state));
    log.info("State saved to localStorage:", state);
  } catch (error) {
    log.error("保存状态到 LocalStorage 时出错:", error);
  }
});
