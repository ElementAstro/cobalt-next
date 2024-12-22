import { create } from "zustand";

interface FileItemState {
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
}

export const useFileItemStore = create<FileItemState>((set) => ({
  selectedFileId: null,
  setSelectedFileId: (id) => set({ selectedFileId: id }),
}));