import logger from "@/utils/logger";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import { z } from "zod";
import { create } from "zustand";
import getWsClient from "@/utils/ws-client";

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

interface TelescopeState {
  parkSwitch: boolean;
  homeSwitch: boolean;
  trackSwitch: boolean;
  speedNum: number;
  speedTotalNum: number[];
  isIdle: boolean;
  isConnected: boolean;
  nightMode: boolean;
  currentRA: number;
  currentDec: number;
  currentAz: number;
  currentAlt: number;
  trackingMode?: string;
  setCurrentRA: (ra: number) => void;
  setCurrentDec: (dec: number) => void;
  setCurrentAz: (az: number) => void;
  setCurrentAlt: (alt: number) => void;
  toggleParkSwitch: () => void;
  toggleHomeSwitch: () => void;
  toggleTrackSwitch: () => void;
  incrementSpeed: () => void;
  decrementSpeed: () => void;
  setSpeedNum: (num: number) => void;
  setSpeedTotalNum: (nums: number[]) => void;
  setIsIdle: (idle: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  toggleNightMode: () => void;
  setTrackingMode: (mode: string) => void;
  fetchStatus: () => Promise<void>;
}

export interface TelescopeStatus {
  status: string;
  parkSwitch: boolean;
  homeSwitch: boolean;
  trackSwitch: boolean;
  speedNum: number;
  speedTotalNum: number[];
  isIdle: boolean;
  isConnected: boolean;
  nightMode: boolean;
  currentRA: number;
  currentDec: number;
  currentAz: number;
  currentAlt: number;
  trackingMode?: string;
}

// 消息类型定义
type TelescopeMessageType =
  | "telescope/connect"
  | "telescope/disconnect"
  | "telescope/status"
  | "telescope/error"
  | "telescope/setting"
  | "telescope/move"
  | "telescope/nightMode";

interface TelescopeMessage {
  type: TelescopeMessageType;
  payload: any;
}

interface TelescopeSettingMessage {
  setting: keyof TelescopeStatus;
  value: number | boolean | number[] | string;
}

export const useTelescopeStore = create<TelescopeState>((set, get) => {
  const wsClient = getWsClient();
  if (!wsClient) {
    throw new Error("WebSocket client is not initialized");
  }

  const messageBus = new MessageBus<TelescopeMessage>(wsClient, {
    logLevel: LogLevel.INFO,
    maxRetries: 3,
    retryDelay: 1000,
  });

  // 中间件：消息验证
  messageBus.use((message, topic, next) => {
    try {
      if (topic === "telescope/status") {
        TelescopeStatusSchema.parse(message.payload);
      } else if (topic === "telescope/setting") {
        TelescopeSettingMessageSchema.parse(message.payload);
      }
      logger.info(`Message received on topic ${topic}:`, message);
      next();
    } catch (error) {
      logger.error("Message validation failed:", error);
    }
  });

  // 订阅望远镜状态更新
  messageBus.subscribe("telescope/status", (message) => {
    try {
      const status = TelescopeStatusSchema.parse(message.payload);
      logger.info("Telescope status update received:", status);
      set((state) => ({
        ...state,
        ...status,
      }));
    } catch (error) {
      logger.error("Error handling telescope status:", error);
    }
  });

  // 订阅错误消息
  messageBus.subscribe("telescope/error", (error) => {
    logger.error("Telescope error:", error);
    set({ isConnected: false });
  });

  // 清理函数
  const cleanup = () => {
    logger.info("Cleaning up WebSocket and message bus subscriptions");
    messageBus.getTopics().forEach((topic) => {
      messageBus.clearTopic(topic);
    });
    if (wsClient) {
      wsClient.close();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", cleanup);
  }

  return {
    parkSwitch: false,
    homeSwitch: false,
    trackSwitch: false,
    speedNum: 0,
    speedTotalNum: [],
    isIdle: true,
    isConnected: false,
    nightMode: false,
    currentRA: 0,
    currentDec: 0,
    currentAz: 0,
    currentAlt: 0,
    trackingMode: "default",
    setCurrentRA: (ra) => {
      try {
        z.number().parse(ra);
        logger.info(`Setting RA to ${ra}`);
        messageBus.publish("telescope/move", { ra });
        set({ currentRA: ra });
      } catch (error) {
        logger.error("Invalid RA value:", error);
      }
    },
    setCurrentDec: (dec) => {
      try {
        z.number().parse(dec);
        logger.info(`Setting Dec to ${dec}`);
        messageBus.publish("telescope/move", { dec });
        set({ currentDec: dec });
      } catch (error) {
        logger.error("Invalid Dec value:", error);
      }
    },
    setCurrentAz: (az) => {
      try {
        z.number().parse(az);
        logger.info(`Setting Azimuth to ${az}`);
        messageBus.publish("telescope/move", { az });
        set({ currentAz: az });
      } catch (error) {
        logger.error("Invalid Azimuth value:", error);
      }
    },
    setCurrentAlt: (alt) => {
      try {
        z.number().parse(alt);
        logger.info(`Setting Altitude to ${alt}`);
        messageBus.publish("telescope/move", { alt });
        set({ currentAlt: alt });
      } catch (error) {
        logger.error("Invalid Altitude value:", error);
      }
    },
    toggleParkSwitch: () => {
      try {
        const newState = !get().parkSwitch;
        messageBus.publish("telescope/setting", {
          setting: "parkSwitch",
          value: newState,
        } as TelescopeSettingMessage);
        logger.info(`Toggling park switch to ${newState}`);
        set({ parkSwitch: newState });
      } catch (error) {
        logger.error("Error toggling park switch:", error);
      }
    },
    toggleHomeSwitch: () => {
      try {
        const newState = !get().homeSwitch;
        messageBus.publish("telescope/setting", {
          setting: "homeSwitch",
          value: newState,
        } as TelescopeSettingMessage);
        logger.info(`Toggling home switch to ${newState}`);
        set({ homeSwitch: newState });
      } catch (error) {
        logger.error("Error toggling home switch:", error);
      }
    },
    toggleTrackSwitch: () => {
      try {
        const newState = !get().trackSwitch;
        messageBus.publish("telescope/setting", {
          setting: "trackSwitch",
          value: newState,
        } as TelescopeSettingMessage);
        logger.info(`Toggling track switch to ${newState}`);
        set({ trackSwitch: newState });
      } catch (error) {
        logger.error("Error toggling track switch:", error);
      }
    },
    incrementSpeed: () => {
      try {
        const newSpeed = Math.min(
          get().speedNum + 1,
          get().speedTotalNum.length - 1
        );
        messageBus.publish("telescope/setting", {
          setting: "speedNum",
          value: newSpeed,
        } as TelescopeSettingMessage);
        logger.info(`Incrementing speed to ${newSpeed}`);
        set({ speedNum: newSpeed });
      } catch (error) {
        logger.error("Error incrementing speed:", error);
      }
    },
    decrementSpeed: () => {
      try {
        const newSpeed = Math.max(get().speedNum - 1, 0);
        messageBus.publish("telescope/setting", {
          setting: "speedNum",
          value: newSpeed,
        } as TelescopeSettingMessage);
        logger.info(`Decrementing speed to ${newSpeed}`);
        set({ speedNum: newSpeed });
      } catch (error) {
        logger.error("Error decrementing speed:", error);
      }
    },
    setSpeedNum: (num) => {
      try {
        z.number().parse(num);
        TelescopeSettingMessageSchema.parse({
          setting: "speedNum",
          value: num,
        });
        messageBus.publish("telescope/setting", {
          setting: "speedNum",
          value: num,
        } as TelescopeSettingMessage);
        logger.info(`Setting speed to ${num}`);
        set({ speedNum: num });
      } catch (error) {
        logger.error("Invalid speed number value:", error);
      }
    },
    setSpeedTotalNum: (nums) => {
      try {
        z.array(z.number()).parse(nums);
        TelescopeSettingMessageSchema.parse({
          setting: "speedTotalNum",
          value: nums,
        });
        messageBus.publish("telescope/setting", {
          setting: "speedTotalNum",
          value: nums,
        } as TelescopeSettingMessage);
        logger.info(`Setting speed total numbers to ${nums}`);
        set({ speedTotalNum: nums });
      } catch (error) {
        logger.error("Invalid speed total numbers value:", error);
      }
    },
    setIsIdle: (idle) => {
      try {
        z.boolean().parse(idle);
        TelescopeSettingMessageSchema.parse({
          setting: "isIdle",
          value: idle,
        });
        messageBus.publish("telescope/setting", {
          setting: "isIdle",
          value: idle,
        } as TelescopeSettingMessage);
        logger.info(`Setting idle state to ${idle}`);
        set({ isIdle: idle });
      } catch (error) {
        logger.error("Invalid idle state value:", error);
      }
    },
    setIsConnected: (connected) => {
      try {
        z.boolean().parse(connected);
        logger.info(`Setting connection state to ${connected}`);
        messageBus.publish(
          connected ? "telescope/connect" : "telescope/disconnect",
          null
        );
        set({ isConnected: connected });
      } catch (error) {
        logger.error("Invalid connection state value:", error);
      }
    },
    toggleNightMode: () => {
      try {
        const newState = !get().nightMode;
        messageBus.publish("telescope/nightMode", { enabled: newState });
        logger.info(`Toggling night mode to ${newState}`);
        set({ nightMode: newState });
      } catch (error) {
        logger.error("Error toggling night mode:", error);
      }
    },
    setTrackingMode: (mode) => {
      try {
        z.string().parse(mode);
        TelescopeSettingMessageSchema.parse({
          setting: "trackingMode",
          value: mode,
        });
        logger.info(`Setting tracking mode to ${mode}`);
        messageBus.publish("telescope/setting", {
          setting: "trackingMode",
          value: mode,
        } as TelescopeSettingMessage);
        set({ trackingMode: mode });
      } catch (error) {
        logger.error("Invalid tracking mode value:", error);
      }
    },
    fetchStatus: async () => {
      try {
        logger.info("Fetching telescope status");
        // 发送状态查询请求
        messageBus.publish("telescope/status", { query: true });

        // 等待状态更新
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Status fetch timeout")), 5000);
        });

        const statusPromise = new Promise<void>((resolve) => {
          const handler = () => {
            messageBus.unsubscribe("telescope/status", handler);
            resolve();
          };
          messageBus.subscribe("telescope/status", handler);
        });

        await Promise.race([statusPromise, timeoutPromise]);
        logger.info("Telescope status fetched successfully");
      } catch (error) {
        logger.error("Failed to fetch telescope status:", error);
        set({
          isConnected: false,
          parkSwitch: false,
          homeSwitch: false,
          trackSwitch: false,
          speedNum: 0,
          speedTotalNum: [],
          isIdle: true,
          nightMode: false,
          currentRA: 0,
          currentDec: 0,
          currentAz: 0,
          currentAlt: 0,
          trackingMode: "default",
        });
        messageBus.publish("telescope/error", {
          error,
          message: "Failed to fetch telescope status",
        });
      }
    },
  };
});
