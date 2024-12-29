import { create } from "zustand";
import { persist } from "zustand/middleware";
import { App } from "@/types/extra";

export type ViewMode = "grid" | "list";
export type SortMode = "name" | "date" | "category";
export type ThemeMode = "system" | "light" | "dark";

export const initialApps: App[] = [
  {
    id: "edge",
    name: "Edge",
    icon: "/placeholder.svg?height=32&width=32",
    category: "microsoft",
    isPinned: true,
    lastOpened: "2024-01-20T10:00:00",
    url: "https://www.microsoft.com",
  },
  {
    id: "chrome",
    name: "Chrome",
    icon: "/placeholder.svg?height=32&width=32",
    category: "tools",
    isPinned: true,
    lastOpened: "2024-01-19T14:30:00",
    url: "https://www.google.com/chrome",
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: "/placeholder.svg?height=32&width=32",
    category: "tools",
    isPinned: false,
    lastOpened: "2024-01-18T09:15:00",
    url: "https://code.visualstudio.com",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "/placeholder.svg?height=32&width=32",
    category: "tools",
    isPinned: false,
    lastOpened: "2024-01-20T08:45:00",
    url: "https://www.spotify.com",
  },
  {
    id: "slack",
    name: "Slack",
    icon: "/placeholder.svg?height=32&width=32",
    category: "tools",
    isPinned: true,
    lastOpened: "2024-01-19T16:20:00",
    url: "https://slack.com",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    icon: "/placeholder.svg?height=32&width=32",
    category: "tools",
    isPinned: false,
    lastOpened: "2024-01-17T11:10:00",
    url: "https://www.adobe.com/products/photoshop.html",
  },
  {
    id: "excel",
    name: "Excel",
    icon: "/placeholder.svg?height=32&width=32",
    category: "microsoft",
    isPinned: true,
    lastOpened: "2024-01-20T09:30:00",
    url: "https://www.microsoft.com/excel",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "/placeholder.svg?height=32&width=32",
    category: "tools",
    isPinned: false,
    lastOpened: "2024-01-19T10:45:00",
    url: "https://en.wikipedia.org/wiki/Terminal_emulator",
  },
];

interface ExtraState {
  apps: App[];
  searchQuery: string;
  selectedCategory: string | null;
  view: "grid" | "list";
  launchedApp: App | null;
  sortMode: SortMode;
  gridSize: number;
  isSidebarOpen: boolean;
  themeMode: ThemeMode;
  isCompactMode: boolean;
  favorites: string[];
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
  setSortMode: (mode: SortMode) => void;
  setGridSize: (size: number) => void;
  setSidebarOpen: (open: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setCompactMode: (compact: boolean) => void;
  toggleFavorite: (appId: string) => void;
}

export const useExtraStore = create<ExtraState>()(
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
      sortMode: "name",
      gridSize: 96,
      isSidebarOpen: true,
      themeMode: "system",
      isCompactMode: false,
      favorites: [],
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
      setSortMode: (mode) => set({ sortMode: mode }),
      setGridSize: (size) => set({ gridSize: size }),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setCompactMode: (compact) => set({ isCompactMode: compact }),
      toggleFavorite: (appId) =>
        set((state) => ({
          favorites: state.favorites.includes(appId)
            ? state.favorites.filter((id) => id !== appId)
            : [...state.favorites, appId],
        })),
    }),
    {
      name: "app-storage",
      version: 1,
    }
  )
);
