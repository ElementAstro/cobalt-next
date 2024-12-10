import { create } from "zustand";

export interface CookieOption {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

export interface CookieConsentProps {
  privacyPolicyUrl?: string;
  cookieOptions?: CookieOption[];
  onAccept?: (acceptedOptions: string[]) => void;
  onDecline?: () => void;
  position?: "bottom" | "top";
}

export const defaultCookieOptions: CookieOption[] = [
  {
    id: "necessary",
    name: "必要",
    description: "网站功能所必需的Cookie",
    isRequired: true,
  },
  {
    id: "analytics",
    name: "分析",
    description: "帮助我们理解如何改善网站",
    isRequired: false,
  },
  {
    id: "marketing",
    name: "营销",
    description: "用于向您展示相关广告",
    isRequired: false,
  },
];

// Zustand store
export const useCookieStore = create<{
  isVisible: boolean;
  acceptedOptions: string[];
  showDetails: boolean;
  setIsVisible: (visible: boolean) => void;
  setAcceptedOptions: (
    options: string[] | ((prev: string[]) => string[])
  ) => void;
  toggleOption: (optionId: string) => void;
  setShowDetails: (show: boolean) => void;
}>((set) => ({
  isVisible: false,
  acceptedOptions: [],
  showDetails: false,
  setIsVisible: (visible) => set({ isVisible: visible }),
  setAcceptedOptions: (options) =>
    set((state) => ({
      acceptedOptions:
        typeof options === "function"
          ? options(state.acceptedOptions)
          : options,
    })),
  toggleOption: (optionId) =>
    set((state) => ({
      acceptedOptions: state.acceptedOptions.includes(optionId)
        ? state.acceptedOptions.filter((id) => id !== optionId)
        : [...state.acceptedOptions, optionId],
    })),
  setShowDetails: (show) => set({ showDetails: show }),
}));
