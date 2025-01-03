import { create } from "zustand";
import WebSocketClient from "@/utils/websocket-client";
import MessageBus, { LogLevel } from "@/utils/message-bus";
import { z } from "zod";
import wsClient from "@/utils/ws-client";

// Zod schemas for Focuser
const FocuserStatusSchema = z.object({
  position: z.number(),
  temperature: z.number(),
  backflash: z.number(),
  temperatureCompensation: z.boolean(),
  stepSize: z.number(),
  maxPosition: z.number(),
  minPosition: z.number(),
  isMoving: z.boolean(),
});

const FocuserSettingMessageSchema = z.object({
  setting: z.enum([
    "targetPosition",
    "temperatureCompensation",
    "backflashCompensation",
    "stepSize",
    "maxPosition",
    "minPosition",
    "isMoving",
  ]),
  value: z.union([z.number(), z.boolean()]),
});

interface FocuserState {
  targetPosition: number;
  temperatureCompensation: boolean;
  backflashCompensation: boolean;
  focuserInfo: {
    position: number;
    temperature: number;
    backflash: number;
    temperatureCompensation: boolean;
    stepSize: number;
    maxPosition: number;
    minPosition: number;
    isMoving: boolean;
  };
  isConnected: boolean;
  moveHistory: number[];
  setTargetPosition: (position: number) => void;
  setTemperature: (temperature: number) => void;
  setTemperatureCompensation: (enabled: boolean) => void;
  setBackflash: (backflash: number) => void;
  setBackflashCompensation: (enabled: boolean) => void;
  moveFocuser: (steps: number) => void;
  setConnected: (connected: boolean) => void;
  addMoveHistory: (step: number) => void;
  setStepSize: (size: number) => void;
  setMaxPosition: (position: number) => void;
  setMinPosition: (position: number) => void;
  setIsMoving: (isMoving: boolean) => void;
  fetchStatus: () => Promise<void>;
}

export const useFocuserStore = create<FocuserState>((set, get) => {
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
      if (topic === "focuser/status") {
        FocuserStatusSchema.parse(message.payload);
      } else if (topic === "focuser/setting") {
        FocuserSettingMessageSchema.parse(message.payload);
      }
      next();
    } catch (error) {
      console.error("Message validation failed:", error);
    }
  });

  // Subscribe to Focuser status updates
  messageBus.subscribe("focuser/status", (message) => {
    try {
      const status = FocuserStatusSchema.parse(message.payload);
      set((state) => ({
        focuserInfo: { ...state.focuserInfo, ...status },
        isConnected: true,
      }));
    } catch (error) {
      console.error("Error handling focuser status:", error);
    }
  });

  // Subscribe to error messages
  messageBus.subscribe("focuser/error", (error) => {
    console.error("Focuser error:", error);
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
    targetPosition: 12500,
    temperatureCompensation: false,
    backflashCompensation: false,
    focuserInfo: {
      position: 12500,
      temperature: 25,
      backflash: 0,
      temperatureCompensation: false,
      stepSize: 1,
      maxPosition: 25000,
      minPosition: 0,
      isMoving: false,
    },
    isConnected: false,
    moveHistory: [],
    setTargetPosition: (position) => {
      try {
        z.number().parse(position);
        messageBus.publish("focuser/setting", {
          setting: "targetPosition",
          value: position,
        });
        set({ targetPosition: position });
      } catch (error) {
        console.error("Invalid target position:", error);
      }
    },
    setTemperature: (temperature) => {
      try {
        z.number().parse(temperature);
        messageBus.publish("focuser/setting", {
          setting: "temperature",
          value: temperature,
        });
        set((state) => ({
          focuserInfo: { ...state.focuserInfo, temperature },
        }));
      } catch (error) {
        console.error("Invalid temperature value:", error);
      }
    },
    setTemperatureCompensation: (enabled) => {
      try {
        z.boolean().parse(enabled);
        messageBus.publish("focuser/setting", {
          setting: "temperatureCompensation",
          value: enabled,
        });
        set({
          temperatureCompensation: enabled,
          focuserInfo: {
            ...get().focuserInfo,
            temperatureCompensation: enabled,
          },
        });
      } catch (error) {
        console.error("Invalid temperature compensation value:", error);
      }
    },
    setBackflash: (backflash) => {
      try {
        z.number().parse(backflash);
        messageBus.publish("focuser/setting", {
          setting: "backflash",
          value: backflash,
        });
        set((state) => ({
          focuserInfo: { ...state.focuserInfo, backflash },
        }));
      } catch (error) {
        console.error("Invalid backflash value:", error);
      }
    },
    setBackflashCompensation: (enabled) => {
      try {
        z.boolean().parse(enabled);
        messageBus.publish("focuser/setting", {
          setting: "backflashCompensation",
          value: enabled,
        });
        set({
          backflashCompensation: enabled,
          focuserInfo: { ...get().focuserInfo },
        });
      } catch (error) {
        console.error("Invalid backflash compensation value:", error);
      }
    },
    moveFocuser: (steps) => {
      try {
        z.number().parse(steps);
        messageBus.publish("focuser/move", { steps });
        set((state) => ({
          focuserInfo: {
            ...state.focuserInfo,
            position: state.focuserInfo.position + steps,
            isMoving: steps !== 0,
          },
        }));
        get().addMoveHistory(steps);
      } catch (error) {
        console.error("Invalid move steps:", error);
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
    addMoveHistory: (step) => {
      try {
        z.number().parse(step);
        set((state) => ({
          moveHistory: [...state.moveHistory, step],
        }));
      } catch (error) {
        console.error("Invalid move history step:", error);
      }
    },
    setStepSize: (size) => {
      try {
        z.number().parse(size);
        messageBus.publish("focuser/setting", {
          setting: "stepSize",
          value: size,
        });
        set((state) => ({
          focuserInfo: { ...state.focuserInfo, stepSize: size },
        }));
      } catch (error) {
        console.error("Invalid step size:", error);
      }
    },
    setMaxPosition: (position) => {
      try {
        z.number().parse(position);
        messageBus.publish("focuser/setting", {
          setting: "maxPosition",
          value: position,
        });
        set((state) => ({
          focuserInfo: { ...state.focuserInfo, maxPosition: position },
        }));
      } catch (error) {
        console.error("Invalid max position:", error);
      }
    },
    setMinPosition: (position) => {
      try {
        z.number().parse(position);
        messageBus.publish("focuser/setting", {
          setting: "minPosition",
          value: position,
        });
        set((state) => ({
          focuserInfo: { ...state.focuserInfo, minPosition: position },
        }));
      } catch (error) {
        console.error("Invalid min position:", error);
      }
    },
    setIsMoving: (isMoving) => {
      try {
        z.boolean().parse(isMoving);
        messageBus.publish("focuser/setting", {
          setting: "isMoving",
          value: isMoving,
        });
        set((state) => ({
          focuserInfo: { ...state.focuserInfo, isMoving },
        }));
      } catch (error) {
        console.error("Invalid isMoving value:", error);
      }
    },
    fetchStatus: async () => {
      try {
        messageBus.publish("focuser/status/request", {});
      } catch (error) {
        console.error("Error fetching focuser status:", error);
      }
    },
  };
});
