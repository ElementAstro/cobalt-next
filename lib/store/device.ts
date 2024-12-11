import { create } from "zustand";

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
  addTemperatureHistory: (value: TempDataPoint) => void;
  setConnected: (connected: boolean) => void;
  toggleRecording: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
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
  setExposure: (value) => set({ exposure: value }),
  setGain: (value) => set({ gain: value }),
  setISO: (value) => set({ iso: value }),
  setOffset: (value) => set({ offset: value }),
  setBinning: (value) => set({ binning: value }),
  toggleCooler: () => set((state) => ({ coolerOn: !state.coolerOn })),
  setTemperature: (value) => set({ temperature: value }),
  setCurrentCoolingPower: (value) => set({ power: value }),
  setTargetTemperature: (value) => set({ targetTemperature: value }),
  setTargetCoolingPower: (value) => set({ targetCoolingPower: value }),
  addTemperatureHistory: (value) =>
    set((state) => ({
      temperatureHistory: [...state.temperatureHistory, value],
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
}));

interface MountState {
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
  setCurrentRA: (ra: number) => void;
  setCurrentDec: (dec: number) => void;
  setCurrentAz: (az: number) => void;
  setCurrentAlt: (alt: number) => void;
  toggleParkSwitch: () => void;
  toggleHomeSwitch: () => void;
  toggleTrackSwitch: () => void;
  incrementSpeed: () => void;
  decrementSpeed: () => void;
  setSpeedTotalNum: (nums: number[]) => void;
  setIsIdle: (idle: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  toggleNightMode: () => void;
}

export const useMountStore = create<MountState>((set) => ({
  parkSwitch: false,
  homeSwitch: false,
  trackSwitch: false,
  speedNum: 0,
  speedTotalNum: [],
  isIdle: true,
  isConnected: true,
  nightMode: false,
  currentRA: 0,
  currentDec: 0,
  currentAz: 0,
  currentAlt: 0,
  setCurrentRA: (ra) => set({ currentRA: ra }),
  setCurrentDec: (dec) => set({ currentDec: dec }),
  setCurrentAz: (az) => set({ currentAz: az }),
  setCurrentAlt: (alt) => set({ currentAlt: alt }),
  toggleParkSwitch: () => set((state) => ({ parkSwitch: !state.parkSwitch })),
  toggleHomeSwitch: () => set((state) => ({ homeSwitch: !state.homeSwitch })),
  toggleTrackSwitch: () =>
    set((state) => ({ trackSwitch: !state.trackSwitch })),
  incrementSpeed: () =>
    set((state) => ({
      speedNum: Math.min(state.speedNum + 1, state.speedTotalNum.length - 1),
    })),
  decrementSpeed: () =>
    set((state) => ({ speedNum: Math.max(state.speedNum - 1, 0) })),
  setSpeedTotalNum: (nums) => set({ speedTotalNum: nums }),
  setIsIdle: (idle) => set({ isIdle: idle }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  toggleNightMode: () => set((state) => ({ nightMode: !state.nightMode })),
}));

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

interface GuiderInfo {
  pixelScale: number;
  state: string;
  showCorrections: boolean;
  phd2Profile: string;
  filters: string[];
  description: string;
  currentFilter: string; // 新增：当前滤镜
  exposureTime: number; // 新增：曝光时间
  calibrationStatus: string; // 新增：校准状态
  guidingAccuracy: number; // 新增：导星精度
}

interface GuiderSettings {
  ditherPixels: number;
  settleTimeout: number;
  phd2Profile: string;
  exposureTime: number; // 新增：曝光时间
  calibrationSteps: number; // 新增：校准步骤
}

interface GuiderState {
  guiderInfo: GuiderInfo;
  selectedFilter: string;
  isConnected: boolean;
  guidingHistory: string[];
  setSelectedFilter: (filter: string) => void;
  changeFilter: (filterIndex: number) => void;
  startGuiding: () => void;
  stopGuiding: () => void;
  dither: (pixels: number) => void;
  setGuiderSettings: (settings: Partial<GuiderSettings>) => void;
  setConnected: (connected: boolean) => void;
  addGuidingHistory: (action: string) => void;
  setExposureTime: (time: number) => void; // 新增：设置曝光时间
  setCalibrationStatus: (status: string) => void; // 新增：设置校准状态
  setGuidingAccuracy: (accuracy: number) => void; // 新增：设置导星精度
}

export const useGuiderStore = create<GuiderState>((set) => ({
  guiderInfo: {
    pixelScale: 1.23,
    state: "Idle",
    showCorrections: false,
    phd2Profile: "default",
    filters: ["Red", "Green", "Blue", "Luminance"],
    description: "高精度导星仪，支持多种导星模式。",
    currentFilter: "Red", // 默认当前滤镜
    exposureTime: 1.0, // 默认曝光时间
    calibrationStatus: "Not Calibrated", // 默认校准状态
    guidingAccuracy: 0.0, // 默认导星精度
  },
  selectedFilter: "1",
  isConnected: false,
  guidingHistory: [],
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  changeFilter: (filterIndex) =>
    set((state) => ({
      guiderInfo: {
        ...state.guiderInfo,
        currentFilter: state.guiderInfo.filters[filterIndex - 1],
      },
    })),
  startGuiding: () =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, state: "Guiding" },
    })),
  stopGuiding: () =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, state: "Idle" },
    })),
  dither: (pixels) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo },
      guidingHistory: [...state.guidingHistory, `Dithered by ${pixels} pixels`],
    })),
  setGuiderSettings: (settings) =>
    set((state) => ({
      guiderInfo: {
        ...state.guiderInfo,
        ...settings,
      },
    })),
  setConnected: (connected) => set({ isConnected: connected }),
  addGuidingHistory: (action) =>
    set((state) => ({
      guidingHistory: [...state.guidingHistory, action],
    })),
  setExposureTime: (time) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, exposureTime: time },
    })),
  setCalibrationStatus: (status) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, calibrationStatus: status },
    })),
  setGuidingAccuracy: (accuracy) =>
    set((state) => ({
      guiderInfo: { ...state.guiderInfo, guidingAccuracy: accuracy },
    })),
}));

