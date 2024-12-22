import { create } from "zustand";

interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  operations: string[];
  theme: "light" | "dark";
  setContextMenu: (data: {
    isVisible: boolean;
    x: number;
    y: number;
    operations: string[];
    theme: "light" | "dark";
  }) => void;
  closeContextMenu: () => void;
  handleOperation: (operation: string) => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isVisible: false,
  x: 0,
  y: 0,
  operations: [],
  theme: "light",
  setContextMenu: ({ isVisible, x, y, operations, theme }) =>
    set({ isVisible, x, y, operations, theme }),
  closeContextMenu: () => set({ isVisible: false, operations: [] }),
  handleOperation: (operation: string) => {
    console.log(`Operation selected: ${operation}`);
    set({ isVisible: false, operations: [] });
  },
}));