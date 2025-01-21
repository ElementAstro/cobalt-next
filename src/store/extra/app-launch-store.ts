import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppLaunchState {
  retryCount: number;
  maxRetries: number;
  isLoading: boolean;
  error: string | null;
  incrementRetry: () => void;
  resetRetry: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppLaunchStore = create<AppLaunchState>()(
  persist(
    (set) => ({
      retryCount: 0,
      maxRetries: 3,
      isLoading: false,
      error: null,
      incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),
      resetRetry: () => set({ retryCount: 0 }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'app-launch-storage',
    }
  )
);