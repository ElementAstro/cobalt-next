import { create } from "zustand";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { z } from "zod";
import WebSocketClient from "@/utils/websocket-client";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import logger from "@/utils/logger";

const ConnectionFormDataSchema = z.object({
  ip: z.string().ip(),
  port: z.number().int().min(1).max(65535),
  username: z.string().min(1),
  password: z.string().min(1),
  isSSL: z.boolean(),
  rememberLogin: z.boolean(),
  connectionType: z.enum(["direct", "proxy"]),
  proxySettings: z.object({
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535),
    auth: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }).optional(),
  }).optional(),
});

const RegistrationDataSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

interface ConnectionFormData {
  ip: string;
  port: number;
  username: string;
  password: string;
  isSSL: boolean;
  rememberLogin: boolean;
  connectionType: "direct" | "proxy"; // 新增连接类型
  proxySettings?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
  }; // 可选代理设置
}

interface RegistrationData {
  username: string;
  password: string;
}

interface ConnectionState {
  formData: ConnectionFormData;
  isConnected: boolean;
  isLoading: boolean;
  connectionStrength: number;
  connectionHistory: string[];
  isDarkMode: boolean;

  // 注册相关状态
  isRegistered: boolean;
  registrationData: RegistrationData;

  loadFromCookies: () => void;
  saveToCookies: () => void;
  updateFormData: (data: Partial<ConnectionFormData>) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setConnectionStrength: (strength: number) => void;
  addConnectionHistory: (entry: string) => void;
  toggleDarkMode: () => void;
  removeConnectionHistory: (index: number) => void;
  clearConnectionHistory: () => void;

  // 注册相关操作
  registerUser: (data: RegistrationData) => void;
  loadRegistration: () => void;
  saveRegistration: () => void;

  // Message Bus Actions
  connect: () => void;
  disconnect: () => void;
}

const SECRET_KEY = "cobalt";

const initialState = {
  formData: {
    ip: "",
    port: 5950,
    username: "",
    password: "",
    isSSL: false,
    rememberLogin: false,
    connectionType: "direct" as const,
    proxySettings: undefined,
  },
  isConnected: false,
  isLoading: false,
};

