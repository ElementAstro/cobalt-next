import WebSocketClient from "@/lib/websocketClient";
import { useWebSocket } from "@/hooks/use-websocket";

const websocketUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
export const websocketClient = new WebSocketClient(websocketUrl);

export { useWebSocket };
