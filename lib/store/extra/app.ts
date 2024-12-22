import { create } from "zustand";
import { persist } from "zustand/middleware";
import { App } from "@/types/extra/app";
import { apps as initialApps } from "@/data/app";

interface AppState {
  apps: App[];
  searchQuery: string;
  selectedCategory: string | null;
  view: "grid" | "list";
  launchedApp: App | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setView: (view: "grid" | "list") => void;
  setLaunchedApp: (app: App | null) => void;
  togglePin: (appId: string) => void;
  launchApp: (appId: string) => void;
  deleteApp: (appId: string) => void;
  updateAppOrder: (startIndex: number, endIndex: number) => void;
  editAppName: (appId: string, newName: string) => void;
  addNewApp: (newApp: App) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      apps: initialApps.map((app) => ({
        ...app,
        url: app.url || `https://example.com/${app.id}`,
      })),
      searchQuery: "",
      selectedCategory: null,
      view: "grid", 
      launchedApp: null,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setView: (view) => set({ view }),
      setLaunchedApp: (app) => set({ launchedApp: app }),
      togglePin: (appId) =>
        set((state) => ({
          apps: state.apps.map((app) =>
            app.id === appId ? { ...app, isPinned: !app.isPinned } : app
          ),
        })),
      launchApp: (appId) =>
        set((state) => ({
          apps: state.apps.map((app) =>
            app.id === appId
              ? { ...app, lastOpened: new Date().toISOString() }
              : app
          ),
          launchedApp: state.apps.find((app) => app.id === appId) || null,
        })),
      deleteApp: (appId) =>
        set((state) => ({
          apps: state.apps.filter((app) => app.id !== appId),
        })),
      updateAppOrder: (startIndex, endIndex) =>
        set((state) => {
          const newApps = Array.from(state.apps);
          const [removed] = newApps.splice(startIndex, 1);
          newApps.splice(endIndex, 0, removed);
          return { apps: newApps };
        }),
      editAppName: (appId, newName) =>
        set((state) => ({
          apps: state.apps.map((app) =>
            app.id === appId ? { ...app, name: newName } : app
          ),
        })),
      addNewApp: (newApp) =>
        set((state) => ({
          apps: [
            ...state.apps,
            { ...newApp, url: `https://example.com/${newApp.id}` },
          ],
        })),
    }),
    {
      name: "app-storage",
    }
  )
);
