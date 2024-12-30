import { create } from "zustand";
import logger from "@/utils/logger";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import WebSocketClient from "@/utils/websocket-client";
import { z } from "zod";

// Zod schemas for Camera
const CameraStatusSchema = z.object({
  status: z.string(),
  exposure: z.number(),
  gain: z.number(),
  iso: z.number(),
  offset: z.number(),
  binning: z.number(),
  coolerOn: z.boolean(),
  temperature: z.number(),
  power: z.number(),
  targetTemperature: z.number(),
  targetCoolingPower: z.number(),
  isConnected: z.boolean(),
  whiteBalance: z.string().optional(),
  focus: z.number().optional(),
});

const CameraSettingMessageSchema = z.object({
  setting: z.enum([
    "exposure",
    "gain",
    "iso",
    "offset",
    "binning",
    "whiteBalance",
    "focus",
  ]),
  value: z.union([z.number(), z.boolean(), z.string()]),
});

// Zod schemas for Telescope
const TelescopeStatusSchema = z.object({
  status: z.string(),
  parkSwitch: z.boolean(),
  homeSwitch: z.boolean(),
  trackSwitch: z.boolean(),
  speedNum: z.number(),
  speedTotalNum: z.array(z.number()),
  isIdle: z.boolean(),
  isConnected: z.boolean(),
  nightMode: z.boolean(),
  currentRA: z.number(),
  currentDec: z.number(),
  currentAz: z.number(),
  currentAlt: z.number(),
  trackingMode: z.string().optional(),
});

const TelescopeSettingMessageSchema = z.object({
  setting: z.enum([
    "parkSwitch",
    "homeSwitch",
    "trackSwitch",
    "speedNum",
    "speedTotalNum",
    "isIdle",
    "nightMode",
  ]),
  value: z.union([z.number(), z.boolean(), z.array(z.number())]),
});

export interface TempDataPoint {
  time: string;
  temperature: number;
}

interface CameraState {
  exposure: number;
  gain: number;
  iso: number;
  offset: number;
  binning: number;
  coolerOn: boolean;
  temperature: number;
  power: number;
  targetTemperature: number;
  targetCoolingPower: number;
  temperatureHistory: TempDataPoint[];
  isConnected: boolean;
  isRecording: boolean;
  whiteBalance?: string;
  focus?: number;
  setExposure: (value: number) => void;
  setGain: (value: number) => void;
  setISO: (value: number) => void;
  setOffset: (value: number) => void;
  setBinning: (value: number) => void;
  toggleCooler: () => void;
  setTemperature: (value: number) => void;
  setCurrentCoolingPower: (value: number) => void;
  setTargetTemperature: (value: number) => void;
  setTargetCoolingPower: (value: number) => void;
  setWhiteBalance: (value: string) => void;
  setFocus: (value: number) => void;
  addTemperatureHistory: (value: TempDataPoint) => void;
  setConnected: (connected: boolean) => void;
  toggleRecording: () => void;
  fetchStatus: () => Promise<void>;
}

export interface CameraStatus {
  status: string;
  exposure: number;
  gain: number;
  iso: number;
  offset: number;
  binning: number;
  coolerOn: boolean;
  temperature: number;
  power: number;
  targetTemperature: number;
  targetCoolingPower: number;
  isConnected: boolean;
  whiteBalance?: string;
  focus?: number;
}

// 消息类型定义
type MessageType =
  | "camera/connect"
  | "camera/disconnect"
  | "camera/status"
  | "camera/error"
  | "camera/setting"
  | "camera/temperature"
  | "camera/cooler"
  | "camera/recording";

interface CameraMessage {
  type: MessageType;
  payload: any;
}

interface CameraSettingMessage {
  setting: keyof CameraStatus;
  value: number | boolean | string;
}