interface DomeState {
  azimuth: number;
  shutterStatus: "open" | "closed" | "opening" | "closing";
  isConnected: boolean;
  isSynced: boolean;
  isSlewing: boolean;
  error: string | null;
  temperature: number;
  humidity: number; // 新增：湿度
  pressure: number; // 新增：气压
  windSpeed: number; // 新增：风速
  rainStatus: "none" | "drizzle" | "rain"; // 新增：降雨状态
  setAzimuth: (azimuth: number) => void;
  setShutterStatus: (status: "open" | "closed" | "opening" | "closing") => void;
  setConnected: (isConnected: boolean) => void;
  setSynced: (isSynced: boolean) => void;
  setSlewing: (isSlewing: boolean) => void;
  setError: (error: string | null) => void;
  setTemperature: (temp: number) => void;
  setHumidity: (humidity: number) => void; // 新增：设置湿度
  setPressure: (pressure: number) => void; // 新增：设置气压
  setWindSpeed: (windSpeed: number) => void; // 新增：设置风速
  setRainStatus: (status: "none" | "drizzle" | "rain") => void; // 新增：设置降雨状态
}

export const useDomeStore = create<DomeState>((set) => ({
  azimuth: 0,
  shutterStatus: "closed",
  isConnected: false,
  isSynced: false,
  isSlewing: false,
  error: null,
  temperature: 20,
  humidity: 50, // 默认湿度
  pressure: 1013, // 默认气压
  windSpeed: 0, // 默认风速
  rainStatus: "none", // 默认降雨状态
  setAzimuth: (azimuth) => set({ azimuth }),
  setShutterStatus: (status) => set({ shutterStatus: status }),
  setConnected: (isConnected) => set({ isConnected }),
  setSynced: (isSynced) => set({ isSynced }),
  setSlewing: (isSlewing) => set({ isSlewing }),
  setError: (error) => set({ error }),
  setTemperature: (temp) => set({ temperature: temp }),
  setHumidity: (humidity) => set({ humidity }),
  setPressure: (pressure) => set({ pressure }),
  setWindSpeed: (windSpeed) => set({ windSpeed }),
  setRainStatus: (status) => set({ rainStatus: status }),
}));
