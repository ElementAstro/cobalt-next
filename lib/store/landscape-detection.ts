import { create } from "zustand";

interface LandscapeStore {
  isVisible: boolean;
  showDialog: () => void;
  hideDialog: () => void;
  hasInteracted: boolean;
  setHasInteracted: (value: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const useLandscapeStore = create<LandscapeStore>((set) => ({
  isVisible: false,
  showDialog: () => set({ isVisible: true }),
  hideDialog: () => set({ isVisible: false }),
  hasInteracted: false,
  setHasInteracted: (value) => set({ hasInteracted: value }),
  isFullscreen: false,
  setIsFullscreen: (value) => set({ isFullscreen: value }),
}));

export default useLandscapeStore;