export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  debug: boolean;
  binaryType: 'blob' | 'arraybuffer';
  queueSize: number;
  timeout: number;
  compression: boolean;
  autoReconnect: boolean;
  messageFormat: 'json' | 'text' | 'binary';
}

export interface WebSocketStatus {
  connected: boolean;
  latency: number;
  lastMessage: Date | null;
  messageCount: number;
  errors: number;
  connectionAttempts: number;
  lastError?: string;
}

export interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp?: number;
  id?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  latency?: number;
  error?: string;
}

export type MessageHandler = (message: WebSocketMessage) => void;
export type ConnectionHandler = () => void;
export type ErrorHandler = (error: Error) => void;
