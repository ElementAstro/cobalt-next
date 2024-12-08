import { useEffect, useRef, useCallback, useState } from "react";
import { SystemInfo, Process } from "@/types/system";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
const RECONNECT_INTERVAL = 5000; // 5秒重连

type ConnectionStatus = "connecting" | "open" | "closed" | "error";

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setStatus("open");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "systemInfo":
          setSystemInfo(data.payload);
          break;
        case "processes":
          setProcesses(data.payload);
          break;
        default:
          console.warn("未知消息类型:", data.type);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("error");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
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
      socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket 未连接，无法发送消息");
    }
  }, []);

  return { systemInfo, processes, status, sendMessage };
}
