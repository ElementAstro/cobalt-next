import { create } from "zustand";
import WebSocketClient from "@/utils/websocket-client";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import { z } from "zod";
import wsClient from "@/utils/ws-client";

// Zod schemas for FilterWheel
const FilterWheelStatusSchema = z.object({
  name: z.string(),
  driverInfo: z.string(),
  driverVersion: z.string(),
  currentFilter: z.string(),
  filters: z.array(z.string()),
  description: z.string(),
  position: z.number(),
  maxPosition: z.number(),
  minPosition: z.number(),
  isMoving: z.boolean(),
});

const FilterWheelSettingMessageSchema = z.object({
  setting: z.enum([
    "currentFilter",
    "position",
    "maxPosition",
    "minPosition",
    "isMoving",
  ]),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

interface FilterWheelInfo {
  name: string;
  driverInfo: string;
  driverVersion: string;
  currentFilter: string;
  filters: string[];
  description: string;
  position: number; // 滤镜轮位置
  maxPosition: number; // 最大位置
  minPosition: number; // 最小位置
  isMoving: boolean; // 是否正在移动
}

interface FilterWheelState {
  filterWheelInfo: FilterWheelInfo;
  selectedFilter: string;
  isConnected: boolean;
  moveHistory: number[]; // 移动历史记录
  setSelectedFilter: (filter: string) => void;
  changeFilter: (filterIndex: number) => void;
  setConnected: (connected: boolean) => void;
  addMoveHistory: (position: number) => void;
  setPosition: (position: number) => void;
  setMaxPosition: (position: number) => void;
  setMinPosition: (position: number) => void;
  setIsMoving: (isMoving: boolean) => void;
  fetchStatus: () => Promise<void>;
}

export const useFilterWheelStore = create<FilterWheelState>((set, get) => {
  if (!wsClient) {
    throw new Error("WebSocket client is not initialized");
  }

  const messageBus = new MessageBus(wsClient, {
    logLevel: LogLevel.INFO,
    maxRetries: 3,
    retryDelay: 1000,
  });

  // Middleware: Message Validation
  messageBus.use((message, topic, next) => {
    try {
      if (topic === "filterwheel/status") {
        FilterWheelStatusSchema.parse(message.payload);
      } else if (topic === "filterwheel/setting") {
        FilterWheelSettingMessageSchema.parse(message.payload);
      }
      next();
    } catch (error) {
      console.error("Message validation failed:", error);
    }
  });

  // Subscribe to FilterWheel status updates
  messageBus.subscribe("filterwheel/status", (message) => {
    try {
      const status = FilterWheelStatusSchema.parse(message.payload);
      set((state) => ({
        filterWheelInfo: { ...state.filterWheelInfo, ...status },
        isConnected: true,
      }));
    } catch (error) {
      console.error("Error handling filterwheel status:", error);
    }
  });

  // Subscribe to error messages
  messageBus.subscribe("filterwheel/error", (error) => {
    console.error("FilterWheel error:", error);
    set({ isConnected: false });
  });

  // Cleanup function
  const cleanup = () => {
    console.info("Cleaning up WebSocket and message bus subscriptions");
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
    filterWheelInfo: {
      name: "ZWO EFW",
      driverInfo: "v1.2.3",
      driverVersion: "1.2.3",
      currentFilter: "Red",
      filters: ["Red", "Green", "Blue", "Luminance"],
      description: "高精度滤镜轮，支持多种滤镜切换。",
      position: 1, // 默认位置
      maxPosition: 5, // 默认最大位置
      minPosition: 1, // 默认最小位置
      isMoving: false, // 默认不在移动
    },
    selectedFilter: "Red",
    isConnected: false,
    moveHistory: [],
    setSelectedFilter: (filter) => {
      try {
        z.string().parse(filter);
        messageBus.publish("filterwheel/setting", {
          setting: "currentFilter",
          value: filter,
        });
        set({ selectedFilter: filter });
      } catch (error) {
        console.error("Invalid selected filter:", error);
      }
    },
    changeFilter: (filterIndex) => {
      try {
        z.number().min(1).parse(filterIndex);
        const filter = get().filterWheelInfo.filters[filterIndex - 1];
        if (!filter) throw new Error("Filter index out of range");
        messageBus.publish("filterwheel/setting", {
          setting: "position",
          value: filterIndex,
        });
        set((state) => ({
          filterWheelInfo: {
            ...state.filterWheelInfo,
            currentFilter: filter,
            position: filterIndex,
            isMoving: true,
          },
        }));
        get().addMoveHistory(filterIndex);
      } catch (error) {
        console.error("Error changing filter:", error);
      }
    },
    setConnected: (connected) => {
      try {
        z.boolean().parse(connected);
        set({ isConnected: connected });
      } catch (error) {
        console.error("Invalid connected value:", error);
      }
    },
    addMoveHistory: (position) => {
      try {
        z.number().parse(position);
        set((state) => ({
          moveHistory: [...state.moveHistory, position],
        }));
      } catch (error) {
        console.error("Invalid move history position:", error);
      }
    },
    setPosition: (position) => {
      try {
        z.number()
          .min(get().filterWheelInfo.minPosition)
          .max(get().filterWheelInfo.maxPosition)
          .parse(position);
        messageBus.publish("filterwheel/setting", {
          setting: "position",
          value: position,
        });
        set((state) => ({
          filterWheelInfo: { ...state.filterWheelInfo, position },
        }));
      } catch (error) {
        console.error("Invalid position value:", error);
      }
    },
    setMaxPosition: (position) => {
      try {
        z.number().min(get().filterWheelInfo.minPosition).parse(position);
        messageBus.publish("filterwheel/setting", {
          setting: "maxPosition",
          value: position,
        });
        set((state) => ({
          filterWheelInfo: { ...state.filterWheelInfo, maxPosition: position },
        }));
      } catch (error) {
        console.error("Invalid max position value:", error);
      }
    },
    setMinPosition: (position) => {
      try {
        z.number().max(get().filterWheelInfo.maxPosition).parse(position);
        messageBus.publish("filterwheel/setting", {
          setting: "minPosition",
          value: position,
        });
        set((state) => ({
          filterWheelInfo: { ...state.filterWheelInfo, minPosition: position },
        }));
      } catch (error) {
        console.error("Invalid min position value:", error);
      }
    },
    setIsMoving: (isMoving) => {
      try {
        z.boolean().parse(isMoving);
        messageBus.publish("filterwheel/setting", {
          setting: "isMoving",
          value: isMoving,
        });
        set((state) => ({
          filterWheelInfo: { ...state.filterWheelInfo, isMoving },
        }));
      } catch (error) {
        console.error("Invalid isMoving value:", error);
      }
    },
    fetchStatus: async () => {
      try {
        messageBus.publish("filterwheel/status/request", {});
      } catch (error) {
        console.error("Error fetching filterwheel status:", error);
      }
    },
  };
});
