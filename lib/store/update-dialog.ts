import { create } from "zustand";

interface UpdateStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  theme: string;
  toggleTheme: () => void;
  autoUpdate: boolean;
  setAutoUpdate: (auto: boolean) => void;
  updateFrequency: "always" | "daily" | "weekly" | "monthly";
  setUpdateFrequency: (freq: UpdateStore["updateFrequency"]) => void;
}

const useUpdateStore = create<UpdateStore>((set) => ({
  isOpen: true,
  setIsOpen: (open) => set({ isOpen: open }),
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  autoUpdate: false,
  setAutoUpdate: (auto) => set({ autoUpdate: auto }),
  updateFrequency: "weekly",
  setUpdateFrequency: (freq) => set({ updateFrequency: freq }),
}));

export default useUpdateStore;
