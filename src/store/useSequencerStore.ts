import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import {
  Target,
  Task,
  TimelineData,
  AutofocusConfig,
  WeatherData,
  ExecutionStatus,
} from "@/types/sequencer";

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

interface SequencerState {
  settings: TargetSettings;
  targets: Target[];
  timeline: TimelineData[];
  activeTargetId: string | null;
  taskStatuses: Record<string, TaskStatus>;
  isRunning: boolean;
  currentProgress: number;
  errors: string[];
  notifications: Notification[];

  autofocusConfig: AutofocusConfig;
  weatherData: WeatherData | null;
  executionStatus: ExecutionStatus;

  setSetting: (field: keyof TargetSettings, value: string) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  addTarget: (target: Target) => void;
  updateTarget: (targetId: string, target: Target) => void;
  removeTarget: (targetId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  startSequence: () => Promise<void>;
  stopSequence: () => void;
  pauseSequence: () => void;
  resumeSequence: () => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  addNotification: (notification: Notification) => void;
  clearNotification: (id: string) => void;

  setAutofocusConfig: (config: Partial<AutofocusConfig>) => void;
  updateWeatherData: (data: WeatherData) => void;
  updateExecutionStatus: (status: Partial<ExecutionStatus>) => void;
  runAutofocus: () => Promise<void>;
  checkSafetyConditions: () => Promise<boolean>;
  exportData: (format: "json" | "csv") => Promise<void>;
  importData: (data: any) => Promise<void>;
}

interface TaskStatus {
  status: "pending" | "running" | "completed" | "failed" | "paused";
  startTime?: Date;
  endTime?: Date;
  error?: string;
  progress: number;
  remainingTime?: number;
}

interface Notification {
  id: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
  timestamp: Date;
  read: boolean;
}

// 定义初始状态
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

// 创建 store
export const useSequencerStore = create<SequencerState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      targets: [],
      timeline: [],
      activeTargetId: null,
      taskStatuses: {},
      isRunning: false,
      currentProgress: 0,
      errors: [],
      notifications: [],

      autofocusConfig: {
        enabled: false,
        interval: 30,
        tempDelta: 2,
        minStars: 20,
        maxRetries: 3,
        filterOffset: {},
        method: "hfd",
        autofocusOnFilterChange: true,
        autofocusOnTemperatureChange: true,
      },
      weatherData: null,
      executionStatus: {
        state: "idle",
        progress: 0,
        errors: [],
        warnings: [],
      },

      setSetting: (field, value) => {
        set((state) => ({
          settings: { ...state.settings, [field]: value },
        }));
      },

