import { create } from "zustand";

interface ShareModalState {
  permissions: "view" | "edit" | "full";
  setPermissions: (permissions: "view" | "edit" | "full") => void;
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  permissions: "view",
  setPermissions: (permissions) => set({ permissions }),
}));