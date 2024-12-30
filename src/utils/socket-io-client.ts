import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
type Socket = ReturnType<typeof io>;

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

interface SocketIOClientProps {
  serverUrl: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (event: string, data: unknown) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  retryAttempts?: number;
  retryInterval?: number;
  connectionTimeout?: number;
}

const SocketIOClient: React.FC<SocketIOClientProps> = ({
  serverUrl,
  onConnect,
  onDisconnect,
  onError,
  onMessage,
  onStatusChange,
  retryAttempts = 3,
  retryInterval = 5000,
  connectionTimeout = 10000,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [retryCount, setRetryCount] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);

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
      setLatency(Date.now() - start);
    });
  }, [socket]);

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
        throw new Error("Socket is not connected");
      }
      socket.emit(event, data);
    },
    [socket]
  );

  const addEventListener = useCallback(
    (event: string, handler: (data: unknown) => void) => {
      socket?.on(event, handler);
      return () => {
        socket?.off(event, handler);
      };
    },
    [socket]
  );

  return null;
};

export default SocketIOClient;
