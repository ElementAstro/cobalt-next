export interface CaptchaProps {
  isDarkMode: boolean;
  isHighContrast: boolean;
  onError: () => void;
  onSuccess: () => void;
  isDisabled: boolean;
  setIsDisabled: (value: boolean) => void;
}

export type CaptchaType = "math" | "image" | "slider";
export type CaptchaTheme = "light" | "dark" | "system";