export const useConnectionStore = create<ConnectionState>((set, get) => {
  // Initialize WebSocket and MessageBus
  const wsClient = new WebSocketClient({
    url: "ws://localhost:8080",
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    debug: true,
    proxy: get().formData.connectionType === 'proxy' ? {
      host: get().formData.proxySettings?.host || '',
      port: get().formData.proxySettings?.port || 8080,
      auth: get().formData.proxySettings?.auth
    } : undefined
  });

  const messageBus = new MessageBus(wsClient, {
    logLevel: LogLevel.INFO,
    maxRetries: 3,
    retryDelay: 1000,
  });

  // Middleware for logging
  messageBus.use((message, topic, next) => {
    logger.info(`Message received on topic ${topic}:`, message);
    next();
  });

  // Subscribe to connection status
  messageBus.subscribe("connection/status", (message) => {
    try {
      const validatedData = ConnectionFormDataSchema.parse({
        ...message,
        connectionType: message.connectionType || "direct",
        proxySettings: message.proxySettings || undefined
      });
      logger.info("Connection status update received:", validatedData);
      set({ isConnected: true, formData: validatedData });
    } catch (error) {
      logger.error("Error validating connection status:", error);
      set({ isConnected: false });
    }
  });

  // Subscribe to connection errors
  messageBus.subscribe("connection/error", (error) => {
    logger.error("Connection error:", error);
    set({ isConnected: false });
  });

  // Cleanup on unload
  const cleanup = () => {
    logger.info("Cleaning up WebSocket and MessageBus subscriptions");
    messageBus.getTopics().forEach((topic) => {
      messageBus.clearTopic(topic);
    });
    wsClient.close();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", cleanup);
  }

  return {
    ...initialState,
    connectionStrength: 0,
    connectionHistory: [],
    isDarkMode: false,

    // 初始化注册相关状态
    isRegistered: false,
    registrationData: {
      username: "",
      password: "",
    },

    loadFromCookies: () => {
      const cookieData = Cookies.get("connection_data");
      if (cookieData) {
        try {
          const parsedData = JSON.parse(cookieData);
          const validatedData = ConnectionFormDataSchema.parse(parsedData);
          set((state) => ({
            formData: { ...state.formData, ...validatedData },
          }));
          logger.info("Loaded connection data from cookies:", validatedData);
        } catch (error) {
          logger.error("Failed to parse or validate cookie data:", error);
        }
      }
    },

    saveToCookies: () => {
      const { formData } = get();
      try {
        ConnectionFormDataSchema.parse(formData);
        if (formData.rememberLogin) {
          Cookies.set("connection_data", JSON.stringify(formData), {
            expires: 30, // 30 days
            secure: true,
            sameSite: "strict",
          });
          logger.info("Saved connection data to cookies.");
        } else {
          Cookies.remove("connection_data");
          logger.info("Removed connection data from cookies.");
        }
      } catch (error) {
        logger.error("Invalid connection form data:", error);
      }
    },

    updateFormData: (data) => {
      try {
        const newData = { ...get().formData, ...data };
        ConnectionFormDataSchema.parse(newData);
        set(() => ({ formData: newData }));
        logger.info("Updated form data:", newData);
      } catch (error) {
        logger.error("Invalid form data update:", error);
      }
    },

    setConnected: (connected) => {
      set({ isConnected: connected });
      logger.info(`Connection status set to: ${connected}`);
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
      logger.info(`Loading state set to: ${loading}`);
    },

    setConnectionStrength: (strength) => {
      set({ connectionStrength: strength });
      logger.info(`Connection strength set to: ${strength}`);
    },

    addConnectionHistory: (entry) => {
      set((state) => ({
        connectionHistory: [...state.connectionHistory, entry],
      }));
      logger.info(`Added connection history entry: ${entry}`);
    },

    toggleDarkMode: () => {
      set((state) => ({ isDarkMode: !state.isDarkMode }));
      logger.info("Toggled dark mode.");
    },

    removeConnectionHistory: (index) => {
      set((state) => ({
        connectionHistory: state.connectionHistory.filter(
          (_, i) => i !== index
        ),
      }));
      logger.info(`Removed connection history entry at index: ${index}`);
    },

    clearConnectionHistory: () => {
      set({ connectionHistory: [] });
      logger.info("Cleared all connection history.");
    },

    // 注册相关操作
    registerUser: (data) => {
      try {
        RegistrationDataSchema.parse(data);
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          SECRET_KEY
        ).toString();

        Cookies.set("registrationData", encrypted, {
          secure: true,
          sameSite: "strict",
        });
        set({ isRegistered: true, registrationData: data });
        logger.info("User registered successfully:", data);
      } catch (error) {
        logger.error("Invalid registration data:", error);
      }
    },

    loadRegistration: () => {
      const registrationData = Cookies.get("registrationData");
      if (registrationData) {
        try {
          const decrypted = CryptoJS.AES.decrypt(
            registrationData,
            SECRET_KEY
          ).toString(CryptoJS.enc.Utf8);

          if (decrypted) {
            const data: RegistrationData = RegistrationDataSchema.parse(
              JSON.parse(decrypted)
            );
            set({ isRegistered: true, registrationData: data });
            logger.info("Loaded registration data from cookies:", data);
          }
        } catch (error) {
          logger.error(
            "Failed to decrypt or validate registration data:",
            error
          );
        }
      }
    },

    saveRegistration: () => {
      const { registrationData } = get();
      try {
        RegistrationDataSchema.parse(registrationData);
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(registrationData),
          SECRET_KEY
        ).toString();

        Cookies.set("registrationData", encrypted, {
          secure: true,
          sameSite: "strict",
        });
        logger.info("Saved registration data to cookies.");
      } catch (error) {
        logger.error("Invalid registration data during save:", error);
      }
    },

    // Message Bus Actions
    connect: () => {
      try {
        const { formData } = get();
        const validatedData = ConnectionFormDataSchema.parse(formData);
        
        const connectionConfig = {
          ...validatedData,
          wsConfig: {
            url: `ws${validatedData.isSSL ? 's' : ''}://${validatedData.ip}:${validatedData.port}`,
            reconnectInterval: 3000,
            maxReconnectAttempts: 5,
            debug: true,
            proxy: validatedData.connectionType === 'proxy' ? {
              host: validatedData.proxySettings?.host || '',
              port: validatedData.proxySettings?.port || 8080,
              auth: validatedData.proxySettings?.auth
            } : undefined
          }
        };

        messageBus.publish("connection/connect", connectionConfig);
        set({ isLoading: true });
        logger.info("Published connection/connect message:", connectionConfig);
      } catch (error) {
        logger.error("Invalid connection data on connect:", error);
        set({ isLoading: false, isConnected: false });
      }
    },

    disconnect: () => {
      try {
        messageBus.publish("connection/disconnect", {});
        set({ isConnected: false });
        logger.info("Published connection/disconnect message.");
      } catch (error) {
        logger.error("Error during disconnect:", error);
      }
    },
  };
});

