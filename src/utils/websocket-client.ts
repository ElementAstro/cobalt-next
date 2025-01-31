import { debounce, throttle, isEqual, merge, cloneDeep } from "lodash";

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
  proxy?: {
    host: string;
    port: number;
    auth?: {
      username: string;
      password: string;
    };
  };
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private heartbeatInterval: number;
  private reconnectAttempts = 0;
  private messageQueue: string[] = [];
  private eventListeners: Map<WebSocketEvent, Set<Function>> = new Map();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isExplicitClose = false;
  private messageSerializer: (data: any) => string;
  private messageDeserializer: (data: string) => any;
  private debug: boolean;
  private binaryType: "blob" | "arraybuffer";
  private stats = {
    messagesSent: 0,
    messagesReceived: 0,
    connectionAttempts: 0,
    lastConnectedAt: null as Date | null,
    lastDisconnectedAt: null as Date | null,
    lastMessageAt: null as Date | null,
  };

  private options: WebSocketClientOptions;

  // 使用debounce优化重连逻辑
  private debouncedReconnect = debounce(
    () => {
      this.handleReconnect();
    },
    1000,
    { leading: true, trailing: false }
  );

  // 使用throttle优化心跳发送
  private throttledHeartbeat = throttle(() => {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "ping" }));
    }
  }, 1000);

  constructor(options: WebSocketClientOptions) {
    this.options = cloneDeep(options); // 深拷贝配置
    this.url = options.url;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.messageSerializer = options.messageSerializer || JSON.stringify;
    this.messageDeserializer = options.messageDeserializer || JSON.parse;
    this.debug = options.debug || false;
    this.binaryType = options.binaryType || "blob";
    this.connect();
  }

  private connect() {
    let url = this.url;

    if (this.options.proxy) {
      const { host, port, auth } = this.options.proxy;
      const authString = auth ? `${auth.username}:${auth.password}@` : "";
      url = `ws://${authString}${host}:${port}/proxy?target=${encodeURIComponent(
        this.url
      )}`;
    }

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.stats.connectionAttempts++;
      this.stats.lastConnectedAt = new Date();
      this.emit("open");
      this.emit("statechange", "open");
      this.startHeartbeat();
      this.flushMessageQueue();
    };

    this.ws.binaryType = this.binaryType;

    // 使用throttle优化消息处理
    const throttledMessageHandler = throttle((event: MessageEvent) => {
      const message =
        typeof event.data === "string"
          ? this.handleMessage(event.data)
          : event.data;

      if (message !== null) {
        this.stats.lastMessageAt = new Date();
        this.emit("message", message);
        this.resetHeartbeat();
      }
    }, 50);

    this.ws.onmessage = throttledMessageHandler;

    this.ws.onerror = (error) => {
      this.emit("error", error);
      this.debouncedReconnect();
    };

    this.ws.onclose = () => {
      this.stats.lastDisconnectedAt = new Date();
      this.emit("close");
      this.emit("statechange", "closed");
      this.stopHeartbeat();
      if (!this.isExplicitClose) {
        this.debouncedReconnect();
      }
    };
  }

  public initiateConnection() {
    if (this.ws?.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
        this.emit("reconnect", this.reconnectAttempts);
      }, this.reconnectInterval);
    }
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.throttledHeartbeat();
    }, this.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private resetHeartbeat() {
    this.stopHeartbeat();
    this.startHeartbeat();
  }

  private flushMessageQueue() {
    while (
      this.messageQueue.length > 0 &&
      this.ws?.readyState === WebSocket.OPEN
    ) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws.send(message);
      }
    }
  }

  // 使用debounce优化消息发送
  public send = debounce((message: any) => {
    const serialized = this.messageSerializer(message);

    if (this.debug) {
      console.debug("[WebSocket] Sending message:", serialized);
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(serialized);
      this.stats.messagesSent++;
      this.stats.lastMessageAt = new Date();
    } else {
      this.messageQueue.push(serialized);
    }
  }, 50);

  private handleMessage(data: string) {
    try {
      const deserialized = this.messageDeserializer(data);
      this.stats.messagesReceived++;

      if (this.debug) {
        console.debug("[WebSocket] Received message:", deserialized);
      }

      return deserialized;
    } catch (error) {
      console.error("[WebSocket] Message deserialization error:", error);
      return null;
    }
  }

  // 使用merge合并配置
  public updateConfig(newConfig: Partial<WebSocketClientOptions>) {
    this.options = merge({}, this.options, newConfig);
    // 如果需要重新连接则重连
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.close();
      this.connect();
    }
  }

  // 比较消息是否相同
  private isMessageEqual(msg1: any, msg2: any): boolean {
    return isEqual(msg1, msg2);
  }

  public getStats() {
    return { ...this.stats };
  }

  public close() {
    this.isExplicitClose = true;
    this.ws?.close();
  }

  public on(event: WebSocketEvent, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  public off(event: WebSocketEvent, callback: Function) {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: WebSocketEvent, ...args: any[]) {
    this.eventListeners.get(event)?.forEach((callback) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} event handler:`, error);
      }
    });
  }

  public getState(): "connecting" | "open" | "closing" | "closed" {
    if (!this.ws) return "closed";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "open";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "closed";
    }
  }

  public async testConnection(config: WebSocketClientOptions): Promise<{
    success: boolean;
    latency?: number;
    packetLoss?: number;
    error?: string;
  }> {
    return new Promise((resolve) => {
      if (!this.ws) {
        return resolve({
          success: false,
          error: "WebSocket 未初始化",
        });
      }

      const testWs = new WebSocket(config.url);
      const startTime = Date.now();
      let receivedPong = false;
      let packetLoss = 0;
      let latency = 0;

      const timeout = setTimeout(() => {
        testWs.close();
        resolve({
          success: false,
          error: "连接测试超时",
        });
      }, 5000);

      testWs.onopen = () => {
        // 发送测试消息
        testWs.send(JSON.stringify({ type: "ping" }));
      };

      testWs.onmessage = (event) => {
        if (event.data === JSON.stringify({ type: "pong" })) {
          receivedPong = true;
          latency = Date.now() - startTime;
          packetLoss = 0;
          clearTimeout(timeout);
          testWs.close();
          resolve({
            success: true,
            latency,
            packetLoss,
          });
        }
      };

      testWs.onerror = (event: Event) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: "连接测试失败",
        });
      };

      testWs.onclose = () => {
        if (!receivedPong) {
          clearTimeout(timeout);
          resolve({
            success: false,
            error: "连接意外关闭",
          });
        }
      };
    });
  }
}

export default WebSocketClient;
