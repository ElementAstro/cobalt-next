export interface CaptchaProps {
  isDarkMode: boolean;

  isHighContrast: boolean;

  onError: () => void;

  onSuccess: () => void;

  isDisabled: boolean;

  setIsDisabled: (value: boolean) => void;
}
