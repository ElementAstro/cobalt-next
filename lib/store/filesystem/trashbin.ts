import { create } from "zustand";

interface File {
  id: number;
  name: string;
  deletedAt: string;
}

interface TrashBinState {
  deletedFiles: File[];
  theme: "light" | "dark";
  restoreFile: (id: number) => void;
  emptyTrash: () => void;
  toggleTheme: () => void;
}

export const useTrashBinStore = create<TrashBinState>((set) => ({
  deletedFiles: [
    {
      id: 1,
      name: "document1.pdf",
      deletedAt: new Date(Date.now() - 86400000).toLocaleString(),
    },
    {
      id: 2,
      name: "image.jpg",
      deletedAt: new Date(Date.now() - 172800000).toLocaleString(),
    },
    {
      id: 3,
      name: "spreadsheet.xlsx",
      deletedAt: new Date(Date.now() - 259200000).toLocaleString(),
    },
  ],
  theme: "dark",
  restoreFile: (id) =>
    set((state) => ({
      deletedFiles: state.deletedFiles.filter((file) => file.id !== id),
    })),
  emptyTrash: () =>
    set(() => ({
      deletedFiles: [],
    })),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
}));
