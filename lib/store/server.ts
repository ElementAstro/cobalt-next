import { create } from "zustand";
import CryptoJS from "crypto-js";
import { useCookieStore } from "@/lib/store/storage";

interface ConnectionFormData {
  ip: string;
  port: number;
  username: string;
  password: string;
  isSSL: boolean;
  rememberLogin: boolean;
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
}

const SECRET_KEY = "cobalt";

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  formData: {
    ip: "",
    port: 5950,
    username: "",
    password: "",
    isSSL: false,
    rememberLogin: false,
  },
  isConnected: false,
  isLoading: false,
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
    const { loadCookies, decryptCookie } = useCookieStore.getState();
    const encryptedData = loadCookies("connectionForm");
    if (encryptedData) {
      const decrypted = decryptCookie(encryptedData, SECRET_KEY);
      if (decrypted) {
        set({ formData: { ...JSON.parse(decrypted), password: "" } }); // 不自动填充密码
      }
    }
  },

  saveToCookies: () => {
    const { formData } = get();
    const { encryptCookie, addCookie } = useCookieStore.getState();
    const dataToSave = { ...formData, password: "" }; // 不保存密码到 Cookie
    const encrypted = encryptCookie(JSON.stringify(dataToSave), SECRET_KEY);
    addCookie({ name: "connectionForm", value: encrypted });
  },

  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  setConnectionStrength: (strength) => set({ connectionStrength: strength }),
  addConnectionHistory: (entry) =>
    set((state) => ({
      connectionHistory: [...state.connectionHistory, entry],
    })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  removeConnectionHistory: (index) =>
    set((state) => ({
      connectionHistory: state.connectionHistory.filter((_, i) => i !== index),
    })),
  clearConnectionHistory: () => set({ connectionHistory: [] }),

  // 注册相关操作
  registerUser: (data) => {
    const { encryptCookie, addCookie } = useCookieStore.getState();
    const encrypted = encryptCookie(JSON.stringify(data), SECRET_KEY);
    addCookie({ name: "registrationData", value: encrypted });
    set({ isRegistered: true, registrationData: data });
  },

  loadRegistration: () => {
    const { loadCookies, decryptCookie } = useCookieStore.getState();
    const encryptedData = loadCookies("registrationData");
    if (encryptedData) {
      const decrypted = decryptCookie(encryptedData, SECRET_KEY);
      if (decrypted) {
        const data: RegistrationData = JSON.parse(decrypted);
        set({ isRegistered: true, registrationData: data });
      }
    }
  },

  saveRegistration: () => {
    const { registrationData } = get();
    const { encryptCookie, addCookie } = useCookieStore.getState();
    const encrypted = encryptCookie(
      JSON.stringify(registrationData),
      SECRET_KEY
    );
    addCookie({ name: "registrationData", value: encrypted });
  },
}));

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
