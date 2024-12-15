import { create } from "zustand";

interface DarkFieldState {
  minExposure: string;
  maxExposure: string;
  framesPerExposure: number;
  libraryType: "modify" | "create";
  isoValue: number;
  binningMode: string;
  coolingEnabled: boolean;
  targetTemperature: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
  progress: number;
  isMockMode: boolean;
  darkFrameCount: number;
  gainValue: number;
  offsetValue: number;
  setMinExposure: (value: string) => void;
  setMaxExposure: (value: string) => void;
  setFramesPerExposure: (value: number) => void;
  setLibraryType: (value: "modify" | "create") => void;
  setIsoValue: (value: number) => void;
  setBinningMode: (value: string) => void;
  setCoolingEnabled: (value: boolean) => void;
  setTargetTemperature: (value: number) => void;
  setIsMockMode: (value: boolean) => void;
  setDarkFrameCount: (value: number) => void;
  setGainValue: (value: number) => void;
  setOffsetValue: (value: number) => void;
  resetSettings: () => void;
  startCreation: () => Promise<void>;
  cancelCreation: () => void;
}

export const useDarkFieldStore = create<DarkFieldState>((set) => ({
  minExposure: "1.0",
  maxExposure: "6.0",
  framesPerExposure: 5,
  libraryType: "modify",
  isoValue: 100,
  binningMode: "1x1",
  coolingEnabled: false,
  targetTemperature: -10,
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  progress: 0,
  isMockMode: false,
  darkFrameCount: 50,
  gainValue: 0,
  offsetValue: 10,
  setMinExposure: (value) => set({ minExposure: value }),
  setMaxExposure: (value) => set({ maxExposure: value }),
  setFramesPerExposure: (value) => set({ framesPerExposure: value }),
  setLibraryType: (value) => set({ libraryType: value }),
  setIsoValue: (value) => set({ isoValue: value }),
  setBinningMode: (value) => set({ binningMode: value }),
  setCoolingEnabled: (value) => set({ coolingEnabled: value }),
  setTargetTemperature: (value) => set({ targetTemperature: value }),
  setIsMockMode: (value) => set({ isMockMode: value }),
  setDarkFrameCount: (value) => set({ darkFrameCount: value }),
  setGainValue: (value) => set({ gainValue: value }),
  setOffsetValue: (value) => set({ offsetValue: value }),
  resetSettings: () =>
    set({
      minExposure: "1.0",
      maxExposure: "6.0",
      framesPerExposure: 5,
      libraryType: "modify",
      isoValue: 100,
      binningMode: "1x1",
      coolingEnabled: false,
      targetTemperature: -10,
      isSuccess: false,
      isError: false,
      errorMessage: "",
      progress: 0,
      isMockMode: false,
      darkFrameCount: 50,
      gainValue: 0,
      offsetValue: 10,
    }),
  startCreation: async () => {
    set({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: "",
      progress: 0,
    });
    try {
      const state = useDarkFieldStore.getState();
      const totalFrames = state.darkFrameCount;
      const mockDuration = state.isMockMode ? 100 : 3000; // Faster in mock mode

      for (let i = 1; i <= totalFrames; i++) {
        await new Promise((resolve) =>
          setTimeout(resolve, mockDuration / totalFrames)
        );
        set({ progress: (i / totalFrames) * 100 });
      }

      set({ isLoading: false, isSuccess: true, progress: 100 });
    } catch (error) {
      set({
        isLoading: false,
        isError: true,
        errorMessage: "创建暗场库失败，请重试。",
        progress: 0,
      });
    }
  },
  cancelCreation: () =>
    set({
      isLoading: false,
      isSuccess: false,
      isError: false,
      errorMessage: "",
      progress: 0,
    }),
}));
