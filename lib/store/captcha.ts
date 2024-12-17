import { create } from "zustand";

interface CaptchaStore {
  isDarkMode: boolean;
  isHighContrast: boolean;
  errorCount: number;
  isDisabled: boolean;
  timeLeft: number;
  theme: "light" | "dark" | "system";
  animationSpeed: "slow" | "normal" | "fast";
  soundEnabled: boolean;
  autoRefresh: boolean;
  difficulty: "easy" | "normal" | "hard";
  language: "zh" | "en";

  onError: () => void;
  onSuccess: () => void;
  setDarkMode: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  incrementError: () => void;
  resetError: () => void;
  disableCaptcha: (seconds: number) => void;
  decrementTime: () => void;
  setIsDisabled: (value: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setAnimationSpeed: (speed: "slow" | "normal" | "fast") => void;
  setSoundEnabled: (value: boolean) => void;
  setAutoRefresh: (value: boolean) => void;
  setDifficulty: (value: "easy" | "normal" | "hard") => void;
  setLanguage: (value: "zh" | "en") => void;
}

export const useCaptchaStore = create<CaptchaStore>((set) => ({
  isDarkMode: false,
  isHighContrast: false,
  errorCount: 0,
  isDisabled: false,
  timeLeft: 0,
  theme: "system",
  animationSpeed: "normal",
  soundEnabled: true,
  autoRefresh: false,
  difficulty: "normal",
  language: "zh",

  onError: () => set((state) => ({ errorCount: state.errorCount + 1 })),
  onSuccess: () => {},
  setDarkMode: (value) => set({ isDarkMode: value }),
  setHighContrast: (value) => set({ isHighContrast: value }),
  incrementError: () => set((state) => ({ errorCount: state.errorCount + 1 })),
  resetError: () => set({ errorCount: 0 }),
  disableCaptcha: (seconds) => set({ isDisabled: true, timeLeft: seconds }),
  decrementTime: () =>
    set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  setIsDisabled: (value) => set({ isDisabled: value }),
  setTheme: (theme) => set({ theme }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  setAutoRefresh: (value) => set({ autoRefresh: value }),
  setDifficulty: (value) => set({ difficulty: value }),
  setLanguage: (value) => set({ language: value }),
}));
