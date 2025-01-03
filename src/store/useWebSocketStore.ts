import { create } from "zustand";
import WebSocketClient from "@/utils/websocket-client";
import Cookies from "js-cookie";

type WebSocketEvent =
  | "open"
  | "message"
  | "error"
  | "close"
  | "reconnect"
  | "statechange";

interface WebSocketClientOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  messageSerializer?: (data: any) => string;
  messageDeserializer?: (data: string) => any;
  debug?: boolean;
  autoReconnect?: boolean;
  binaryType?: "blob" | "arraybuffer";
}

interface WebSocketStore {
  config: WebSocketClientOptions;
  setConfig: (config: WebSocketClientOptions) => void;
  client: WebSocketClient | null;
}

const useWebSocketStore = create<WebSocketStore>((set, get) => {
  // 从 Cookies 中加载已保存的配置
  const savedConfig = Cookies.get("websocketConfig");
  const initialConfig: WebSocketClientOptions = savedConfig
    ? JSON.parse(savedConfig)
    : {
        url: "ws://localhost:8080",
        reconnectInterval: 5000,
        maxReconnectAttempts: 5,
        heartbeatInterval: 30000,
        debug: false,
        binaryType: "blob",
      };

  // 初始化 WebSocketClient 实例
  const client = new WebSocketClient(initialConfig);

  return {
    config: initialConfig,
    setConfig: (config: WebSocketClientOptions) => {
      // 保存配置到 Cookies
      Cookies.set("websocketConfig", JSON.stringify(config));
      // 更新状态
      set({ config });
      // 关闭旧的客户端
      const oldClient = get().client;
      if (oldClient) {
        oldClient.close();
      }
      // 创建新的 WebSocketClient 实例
      const newClient = new WebSocketClient(config);
      set({ client: newClient });
    },
    client,
  };
});

export default useWebSocketStore;
