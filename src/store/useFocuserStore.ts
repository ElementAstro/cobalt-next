import { create } from "zustand";

interface FocuserState {
  targetPosition: number;
  temperatureCompensation: boolean;
  backflashCompensation: boolean;
  focuserInfo: {
    position: number;
    temperature: number;
    backflash: number;
    temperatureCompensation: boolean;
    stepSize: number; // 新增：步进大小
    maxPosition: number; // 新增：最大位置
    minPosition: number; // 新增：最小位置
    isMoving: boolean; // 新增：是否正在移动
  };
  isConnected: boolean;
  moveHistory: number[];
  setTargetPosition: (position: number) => void;
  setTemperature(temperature: number): void;
  setTemperatureCompensation: (enabled: boolean) => void;
  setBackflash: (backflash: number) => void;
  setBackflashCompensation: (enabled: boolean) => void; // 新增：设置反冲补偿
  moveFocuser: (steps: number) => void;
  setConnected: (connected: boolean) => void;
  addMoveHistory: (step: number) => void;
  setStepSize: (size: number) => void; // 新增：设置步进大小
  setMaxPosition: (position: number) => void; // 新增：设置最大位置
  setMinPosition: (position: number) => void; // 新增：设置最小位置
  setIsMoving: (isMoving: boolean) => void; // 新增：设置是否正在移动
}

export const useFocuserStore = create<FocuserState>((set) => ({
  targetPosition: 12500,
  temperatureCompensation: false,
  backflashCompensation: false,
  focuserInfo: {
    position: 12500,
    temperature: 25,
    backflash: 0,
    temperatureCompensation: false,
    stepSize: 1, // 默认步进大小
    maxPosition: 25000, // 默认最大位置
    minPosition: 0, // 默认最小位置
    isMoving: false, // 默认不在移动
  },
  isConnected: false,
  moveHistory: [],
  setTargetPosition: (position) => set({ targetPosition: position }),
  setTemperature: (temperature) =>
    set((state) => ({
      focuserInfo: { ...state.focuserInfo, temperature: temperature },
    })),
  setTemperatureCompensation: (enabled) =>
    set((state) => ({
      temperatureCompensation: enabled,
      focuserInfo: { ...state.focuserInfo, temperatureCompensation: enabled },
    })),
  setBackflash: (backflash) =>
    set((state) => ({
      focuserInfo: { ...state.focuserInfo, backflash: backflash },
    })),
  setBackflashCompensation: (enabled) =>
    set((state) => ({
      backflashCompensation: enabled,
      focuserInfo: { ...state.focuserInfo, backflashCompensation: enabled },
    })),
  moveFocuser: (steps) =>
    set((state) => ({
      focuserInfo: {
        ...state.focuserInfo,
        position: state.focuserInfo.position + steps,
      },
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  addMoveHistory: (step) =>
    set((state) => ({
      moveHistory: [...state.moveHistory, step],
    })),
  setStepSize: (size) =>
    set((state) => ({
      focuserInfo: { ...state.focuserInfo, stepSize: size },
    })),
  setMaxPosition: (position) =>
    set((state) => ({
      focuserInfo: { ...state.focuserInfo, maxPosition: position },
    })),
  setMinPosition: (position) =>
    set((state) => ({
      focuserInfo: { ...state.focuserInfo, minPosition: position },
    })),
  setIsMoving: (isMoving) =>
    set((state) => ({
      focuserInfo: { ...state.focuserInfo, isMoving: isMoving },
    })),
}));
