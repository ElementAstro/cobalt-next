import { create } from "zustand";

interface WebSocketState {
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
  autoReconnect: false,
  setAutoReconnect: (autoReconnect) => set({ autoReconnect }),
  reconnectInterval: 5000,
  setReconnectInterval: (interval) => set({ reconnectInterval: interval }),
}));