      saveSettings: async () => {
        try {
          const settings = get().settings;
          // 模拟API调用
          await fetch("/api/settings", {
            method: "POST",
            body: JSON.stringify(settings),
          });
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                id: Date.now().toString(),
                type: "success",
                message: "设置已保存",
                timestamp: new Date(),
                read: false,
              },
            ],
          }));
        } catch (error) {
          set((state) => ({
            errors: [...state.errors, "保存设置失败"],
          }));
        }
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      addTarget: (target) => {
        set((state) => ({
          targets: [...state.targets, target],
          activeTargetId: target.id,
        }));
      },

      updateTarget: (targetId, target) => {
        set((state) => ({
          targets: state.targets.map((t) => (t.id === targetId ? target : t)),
        }));
      },

      removeTarget: (targetId) => {
        set((state) => ({
          targets: state.targets.filter((t) => t.id !== targetId),
          activeTargetId:
            state.activeTargetId === targetId
              ? state.targets[0]?.id || null
              : state.activeTargetId,
        }));
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          taskStatuses: {
            ...state.taskStatuses,
            [taskId]: status,
          },
        }));
      },

      startSequence: async () => {
        try {
          set({ isRunning: true });
          // 实现序列执行逻辑
          // ...
        } catch (error) {
          set((state) => ({
            errors: [...state.errors, "序列执行失败"],
            isRunning: false,
          }));
        }
      },

      stopSequence: () => {
        set({ isRunning: false });
      },

      pauseSequence: () => {
        set((state) => ({
          taskStatuses: Object.fromEntries(
            Object.entries(state.taskStatuses).map(([id, status]) => [
              id,
              { ...status, status: "paused" as const },
            ])
          ),
        }));
      },

      resumeSequence: () => {
        set((state) => ({
          taskStatuses: Object.fromEntries(
            Object.entries(state.taskStatuses).map(([id, status]) => [
              id,
              {
                ...status,
                status: status.status === "paused" ? "running" : status.status,
              },
            ])
          ),
        }));
      },

      addError: (error) => {
        set((state) => ({
          errors: [...state.errors, error],
        }));
      },

      clearErrors: () => {
        set({ errors: [] });
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [...state.notifications, notification],
        }));
      },

      clearNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      setAutofocusConfig: (config) =>
        set(
          produce((state: SequencerState) => {
            Object.assign(state.autofocusConfig, config);
          })
        ),

      updateWeatherData: (data) =>
        set(
          produce((state: SequencerState) => {
            state.weatherData = data;
          })
        ),

      updateExecutionStatus: (status) =>
        set(
          produce((state: SequencerState) => {
            Object.assign(state.executionStatus, status);
          })
        ),

      runAutofocus: async () => {
        const state = get();
        try {
          state.updateExecutionStatus({ state: "running" });
          // TODO: 实现自动对焦逻辑
          await new Promise((resolve) => setTimeout(resolve, 1000));
          state.updateExecutionStatus({ state: "completed" });
        } catch (error) {
          state.updateExecutionStatus({
            state: "error",
            errors: [(error as Error).message],
          });
        }
      },

      checkSafetyConditions: async () => {
        const state = get();
        const weather = state.weatherData;
        if (!weather) return false;

        const isSafe =
          weather.cloudCover < 80 &&
          weather.humidity < 85 &&
          !weather.rain &&
          weather.windSpeed < 30;

        if (!isSafe) {
          state.updateExecutionStatus({
            warnings: ["Weather conditions are not safe for imaging"],
          });
        }

        return isSafe;
      },

      exportData: async (format) => {
        const state = get();
        const data = {
          targets: state.targets,
          settings: state.settings,
          autofocusConfig: state.autofocusConfig,
        };

        if (format === "json") {
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "sequencer_data.json";
          a.click();
          URL.revokeObjectURL(url);
        } else {
          // TODO: 实现 CSV 导出
        }
      },

      importData: async (data) => {
        // TODO: 验证导入的数据
        set(
          produce((state: SequencerState) => {
            state.targets = data.targets;
            state.settings = data.settings;
            if (data.autofocusConfig) {
              state.autofocusConfig = data.autofocusConfig;
            }
          })
        );
      },
    }),
    {
      name: "sequencer-storage",
      partialize: (state) => ({
        settings: state.settings,
        targets: state.targets,
        autofocusConfig: state.autofocusConfig,
      }),
    }
  )
);

// 导出常用的选择器
export const useTargets = () => useSequencerStore((state) => state.targets);
export const useActiveTarget = () => {
  const activeTargetId = useSequencerStore((state) => state.activeTargetId);
  const targets = useSequencerStore((state) => state.targets);
  return targets.find((t) => t.id === activeTargetId);
};
export const useTaskStatuses = () =>
  useSequencerStore((state) => state.taskStatuses);
export const useErrors = () => useSequencerStore((state) => state.errors);
export const useNotifications = () =>
  useSequencerStore((state) => state.notifications);
export const useAutofocusConfig = () =>
  useSequencerStore((state) => state.autofocusConfig);
export const useWeatherData = () =>
  useSequencerStore((state) => state.weatherData);
export const useExecutionStatus = () =>
  useSequencerStore((state) => state.executionStatus);
