import { create } from "zustand";

interface TagManagerState {
  tags: string[];
  theme: "light" | "dark";
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useTagManagerStore = create<TagManagerState>((set) => ({
  tags: ["Important", "Work", "Personal"],
  theme: "dark",
  addTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
    })),
  removeTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),
  setTheme: (theme) => set({ theme }),
}));