import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import {
  HistoryEntry,
  SettingBatch,
  SettingValue,
  Setting,
  SettingGroup,
  ValidationRule,
  HistoryItem,
} from "@/types/config";
import { getSettingByPath } from "@/utils/config-utils";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import WebSocketClient from "@/utils/websocket-client";
import log from "@/utils/logger";
import { debounce } from "lodash";

// 定义zod模式
const updateSettingSchema = z.object({
  path: z.array(z.string()).min(1),
  value: z.any(),
});

const importSettingsSchema = z.object({
  data: z.any(),
});

export interface SettingsState {
  settings: any[];
  isLoading: boolean;
  error: string | null;
  history: HistoryItem[];
  tags: string[];
  searchQuery: string;
  activeCategory: string | null;
  activeTags: string[];

  fetchSettings: () => Promise<void>;
  updateSetting: (path: string[], value: SettingValue) => Promise<void>;
  resetSettings: () => Promise<void>;
  addHistoryEntry: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string | null) => void;
  setActiveTags: (tags: string[]) => void;
  exportSettings: () => Promise<void>;
  importSettings: (data: any) => Promise<void>;
  batchUpdate: (batch: SettingBatch) => Promise<void>;
  validateSettings: () => Promise<boolean>;
  debouncedUpdate: (path: string[], value: SettingValue) => void;
  subscribeToChanges: (callback: (message: any) => void) => () => void;
  addHistoryItem: (item: Omit<HistoryItem, "id">) => void;
  revertHistoryItem: (id: string) => Promise<void>;
}

const wsClient = new WebSocketClient({
  url: "ws://localhost:8080/config",
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  debug: true,
});
const messageBus = new MessageBus(wsClient, { logLevel: LogLevel.DEBUG });

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
        log.info("开始获取设置");
        try {
          const response = await fetch("/api/settings");
          if (!response.ok) {
            log.error("获取设置失败", response.statusText);
            throw new Error("Failed to fetch settings");
          }
          const data = await response.json();
          set({ settings: data, isLoading: false });
          log.info("设置获取成功");
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          log.error("获取设置时出错", error);
        }
      },

      updateSetting: async (path: string[], value: SettingValue) => {
        const parsed = updateSettingSchema.safeParse({ path, value });
        if (!parsed.success) {
          log.error("参数验证失败", parsed.error.flatten());
          set({ error: "Invalid parameters", isLoading: false });
          return;
        }

        const state = get();
        const oldValue = getSettingByPath(state.settings, path)?.value ?? null;
        set({ isLoading: true, error: null });
        log.info(`更新设置: ${path.join(".")}`, { newValue: value });
        try {
          const response = await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, value }),
          });
          if (!response.ok) {
            log.error("更新设置失败", response.statusText);
            throw new Error("Failed to update setting");
          }
          const data = await response.json();
          set({ settings: data, isLoading: false });
          log.info("设置更新成功");
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          log.error("更新设置时出错", error);
        }
        state.addHistoryEntry({
          timestamp: Date.now(),
          path,
          oldValue,
          newValue: value,
        });

        // Publish update to MessageBus
        messageBus.publish("settingUpdated", { path, newValue: value });
      },

      resetSettings: async () => {
        set({ isLoading: true, error: null });
        log.info("重置设置");
        try {
          const response = await fetch("/api/settings", { method: "PUT" });
          if (!response.ok) {
            log.error("重置设置失败", response.statusText);
            throw new Error("Failed to reset settings");
          }
          const data = await response.json();
          set({ settings: data, isLoading: false });
          log.info("设置重置成功");
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          log.error("重置设置时出错", error);
        }

        // Publish reset event to MessageBus
        messageBus.publish("settingsReset", {});
      },

      addHistoryEntry: (entry: HistoryEntry) => {
        log.info("添加历史记录条目", entry);
        const historyItem: HistoryItem = {
          ...entry,
          id: crypto.randomUUID(),
          revertible: true,
          changeType: "update",
          status: "success",
        };
        set((state) => ({
          history: [...state.history.slice(-99), historyItem],
        }));
      },

      clearHistory: () => {
        log.info("清除历史记录");
        set({ history: [] });
      },

      setSearchQuery: (query) => {
        log.info("设置搜索查询", { query });
        set({ searchQuery: query });
      },

      setActiveCategory: (category) => {
        log.info("设置活动类别", { category });
        set({ activeCategory: category });
      },

      setActiveTags: (tags) => {
        log.info("设置活动标签", { tags });
        set({ activeTags: tags });
      },

      exportSettings: async () => {
        log.info("导出设置");
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
        log.info("设置导出完成");
      },

      importSettings: async (data) => {
        const parsed = importSettingsSchema.safeParse({ data });
        if (!parsed.success) {
          log.error("导入设置参数验证失败", parsed.error.flatten());
          set({ error: "Invalid import data", isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });
        log.info("导入设置", { data });
        try {
          await fetch("/api/settings/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          await get().fetchSettings();
          log.info("设置导入成功");
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          log.error("导入设置时出错", error);
        }
      },

      batchUpdate: async (batch: SettingBatch) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/settings/batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(batch),
          });

          if (!response.ok) throw new Error("Failed to batch update settings");

          const data = await response.json();
          set({ settings: data, isLoading: false });

          // Add to history with properly typed entry
          batch.settings.forEach(({ path, value }) => {
            const oldValue =
              getSettingByPath(get().settings, path)?.value ?? null;
            get().addHistoryEntry({
              timestamp: batch.timestamp,
              path,
              oldValue,
              newValue: value,
              // Remove user property as it's not in HistoryEntry type
            });
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      validateSettings: async () => {
        const settings = get().settings;
        const validationPromises: Promise<boolean>[] = [];

        const validateSetting = async (setting: Setting): Promise<boolean> => {
          if (!setting.validation) return true;

          for (const rule of setting.validation) {
            if (rule.custom) {
              const isValid = await rule.custom(setting.value);
              if (!isValid) return false;
            }
          }
          return true;
        };

        const traverse = (items: (Setting | SettingGroup)[]): void => {
          items.forEach((item) => {
            if ("settings" in item) {
              traverse((item as SettingGroup).settings);
            } else {
              validationPromises.push(validateSetting(item as Setting));
            }
          });
        };

        traverse(settings);
        const results = await Promise.all(validationPromises);
        return results.every(Boolean);
      },

      // 优化性能的防抖更新
      debouncedUpdate: debounce(async (path: string[], value: SettingValue) => {
        const state = get();
        await state.updateSetting(path, value);
      }, 500),

      // WebSocket 相关功能增强
      subscribeToChanges: (callback) => {
        const subscription = messageBus.subscribe("settingChanged", callback);
        return () => messageBus.unsubscribe("settingChanged", subscription);
      },

      addHistoryItem: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          revertible: true,
          status: "success",
          timestamp: Date.now(),
        };

        set((state) => ({
          history: [...state.history, newItem],
        }));
      },

      revertHistoryItem: async (id) => {
        const state = get();
        const item = state.history.find((h) => h.id === id);
        if (item && item.revertible) {
          await state.updateSetting(item.path, item.oldValue as SettingValue);
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

// Setup MessageBus subscriptions
messageBus.subscribe("externalSettingChange", (message) => {
  log.info("接收到外部设置更改", message);
  const { path, newValue } = message;
  useSettingsStore.getState().updateSetting(path, newValue);
});

messageBus.subscribe("externalSettingsReset", () => {
  log.info("接收到外部设置重置");
  useSettingsStore.getState().resetSettings();
});
