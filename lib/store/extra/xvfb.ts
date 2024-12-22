import { create } from "zustand";
import { persist } from "zustand/middleware";

interface XvfbConfig {
  display: string;
  resolution: string;
  colorDepth: string;
  screen: string;
  customResolution: string;
  refreshRate: number;
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

const useXvfbStore = create<XvfbStore>()(
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
        let isValid = true;
        let error = null;

        if (!config.display.startsWith(":")) {
          error = 'Display must start with ":"';
          isValid = false;
        }

        if (config.resolution === "custom") {
          const resolution = config.customResolution.match(/^\d+x\d+$/);
          if (!resolution) {
            error = "Invalid custom resolution format";
            isValid = false;
          }
        }

        get().setError(error);
        return isValid;
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

export default useXvfbStore;