interface AdvancedSettingsState {
  connectionTimeout: number;
  maxRetries: number;
  debugMode: boolean;
  updateSettings: (settings: Partial<AdvancedSettingsState>) => void;
  saveSettings: () => void;
  loadSettings: () => void;
}

export const useAdvancedSettingsStore = create<AdvancedSettingsState>(
  (set, get) => ({
    connectionTimeout: 30,
    maxRetries: 3,
    debugMode: false,

    updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

    saveSettings: () => {
      const { connectionTimeout, maxRetries, debugMode } = get();
      localStorage.setItem(
        "advancedSettings",
        JSON.stringify({ connectionTimeout, maxRetries, debugMode })
      );
    },

    loadSettings: () => {
      const settings = localStorage.getItem("advancedSettings");
      if (settings) {
        set(JSON.parse(settings));
      }
    },
  })
);

export interface ScanResult {
  port: number;
  status: "open" | "closed";
  service?: string;
}

export interface ScanHistory {
  id: string;
  date: string;
  ipAddress: string;
  openPorts: number;
}

interface PortScanState {
  progress: number;
  status: string;
  isScanning: boolean;
  scanResults: ScanResult[];
  ipAddress: string;
  portRange: string;
  customPortRange: string;
  scanSpeed: "fast" | "normal" | "thorough";
  timeout: number;
  concurrentScans: number;
  showClosedPorts: boolean;
  scanHistory: ScanHistory[];
  selectedInterface: string;
  networkInterfaces: string[];
  resetScan: () => void;
  setIpAddress: (ip: string) => void;
  setPortRange: (range: string) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: string) => void;
  setIsScanning: (scanning: boolean) => void;
  setScanResults: (results: ScanResult[]) => void;
  setCustomPortRange: (range: string) => void;
  setScanSpeed: (speed: "fast" | "normal" | "thorough") => void;
  setTimeoutValue: (timeout: number) => void;
  setConcurrentScans: (count: number) => void;
  setShowClosedPorts: (show: boolean) => void;
  setScanHistory: (history: ScanHistory[]) => void;
  setSelectedInterface: (iface: string) => void;
  setNetworkInterfaces: (ifaces: string[]) => void;
}

export const usePortScanStore = create<PortScanState>((set) => ({
  progress: 0,
  status: "准备扫描...",
  isScanning: false,
  scanResults: [],
  ipAddress: "",
  portRange: "common",
  customPortRange: "1-100",
  scanSpeed: "normal",
  timeout: 2000,
  concurrentScans: 10,
  showClosedPorts: false,
  scanHistory: [],
  selectedInterface: "",
  networkInterfaces: [],
  resetScan: () =>
    set({
      progress: 0,
      status: "准备扫描...",
      scanResults: [],
    }),
  setIpAddress: (ip) => set({ ipAddress: ip }),
  setPortRange: (range) => set({ portRange: range }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  setScanResults: (results) => set({ scanResults: results }),
  setCustomPortRange: (range) => set({ customPortRange: range }),
  setScanSpeed: (speed) => set({ scanSpeed: speed }),
  setTimeoutValue: (timeout) => set({ timeout }),
  setConcurrentScans: (count) => set({ concurrentScans: count }),
  setShowClosedPorts: (show) => set({ showClosedPorts: show }),
  setScanHistory: (history) => set({ scanHistory: history }),
  setSelectedInterface: (iface) => set({ selectedInterface: iface }),
  setNetworkInterfaces: (ifaces) => set({ networkInterfaces: ifaces }),
}));
