import { create } from "zustand";

type PullMenuState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pinnedItems: string[];
  togglePinnedItem: (item: string) => void;
};

export const usePullMenuStore = create<PullMenuState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  pinnedItems: [],
  togglePinnedItem: (item) =>
    set((state) => ({
      pinnedItems: state.pinnedItems.includes(item)
        ? state.pinnedItems.filter((i) => i !== item)
        : [...state.pinnedItems, item],
    })),
}));
