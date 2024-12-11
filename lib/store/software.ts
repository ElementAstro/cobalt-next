import { create } from "zustand";

interface Software {
  id: string;
  name: string;
  version: string;
  author: string;
  date: string;
  size: string;
  icon: string;
}

type View = "list" | "grid" | "detail";

interface ZustandState {
  view: View;
  software: Software[];
  setView: (view: View) => void;
  setSoftware: (software: Software[]) => void;
}

export const useStore = create<ZustandState>((set) => ({
  view: "list",
  software: [],
  setView: (view) => set({ view }),
  setSoftware: (software) => set({ software }),
}));
