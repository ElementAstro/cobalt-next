import { useEffect, useState } from "react";
import { SystemInfo, Process } from "@/types/system";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "systemInfo") {
        setSystemInfo(data.payload);
      } else if (data.type === "processes") {
        setProcesses(data.payload);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return { systemInfo, processes, socket };
}
