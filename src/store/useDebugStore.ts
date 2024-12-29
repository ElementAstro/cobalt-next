import { create } from "zustand";
import { persist } from "zustand/middleware";
import log from "@/utils/logger"; // Import the logger

// 接口定义
interface HistoryItem {
  id: string;
  status: "success" | "error";
  config: {
    method: string;
    url: string;
    timestamp: number;
    headers: { [key: string]: string };
    body?: any;
  };
}

interface TemplateConfig {
  method: string;
  url: string;
  headers: { [key: string]: string } | {};
  data?: { [key: string]: any };
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  rejectUnauthorized?: boolean;
}

interface Template {
  name: string;
  config: TemplateConfig;
}

interface DebugState {
  // History 相关
  history: HistoryItem[];
  addHistory: (config: {
    method: string;
    url: string;
    headers?: { [key: string]: string };
    body?: any;
    status?: "success" | "error";
  }) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  selectHistory: (id: string) => HistoryItem | undefined;

  // Environment 相关
  environment: { [key: string]: string };
  addVariable: (key: string, value: string) => void;
  updateVariable: (key: string, value: string) => void;
  removeVariable: (key: string) => void;
  resetEnvironment: () => void;

  // WebSocket 相关
  url: string;
  setUrl: (url: string) => void;
  message: string;
  setMessage: (message: string) => void;
  logs: string[];
  addLog: (log: string) => void;
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
  autoReconnect: boolean;
  setAutoReconnect: (autoReconnect: boolean) => void;
  reconnectInterval: number;
  setReconnectInterval: (interval: number) => void;

  // Request 相关
  templates: Template[];
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (name: string) => void;
}

export const useDebugStore = create<DebugState>()(
  persist(
    (set, get) => ({
      // History 相关实现
      history: [],
      addHistory: (config) => {
        const newHistory: HistoryItem = {
          id: Date.now().toString(),
          status: config.status || "success",
          config: {
            method: config.method,
            url: config.url,
            headers: config.headers || {},
            body: config.body,
            timestamp: Date.now(),
          },
        };
        log.info(`Adding history item: ${JSON.stringify(newHistory)}`);
        set({ history: [newHistory, ...get().history] });
      },
      removeHistory: (id) => {
        log.info(`Removing history item with ID: ${id}`);
        set({ history: get().history.filter((item) => item.id !== id) });
      },
      clearHistory: () => {
        log.info("Clearing all history items");
        set({ history: [] });
      },
      selectHistory: (id) => {
        log.info(`Selecting history item with ID: ${id}`);
        return get().history.find((item) => item.id === id);
      },

      // Environment 相关实现
      environment: {},
      addVariable: (key, value) => {
        log.info(`Adding environment variable: ${key}=${value}`);
        set((state) => ({
          environment: { ...state.environment, [key]: value },
        }));
      },
      updateVariable: (key, value) => {
        log.info(`Updating environment variable: ${key}=${value}`);
        set((state) => ({
          environment: { ...state.environment, [key]: value },
        }));
      },
      removeVariable: (key) => {
        log.info(`Removing environment variable: ${key}`);
        set((state) => {
          const newEnv = { ...state.environment };
          delete newEnv[key];
          return { environment: newEnv };
        });
      },
      resetEnvironment: () => {
        log.info("Resetting environment variables");
        set({ environment: {} });
      },

      // WebSocket 相关实现
      url: "",
      setUrl: (url) => {
        log.info(`Setting WebSocket URL: ${url}`);
        set({ url });
      },
      message: "",
      setMessage: (message) => {
        log.info(`Setting WebSocket message: ${message}`);
        set({ message });
      },
      logs: [],
      addLog: (logMsg) => {
        log.info(`Adding WebSocket log: ${logMsg}`);
        set((state) => ({ logs: [...state.logs, logMsg] }));
      },
      isConnected: false,
      setIsConnected: (status) => {
        log.info(`Setting WebSocket connection status: ${status}`);
        set({ isConnected: status });
      },
      autoReconnect: false,
      setAutoReconnect: (autoReconnect) => {
        log.info(`Setting WebSocket auto-reconnect: ${autoReconnect}`);
        set({ autoReconnect });
      },
      reconnectInterval: 5000,
      setReconnectInterval: (interval) => {
        log.info(`Setting WebSocket reconnect interval: ${interval}`);
        set({ reconnectInterval: interval });
      },

      // Request 相关实现
      templates: [
        {
          name: "GET Request",
          config: {
            method: "GET",
            url: "https://api.example.com/users",
            headers: {},
            data: {},
            timeout: 5000,
            retries: 3,
            retryDelay: 1000,
            rejectUnauthorized: true,
          },
        },
        {
          name: "POST JSON",
          config: {
            method: "POST",
            url: "https://api.example.com/users",
            headers: { "Content-Type": "application/json" },
            data: { name: "John Doe", email: "john@example.com" },
            timeout: 5000,
            retries: 3,
            retryDelay: 1000,
            rejectUnauthorized: true,
          },
        },
        {
          name: "PUT with Authentication",
          config: {
            method: "PUT",
            url: "https://api.example.com/users/1",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer YOUR_TOKEN_HERE",
            },
            data: { name: "Jane Doe", email: "jane@example.com" },
            timeout: 5000,
            retries: 3,
            retryDelay: 1000,
            rejectUnauthorized: true,
          },
        },
        {
          name: "DELETE Request",
          config: {
            method: "DELETE",
            url: "https://api.example.com/users/1",
            headers: { Authorization: "Bearer YOUR_TOKEN_HERE" },
            data: {},
            timeout: 5000,
            retries: 3,
            retryDelay: 1000,
            rejectUnauthorized: true,
          },
        },
      ],
      addTemplate: (template) => {
        log.info(`Adding template: ${template.name}`);
        set((state) => ({
          templates: [...state.templates, template],
        }));
      },
      updateTemplate: (updatedTemplate) => {
        log.info(`Updating template: ${updatedTemplate.name}`);
        set((state) => ({
          templates: state.templates.map((t) =>
            t.name === updatedTemplate.name ? updatedTemplate : t
          ),
        }));
      },
      deleteTemplate: (name) => {
        log.info(`Deleting template: ${name}`);
        set((state) => ({
          templates: state.templates.filter((t) => t.name !== name),
        }));
      },
    }),
    {
      name: "debug-storage",
    }
  )
);