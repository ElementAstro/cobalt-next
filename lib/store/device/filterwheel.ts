import { create } from "zustand";

interface FilterWheelInfo {
  name: string;
  driverInfo: string;
  driverVersion: string;
  currentFilter: string;
  filters: string[];
  description: string;
  position: number; // 新增：滤镜轮位置
  maxPosition: number; // 新增：最大位置
  minPosition: number; // 新增：最小位置
  isMoving: boolean; // 新增：是否正在移动
}

interface FilterWheelState {
  filterWheelInfo: FilterWheelInfo;
  selectedFilter: string;
  isConnected: boolean;
  moveHistory: number[]; // 新增：移动历史记录
  setSelectedFilter: (filter: string) => void;
  changeFilter: (filterIndex: number) => void;
  setConnected: (connected: boolean) => void;
  addMoveHistory: (position: number) => void; // 新增：添加移动历史记录
  setPosition: (position: number) => void; // 新增：设置滤镜轮位置
  setMaxPosition: (position: number) => void; // 新增：设置最大位置
  setMinPosition: (position: number) => void; // 新增：设置最小位置
  setIsMoving: (isMoving: boolean) => void; // 新增：设置是否正在移动
}

export const useFilterWheelStore = create<FilterWheelState>((set) => ({
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
  selectedFilter: "1",
  isConnected: false,
  moveHistory: [],
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  changeFilter: (filterIndex) =>
    set((state) => ({
      filterWheelInfo: {
        ...state.filterWheelInfo,
        currentFilter: state.filterWheelInfo.filters[filterIndex - 1],
        position: filterIndex,
      },
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  addMoveHistory: (position) =>
    set((state) => ({
      moveHistory: [...state.moveHistory, position],
    })),
  setPosition: (position) =>
    set((state) => ({
      filterWheelInfo: { ...state.filterWheelInfo, position: position },
    })),
  setMaxPosition: (position) =>
    set((state) => ({
      filterWheelInfo: { ...state.filterWheelInfo, maxPosition: position },
    })),
  setMinPosition: (position) =>
    set((state) => ({
      filterWheelInfo: { ...state.filterWheelInfo, minPosition: position },
    })),
  setIsMoving: (isMoving) =>
    set((state) => ({
      filterWheelInfo: { ...state.filterWheelInfo, isMoving: isMoving },
    })),
}));
