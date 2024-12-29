import WebSocketClient from "./websocket-client";

type MessageHandler = (message: any, topic?: string) => void;

class MessageBus {
  private wsClient: WebSocketClient;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private debug: boolean;

  constructor(wsClient: WebSocketClient, debug = false) {
    this.wsClient = wsClient;
    this.debug = debug;
    this.setupMessageHandling();

    if (this.debug) {
      console.debug("[MessageBus] Initialized with WebSocket client");
    }
  }

  private setupMessageHandling() {
    this.wsClient.on("message", (message: any) => {
      if (this.debug) {
        console.debug("[MessageBus] Received raw message:", message);
      }

      try {
        const { topic, data } = this.parseMessage(message);
        if (this.debug) {
          console.debug(
            `[MessageBus] Parsed message for topic "${topic}":`,
            data
          );
        }
        this.dispatch(topic, data);
      } catch (error) {
        console.error("[MessageBus] Error handling message:", error);
      }
    });
  }

  private parseMessage(message: any): { topic: string; data: any } {
    if (typeof message === "string") {
      try {
        const parsed = JSON.parse(message);
        if (parsed.topic && parsed.data !== undefined) {
          return parsed;
        }
      } catch {
        // Not JSON, treat as raw message
      }

      try {
        const decoded = atob(message);
        const parsed = JSON.parse(decoded);
        if (parsed.topic && parsed.data !== undefined) {
          return parsed;
        }
      } catch {
        // Not base64 or JSON, treat as raw message
      }
    }
    return { topic: "default", data: message };
  }

  private dispatch(topic: string, data: any) {
    const handlers = this.handlers.get(topic) || new Set();
    if (this.debug) {
      console.debug(
        `[MessageBus] Dispatching message to ${handlers.size} handlers for topic "${topic}":`,
        data
      );
    }

    handlers.forEach((handler) => {
      try {
        handler(data, topic);
      } catch (error) {
        console.error(
          `[MessageBus] Error in handler for topic "${topic}":`,
          error
        );
      }
    });

    if (this.debug) {
      console.debug(
        `[MessageBus] Dispatched message to ${handlers.size} handlers for topic "${topic}"`
      );
    }
  }

  public subscribe(topic: string, handler: MessageHandler) {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }
    this.handlers.get(topic)?.add(handler);

    if (this.debug) {
      console.debug(`[MessageBus] Subscribed to topic "${topic}"`);
    }

    return () => this.unsubscribe(topic, handler);
  }

  public unsubscribe(topic: string, handler: MessageHandler) {
    const handlers = this.handlers.get(topic);
    if (handlers) {
      handlers.delete(handler);
      if (this.debug) {
        console.debug(`[MessageBus] Unsubscribed from topic "${topic}"`);
      }

      if (handlers.size === 0) {
        this.handlers.delete(topic);
        if (this.debug) {
          console.debug(
            `[MessageBus] No more handlers for topic "${topic}", topic removed`
          );
        }
      }
    }
  }

  public publish(topic: string, message: any) {
    const payload = JSON.stringify({ topic, data: message });
    this.wsClient.send(payload);

    if (this.debug) {
      console.debug(
        `[MessageBus] Published message to topic "${topic}":`,
        message
      );
    }
  }

  public getTopics(): string[] {
    const topics = Array.from(this.handlers.keys());
    if (this.debug) {
      console.debug("[MessageBus] Retrieved topics:", topics);
    }
    return topics;
  }

  public clearTopic(topic: string) {
    const handlers = this.handlers.get(topic);
    if (handlers) {
      this.handlers.delete(topic);
      if (this.debug) {
        console.debug(
          `[MessageBus] Cleared topic "${topic}" with ${handlers.size} handlers`
        );
      }
    }
  }
}

export default MessageBus;
