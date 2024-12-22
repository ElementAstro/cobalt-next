import { create } from "zustand";

interface FileUploadState {
  files: File[];
  theme: "light" | "dark";
  setFiles: (files: File[]) => void;
  toggleTheme: () => void;
}

export const useFileUploadStore = create<FileUploadState>((set) => ({
  files: [],
  theme: "light",
  setFiles: (files) => set({ files }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
