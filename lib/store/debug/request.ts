import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface HistoryItem {
  id: string;
  config: {
    method: string;
    url: string;
    timestamp: number;
  };
}

interface RequestState {
  templates: Template[];
  history: HistoryItem[];
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (name: string) => void;
  addHistory: (item: HistoryItem) => void;
  removeHistory: (id: string) => void;
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
      removeHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "request-storage",
    }
  )
);