export const useCameraStore = create<CameraState>((set, get) => {
  const wsClient = new WebSocketClient({
    url: "ws://localhost:8080",
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    debug: true,
  });

  const messageBus = new MessageBus<CameraMessage>(wsClient, {
    logLevel: LogLevel.INFO,
    maxRetries: 3,
    retryDelay: 1000,
  });

  messageBus.use((message, topic, next) => {
    try {
      if (topic === "camera/status") {
        CameraStatusSchema.parse(message.payload);
      } else if (topic === "camera/setting") {
        CameraSettingMessageSchema.parse(message.payload);
      }
      logger.info(`Message received on topic ${topic}:`, message);
      next();
    } catch (error) {
      logger.error("Message validation failed:", error);
    }
  });

  messageBus.subscribe("camera/status", (message) => {
    try {
      const status = CameraStatusSchema.parse(message.payload);
      logger.info("Camera status update received:", status);
      set((state) => ({
        ...state,
        ...status,
        temperatureHistory:
          status.temperature !== state.temperature
            ? [
                ...state.temperatureHistory,
                {
                  time: new Date().toISOString(),
                  temperature: status.temperature,
                },
              ].slice(-100)
            : state.temperatureHistory,
      }));
    } catch (error) {
      logger.error("Error handling camera status:", error);
    }
  });

  // 订阅错误消息
  messageBus.subscribe("camera/error", (error) => {
    logger.error("Camera error:", error);
    set({ isConnected: false });
  });

  // 清理函数
  const cleanup = () => {
    logger.info("Cleaning up WebSocket and message bus subscriptions");
    messageBus.getTopics().forEach((topic) => {
      messageBus.clearTopic(topic);
    });
    wsClient.close();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", cleanup);
  }

  return {
    exposure: 1,
    gain: 0,
    iso: 0,
    offset: 0,
    binning: 1,
    coolerOn: false,
    temperature: 20,
    power: 0,
    targetTemperature: 20,
    targetCoolingPower: 0,
    temperatureHistory: [],
    isConnected: false,
    isRecording: false,
    whiteBalance: "auto",
    focus: 0,
    setExposure: (value) => {
      try {
        CameraSettingMessageSchema.parse({
          setting: "exposure",
          value,
        });
        logger.info(`Setting exposure to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "exposure",
          value,
        } as CameraSettingMessage);
        set({ exposure: value });
      } catch (error) {
        logger.error("Invalid exposure value:", error);
      }
    },
    setGain: (value) => {
      try {
        CameraSettingMessageSchema.parse({
          setting: "gain",
          value,
        });
        logger.info(`Setting gain to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "gain",
          value,
        } as CameraSettingMessage);
        set({ gain: value });
      } catch (error) {
        logger.error("Invalid gain value:", error);
      }
    },
    setISO: (value) => {
      try {
        CameraSettingMessageSchema.parse({
          setting: "iso",
          value,
        });
        logger.info(`Setting ISO to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "iso",
          value,
        } as CameraSettingMessage);
        set({ iso: value });
      } catch (error) {
        logger.error("Invalid ISO value:", error);
      }
    },
    setOffset: (value) => {
      try {
        CameraSettingMessageSchema.parse({
          setting: "offset",
          value,
        });
        logger.info(`Setting offset to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "offset",
          value,
        } as CameraSettingMessage);
        set({ offset: value });
      } catch (error) {
        logger.error("Invalid offset value:", error);
      }
    },
    setBinning: (value) => {
      try {
        CameraSettingMessageSchema.parse({
          setting: "binning",
          value,
        });
        logger.info(`Setting binning to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "binning",
          value,
        } as CameraSettingMessage);
        set({ binning: value });
      } catch (error) {
        logger.error("Invalid binning value:", error);
      }
    },
    toggleCooler: () => {
      try {
        const newState = !get().coolerOn;
        messageBus.publish("camera/cooler", { enabled: newState });
        logger.info(`Toggling cooler to ${newState}`);
        set({ coolerOn: newState });
      } catch (error) {
        logger.error("Error toggling cooler:", error);
      }
    },
    setTemperature: (value) => {
      try {
        z.number().parse(value);
        logger.info(`Setting temperature to ${value}`);
        set({ temperature: value });
      } catch (error) {
        logger.error("Invalid temperature value:", error);
      }
    },
    setCurrentCoolingPower: (value) => {
      try {
        z.number().parse(value);
        logger.info(`Setting current cooling power to ${value}`);
        set({ power: value });
      } catch (error) {
        logger.error("Invalid cooling power value:", error);
      }
    },
    setTargetTemperature: (value) => {
      try {
        z.number().parse(value);
        CameraSettingMessageSchema.parse({
          setting: "targetTemperature",
          value,
        });
        logger.info(`Setting target temperature to ${value}`);
        messageBus.publish("camera/temperature", { target: value });
        set({ targetTemperature: value });
      } catch (error) {
        logger.error("Invalid target temperature value:", error);
      }
    },
    setTargetCoolingPower: (value) => {
      try {
        z.number().parse(value);
        CameraSettingMessageSchema.parse({
          setting: "targetCoolingPower",
          value,
        });
        logger.info(`Setting target cooling power to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "targetCoolingPower",
          value,
        } as CameraSettingMessage);
        set({ targetCoolingPower: value });
      } catch (error) {
        logger.error("Invalid target cooling power value:", error);
      }
    },
    setWhiteBalance: (value) => {
      try {
        z.string().parse(value);
        CameraSettingMessageSchema.parse({
          setting: "whiteBalance",
          value,
        });
        logger.info(`Setting white balance to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "whiteBalance",
          value,
        } as CameraSettingMessage);
        set({ whiteBalance: value });
      } catch (error) {
        logger.error("Invalid white balance value:", error);
      }
    },
    setFocus: (value) => {
      try {
        z.number().parse(value);
        CameraSettingMessageSchema.parse({
          setting: "focus",
          value,
        });
        logger.info(`Setting focus to ${value}`);
        messageBus.publish("camera/setting", {
          setting: "focus",
          value,
        } as CameraSettingMessage);
        set({ focus: value });
      } catch (error) {
        logger.error("Invalid focus value:", error);
      }
    },
    addTemperatureHistory: (value) => {
      try {
        z.object({
          time: z.string(),
          temperature: z.number(),
        }).parse(value);
        logger.info("Adding temperature history point:", value);
        set((state) => ({
          temperatureHistory: [...state.temperatureHistory, value],
        }));
      } catch (error) {
        logger.error("Invalid temperature history value:", error);
      }
    },
    setConnected: (connected) => {
      try {
        z.boolean().parse(connected);
        logger.info(`Setting connection state to ${connected}`);
        messageBus.publish(
          connected ? "camera/connect" : "camera/disconnect",
          null
        );
        set({ isConnected: connected });
      } catch (error) {
        logger.error("Invalid connection state value:", error);
      }
    },
    toggleRecording: () => {
      try {
        const newState = !get().isRecording;
        messageBus.publish("camera/recording", { recording: newState });
        logger.info(`Toggling recording to ${newState}`);
        set({ isRecording: newState });
      } catch (error) {
        logger.error("Error toggling recording:", error);
      }
    },
    fetchStatus: async () => {
      try {
        logger.info("Fetching camera status");
        // 发送状态查询请求
        messageBus.publish("camera/status", { query: true });

        // 等待状态更新
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Status fetch timeout")), 5000);
        });

        const statusPromise = new Promise<void>((resolve) => {
          const handler = () => {
            messageBus.unsubscribe("camera/status", handler);
            resolve();
          };
          messageBus.subscribe("camera/status", handler);
        });

        await Promise.race([statusPromise, timeoutPromise]);
        logger.info("Camera status fetched successfully");
      } catch (error) {
        logger.error("Failed to fetch camera status:", error);
        set({
          isConnected: false,
          exposure: 0,
          gain: 0,
          iso: 100,
          offset: 0,
          binning: 1,
          coolerOn: false,
          temperature: 20,
          power: 0,
          targetTemperature: 0,
          targetCoolingPower: 0,
        });
        messageBus.publish("camera/error", {
          error,
          message: "Failed to fetch camera status",
        });
      }
    },
  };
});
