// hooks/useWebSocket.ts
import { useEffect, useRef, useCallback, useState } from "react";
import logger from "@/lib/logger";
import WebSocketClient from "@/lib/websocketClient";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
const RECONNECT_INTERVAL = 5000; // 5 seconds reconnect interval

type ConnectionStatus = "connecting" | "open" | "closed" | "error";

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const connect = useCallback(() => {
    logger.info("Attempting to connect to WebSocket...");
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      logger.info("WebSocket connected successfully.");
      setStatus("open");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      logger.info("Received message from WebSocket:", data);
    };

    ws.onerror = (error) => {
      logger.error("WebSocket encountered an error:", error);
      setStatus("error");
    };

    ws.onclose = () => {
      logger.warn("WebSocket disconnected. Attempting to reconnect...");
      setStatus("closed");
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, RECONNECT_INTERVAL);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (socketRef.current) {
        logger.info("Closing WebSocket connection...");
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      logger.info("Sending message to WebSocket:", message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      logger.warn("WebSocket is not connected. Unable to send message.");
    }
  }, []);

  return { status, sendMessage };
}
