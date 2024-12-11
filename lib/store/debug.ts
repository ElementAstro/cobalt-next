import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EnvironmentState {
  environment: { [key: string]: string };
  addVariable: (key: string, value: string) => void;
  updateVariable: (key: string, value: string) => void;
  removeVariable: (key: string) => void;
  resetEnvironment: () => void;
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      environment: {},
      addVariable: (key, value) =>
        set((state) => ({
          environment: { ...state.environment, [key]: value },
        })),
      updateVariable: (key, value) =>
        set((state) => ({
          environment: { ...state.environment, [key]: value },
        })),
      removeVariable: (key) =>
        set((state) => {
          const newEnv = { ...state.environment };
          delete newEnv[key];
          return { environment: newEnv };
        }),
      resetEnvironment: () => set({ environment: {} }),
    }),
    {
      name: "environment-storage", // 存储名称
    }
  )
);

interface HistoryItem {
  id: string;
  config: {
    method: string;
    url: string;
    timestamp: number;
  };
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (config: { method: string; url: string }) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
  selectHistory: (id: string) => HistoryItem | undefined;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (config) => {
        const newHistory: HistoryItem = {
          id: Date.now().toString(),
          config: {
            ...config,
            timestamp: Date.now(),
          },
        };
        set({ history: [newHistory, ...get().history] });
      },
      removeHistory: (id) => {
        set({ history: get().history.filter((item) => item.id !== id) });
      },
      clearHistory: () => {
        set({ history: [] });
      },
      selectHistory: (id) => {
        return get().history.find((item) => item.id === id);
      },
    }),
    {
      name: "history-storage", // 存储名称
    }
  )
);

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

interface RequestState {
  templates: Template[];
  history: HistoryItem[];
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (name: string) => void;
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

export const useRequestStore = create<RequestState>()(
  persist(
    (set) => ({
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
      history: [],
      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),
      updateTemplate: (updatedTemplate) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.name === updatedTemplate.name ? updatedTemplate : t
          ),
        })),
      deleteTemplate: (name) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.name !== name),
        })),
      addHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "request-storage",
    }
  )
);

interface WebSocketState {
  url: string;
  setUrl: (url: string) => void;
  message: string;
  setMessage: (message: string) => void;
  logs: string[];
  addLog: (log: string) => void;
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  url: "",
  setUrl: (url) => set({ url }),
  message: "",
  setMessage: (message) => set({ message }),
  logs: [],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
}));
