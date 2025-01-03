import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
type Socket = ReturnType<typeof io>;

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error"
  | "offline";

type ConnectionQuality =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "disconnected";

interface ConnectionMetrics {
  latency: number | null;
  packetLoss: number;
  jitter: number;
  quality: ConnectionQuality;
}

interface QueuedMessage {
  event: string;
  data: unknown;
  timestamp: number;
  attempts: number;
}

interface SocketIOClientProps {
  serverUrl: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (event: string, data: unknown) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onMetricsChange?: (metrics: ConnectionMetrics) => void;
  retryAttempts?: number;
  retryInterval?: number;
  connectionTimeout?: number;
  maxQueueSize?: number;
  queueRetryInterval?: number;
  enableOfflineQueue?: boolean;
}

const SocketIOClient: React.FC<SocketIOClientProps> = ({
  serverUrl,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
  onStatusChange,
  onMetricsChange,
  retryAttempts = 3,
  retryInterval = 5000,
  connectionTimeout = 10000,
  maxQueueSize = 100,
  queueRetryInterval = 5000,
  enableOfflineQueue = false,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [retryCount, setRetryCount] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);
  const [packetLoss, setPacketLoss] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [quality, setQuality] = useState<ConnectionQuality>("disconnected");
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateStatus = useCallback(
    (status: ConnectionStatus) => {
      setConnectionStatus(status);
      onStatusChange?.(status);
    },
    [onStatusChange]
  );

  const handleConnectError = useCallback(
    (error: Error) => {
      updateStatus("error");
      onError?.(error);

      if (retryCount < retryAttempts) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          socket?.connect();
        }, retryInterval);
      }
    },
    [onError, retryCount, retryAttempts, retryInterval, socket]
  );

  const handlePing = useCallback(() => {
    const start = Date.now();
    socket?.once("pong", () => {
      const newLatency = Date.now() - start;
      setLatency(newLatency);

      // Calculate jitter
      setJitter((prev) => {
        const newJitter = prev ? Math.abs(prev - newLatency) : 0;
        return Math.min(newJitter, 1000); // Cap jitter at 1000ms
      });

      // Update connection quality
      let newQuality: ConnectionQuality = "excellent";
      if (newLatency > 300) newQuality = "good";
      if (newLatency > 600) newQuality = "fair";
      if (newLatency > 1000) newQuality = "poor";
      if (newLatency === null) newQuality = "disconnected";

      setQuality(newQuality);
      onMetricsChange?.({
        latency: newLatency,
        packetLoss,
        jitter,
        quality: newQuality,
      });
    });
  }, [socket, packetLoss, jitter, onMetricsChange]);

  useEffect(() => {
    const newSocket = io(serverUrl, {
      transports: ["websocket"],
      autoConnect: true,
      reconnectionAttempts: retryAttempts,
      reconnectionDelay: retryInterval,
      timeout: connectionTimeout,
    });

    const connectTimeout = setTimeout(() => {
      if (newSocket.disconnected) {
        handleConnectError(new Error("Connection timeout"));
      }
    }, connectionTimeout);

    newSocket.on("connect", () => {
      clearTimeout(connectTimeout);
      updateStatus("connected");
      setRetryCount(0);
      onConnect?.();
    });

    newSocket.on("disconnect", () => {
      updateStatus("disconnected");
      onDisconnect?.();
    });

    newSocket.on("reconnect_attempt", () => {
      updateStatus("reconnecting");
    });

    newSocket.on("connect_error", handleConnectError);

    newSocket.on("ping", handlePing);

    // Handle custom events
    const messageHandler = (data: unknown) => {
      onMessage?.("message", data);
    };
    newSocket.on("message", messageHandler);

    setSocket(newSocket);
    updateStatus("connecting");

    return () => {
      clearTimeout(connectTimeout);
      newSocket.off("message", messageHandler);
      newSocket.off("ping", handlePing);
      newSocket.disconnect();
    };
  }, [
    serverUrl,
    onConnect,
    onDisconnect,
    handleConnectError,
    onMessage,
    updateStatus,
    retryAttempts,
    retryInterval,
    connectionTimeout,
    handlePing,
  ]);

  const emitEvent = useCallback(
    (event: string, data?: unknown) => {
      if (!socket) {
        if (enableOfflineQueue && isOnline) {
          // Add to queue if offline mode is enabled
          setMessageQueue((prev) => {
            const newQueue = [...prev];
            if (maxQueueSize && newQueue.length >= maxQueueSize) {
              newQueue.shift(); // Remove oldest message if queue is full
            }
            newQueue.push({
              event,
              data,
              timestamp: Date.now(),
              attempts: 0,
            });
            return newQueue;
          });
          return;
        }
        throw new Error("Socket is not connected");
      }
      socket.emit(event, data);
    },
    [socket, enableOfflineQueue, isOnline, maxQueueSize]
  );

  // Process message queue when connection is restored
  useEffect(() => {
    if (connectionStatus === "connected" && messageQueue.length > 0) {
      const processQueue = async () => {
        const successfulMessages: QueuedMessage[] = [];
        const failedMessages: QueuedMessage[] = [];

        for (const message of messageQueue) {
          try {
            socket?.emit(message.event, message.data);
            successfulMessages.push(message);
          } catch (error) {
            if (message.attempts < (retryAttempts || 3)) {
              failedMessages.push({
                ...message,
                attempts: message.attempts + 1,
              });
            }
          }
        }

        setMessageQueue(failedMessages);
      };

      processQueue();
    }
  }, [connectionStatus, messageQueue, socket, retryAttempts]);

  const addEventListener = useCallback(
    (event: string, handler: (data: unknown) => void) => {
      socket?.on(event, handler);
      return () => {
        socket?.off(event, handler);
      };
    },
    [socket]
  );

  // Handle network connectivity changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      updateStatus("connecting");
      socket?.connect();
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [socket, updateStatus]);

  return null;
};

export default SocketIOClient;
