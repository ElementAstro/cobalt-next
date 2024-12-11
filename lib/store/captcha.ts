import { create } from "zustand";

interface CaptchaState {
  isDarkMode: boolean;
  isHighContrast: boolean;
  errorCount: number;
  isDisabled: boolean;
  timeLeft: number;
  setDarkMode: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  incrementError: () => void;
  resetError: () => void;
  disableCaptcha: (duration: number) => void;
  decrementTime: () => void;
  onError: () => void;
  onSuccess: () => void;
  setIsDisabled: (value: boolean) => void; // 添加 setIsDisabled
}

export const useCaptchaStore = create<CaptchaState>((set) => ({
  isDarkMode: true,
  isHighContrast: false,
  errorCount: 0,
  isDisabled: false,
  timeLeft: 0,
  setDarkMode: (value) => set({ isDarkMode: value }),
  setHighContrast: (value) => set({ isHighContrast: value }),
  incrementError: () => set((state) => ({ errorCount: state.errorCount + 1 })),
  resetError: () => set({ errorCount: 0 }),
  disableCaptcha: (duration) => set({ isDisabled: true, timeLeft: duration }),
  decrementTime: () =>
    set((state) => ({
      timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
      isDisabled: state.timeLeft - 1 > 0,
    })),
  onError: () => {},
  onSuccess: () => {},
  setIsDisabled: (value) => set({ isDisabled: value }),
}));
