import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WebSocketConfig, WebSocketStatus } from '@/types/websocket';

interface WebSocketState {
  config: WebSocketConfig;
  status: WebSocketStatus;
  setConfig: (config: Partial<WebSocketConfig>) => void;
  updateStatus: (status: Partial<WebSocketStatus>) => void;
}

const defaultConfig: WebSocketConfig = {
  url: 'ws://localhost:8080/config',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  debug: false,
  binaryType: 'blob',
  queueSize: 100,
  timeout: 5000,
  compression: false,
  autoReconnect: true,
  messageFormat: 'json',
};

const defaultStatus: WebSocketStatus = {
  connected: false,
  latency: 0,
  lastMessage: null,
  messageCount: 0,
  errors: 0,
  connectionAttempts: 0,
};

export const useWebSocketStore = create<WebSocketState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      status: defaultStatus,
      setConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      updateStatus: (newStatus) =>
        set((state) => ({
          status: { ...state.status, ...newStatus },
        })),
    }),
    {
      name: 'websocket-storage',
      partialize: (state) => ({ config: state.config }),
    }
  )
);
