import { create } from "zustand";
import { persist } from "zustand/middleware";
import { App } from "@/types/extra";
import { HostapdConfig } from "@/types/extra/hostapd";

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
    category: "development",
    isPinned: false,
    lastOpened: "2024-01-18T09:15:00",
    url: "https://code.visualstudio.com",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    icon: "/placeholder.svg?height=32&width=32",
    category: "media",
    isPinned: false,
    lastOpened: "2024-01-17T11:10:00",
    url: "https://www.adobe.com/products/photoshop.html",
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

interface XvfbConfig {
  display: string;
  resolution: string;
  colorDepth: string;
  screen: string;
  customResolution: string;
  refreshRate: number;
  memory: number;
  security: {
    xauth: boolean;
    tcp: boolean;
    localhostOnly: boolean;
  };
  logging: {
    verbose: boolean;
    logFile: string;
    maxLogSize: number;
  };
}

interface XvfbLog {
  timestamp: number;
  message: string;
  type: "info" | "error" | "warning";
}

export interface XvfbInstance {
  id: string;
  display: string;
  config: XvfbConfig;
  status: string;
}

interface XvfbStore {
  instances: XvfbInstance[];
  config: XvfbConfig;
  isRunning: boolean;
  logs: XvfbLog[];
  savedPresets: { [key: string]: XvfbConfig };
  lastError: string | null;
  status: "idle" | "starting" | "running" | "stopping" | "error";
  setConfig: (config: Partial<XvfbConfig>) => void;
  toggleRunning: () => void;
  applyConfig: () => void;
  loadConfig: (name: string) => void;
  saveConfig: (name: string) => void;
  addLog: (message: string, type: XvfbLog["type"]) => void;
  clearLogs: () => void;
  setStatus: (status: XvfbStore["status"]) => void;
  setError: (error: string | null) => void;
  deletePreset: (name: string) => void;
  validateConfig: () => boolean;
  restartServer: () => void;
}

export const useXvfbStore = create<XvfbStore>()(
  persist(
    (set, get) => ({
      instances: [],
      config: {
        display: ":99",
        resolution: "1024x768",
        colorDepth: "24",
        screen: "0",
        customResolution: "",
        refreshRate: 60,
        memory: 128,
        security: {
          xauth: true,
          tcp: false,
          localhostOnly: true,
        },
        logging: {
          verbose: false,
          logFile: "/var/log/xvfb.log",
          maxLogSize: 10,
        },
      },
      isRunning: false,
      logs: [],
      savedPresets: {},
      lastError: null,
      status: "idle",
      setConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
      applyConfig: () => {
        const store = get();
        if (store.validateConfig()) {
          store.setStatus("starting");
          store.addLog("Applying new configuration...", "info");
          store.restartServer();
        }
      },
      loadConfig: (name) => {
        const preset = get().savedPresets[name];
        if (preset) {
          set({ config: preset });
          get().addLog(`Loaded configuration "${name}"`, "info");
        } else {
          get().setError(`Preset "${name}" not found`);
        }
      },
      saveConfig: (name) => {
        if (!name.trim()) {
          get().setError("Preset name cannot be empty");
          return;
        }
        set((state) => ({
          savedPresets: {
            ...state.savedPresets,
            [name]: state.config,
          },
        }));
        get().addLog(`Configuration saved as "${name}"`, "info");
      },
      addLog: (message, type) =>
        set((state) => ({
          logs: [...state.logs, { timestamp: Date.now(), message, type }].slice(
            -100
          ),
        })),
      clearLogs: () => set({ logs: [] }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ lastError: error }),
      deletePreset: (name) =>
        set((state) => ({
          savedPresets: Object.fromEntries(
            Object.entries(state.savedPresets).filter(([key]) => key !== name)
          ),
        })),
      validateConfig: () => {
        const { config } = get();
        const errors: string[] = [];

        // Display validation
        if (!/^:\d+$/.test(config.display)) {
          errors.push('Display must be in format :99');
        }

        // Resolution validation
        if (config.resolution === "custom") {
          if (!/^\d+x\d+$/.test(config.customResolution || "")) {
            errors.push("Custom resolution must be in WIDTHxHEIGHT format");
          }
        } else if (!["1024x768", "1280x1024", "1920x1080"].includes(config.resolution)) {
          errors.push("Invalid resolution selection");
        }

        // Color depth validation
        if (!["8", "16", "24", "32"].includes(config.colorDepth)) {
          errors.push("Invalid color depth");
        }

        // Screen validation
        if (!/^\d+$/.test(config.screen)) {
          errors.push("Screen must be a number");
        }

        // Refresh rate validation
        if (config.refreshRate < 30 || config.refreshRate > 240) {
          errors.push("Refresh rate must be between 30 and 240 Hz");
        }

        // Memory validation
        if (config.memory && (config.memory < 64 || config.memory > 1024)) {
          errors.push("Memory must be between 64 and 1024 MB");
        }

        // Logging validation
        if (config.logging) {
          if (config.logging.maxLogSize && (config.logging.maxLogSize < 1 || config.logging.maxLogSize > 1000)) {
            errors.push("Max log size must be between 1 and 1000 MB");
          }
        }

        if (errors.length > 0) {
          get().setError(errors.join("\n"));
          return false;
        }

        get().setError(null);
        return true;
      },
      restartServer: () => {
        const store = get();
        if (store.validateConfig()) {
          store.setStatus("stopping");
          store.addLog("Stopping Xvfb server...", "info");

          setTimeout(() => {
            store.setStatus("starting");
            store.addLog(
              "Starting Xvfb server with new configuration...",
              "info"
            );

            setTimeout(() => {
              store.setStatus("running");
              store.addLog("Xvfb server started successfully", "info");
            }, 1000);
          }, 1000);
        }
      },
    }),
    {
      name: "xvfb-config",
    }
  )
);

