import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Profile {
  id: string;
  name: string;
  autoConnect: boolean;
  mode: "local" | "remote";
  host: string;
  port: string;
  guiding: "internal" | "external";
  indiWebManager: boolean;
  theme: "light" | "dark" | "system";
  isConnected: boolean;
  lastConnected?: Date;
  // 额外字段
  useGPS?: boolean;
  locationNote?: string;
}

interface ProfileState {
  profiles: Profile[];
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile | null) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfile: null,

      setActiveProfile: (profile) => set({ activeProfile: profile }),
      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, data) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
          activeProfile:
            get().activeProfile?.id === id
              ? { ...get().activeProfile!, ...data }
              : get().activeProfile,
        })),
      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          activeProfile:
            get().activeProfile?.id === id ? null : get().activeProfile,
        })),
    }),
    { name: "profile-data-storage" }
  )
);