export interface DnsmasqConfig {
  listenAddress: string;
  port: string;
  domainNeeded: boolean;
  bogusPriv: boolean;
  expandHosts: boolean;
  noCacheNegative: boolean;
  strictOrder: boolean;
  noHosts: boolean;
  dnsServers: string;
  cacheSize: string;
}

interface DnsmasqStore {
  config: DnsmasqConfig;
  isAdvancedOpen: boolean;
  updateConfig: (newConfig: Partial<DnsmasqConfig>) => void;
  toggleAdvanced: () => void;
  saveConfig: () => Promise<void>;
}

export const useDnsmasqStore = create<DnsmasqStore>()(
  persist(
    (set, get) => ({
      config: {
        listenAddress: "127.0.0.1",
        port: "53",
        domainNeeded: true,
        bogusPriv: true,
        expandHosts: true,
        noCacheNegative: false,
        strictOrder: false,
        noHosts: false,
        dnsServers: "8.8.8.8,8.8.4.4",
        cacheSize: "150",
      },
      isAdvancedOpen: false,
      updateConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
      toggleAdvanced: () =>
        set((state) => ({ isAdvancedOpen: !state.isAdvancedOpen })),
      saveConfig: async () => {
        const { config } = get();
        console.log("Saving config:", config);
        // Here you would typically make an API call to save the config
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      },
    }),
    {
      name: "dnsmasq-storage",
    }
  )
);

interface HostapdState {
  config: HostapdConfig | null;
  setConfig: (config: HostapdConfig) => void;
  updateConfig: (config: Partial<HostapdConfig>) => void;
}

export const useHostapdStore = create<HostapdState>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
  updateConfig: (config) =>
    set((state) => ({
      config: state.config ? { ...state.config, ...config } : null,
    })),
}));

interface X11VNCState {
  display: string;
  port: string;
  viewonly: boolean;
  shared: boolean;
  forever: boolean;
  ssl: boolean;
  httpPort: string;
  passwd: string;
  allowedHosts: string;
  logFile: string;
  clipboard: boolean;
  noxdamage: boolean;
  scale: string;
  repeat: boolean;
  bg: boolean;
  rfbauth: string;
  command: string;
  setConfig: (key: string, value: string | boolean) => void;
  generateCommand: () => void;
}

export const useX11VNCStore = create<X11VNCState>((set, get) => ({
  display: "",
  port: "5900",
  viewonly: false,
  shared: false,
  forever: false,
  ssl: false,
  httpPort: "",
  passwd: "",
  allowedHosts: "",
  logFile: "",
  clipboard: true,
  noxdamage: false,
  scale: "1",
  repeat: false,
  bg: false,
  rfbauth: "",
  command: "",
  setConfig: (key, value) => set({ [key]: value }),
  generateCommand: () => {
    const state = get();
    let cmd = "x11vnc";
    if (state.display) cmd += ` -display ${state.display}`;
    if (state.port !== "5900") cmd += ` -rfbport ${state.port}`;
    if (state.viewonly) cmd += " -viewonly";
    if (state.shared) cmd += " -shared";
    if (state.forever) cmd += " -forever";
    if (state.ssl) cmd += " -ssl";
    if (state.httpPort) cmd += ` -http ${state.httpPort}`;
    if (state.passwd) cmd += ` -passwd ${state.passwd}`;
    if (state.allowedHosts) cmd += ` -allow ${state.allowedHosts}`;
    if (state.logFile) cmd += ` -o ${state.logFile}`;
    if (!state.clipboard) cmd += " -noclipboard";
    if (state.noxdamage) cmd += " -noxdamage";
    if (state.scale !== "1") cmd += ` -scale ${state.scale}`;
    if (state.repeat) cmd += " -repeat";
    if (state.bg) cmd += " -bg";
    if (state.rfbauth) cmd += ` -rfbauth ${state.rfbauth}`;
    set({ command: cmd });
  },
}));
