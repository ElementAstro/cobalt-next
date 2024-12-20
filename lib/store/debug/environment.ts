import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EnvironmentState {
  environment: { [key: string]: string };
  addVariable: (key: string, value: string) => void;
  updateVariable: (key: string, value: string) => void;
  removeVariable: (key: string) => void;
  resetEnvironment: () => void;
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      environment: {},
      addVariable: (key, value) =>
        set((state) => ({
          environment: { ...state.environment, [key]: value },
        })),
      updateVariable: (key, value) =>
        set((state) => ({
          environment: { ...state.environment, [key]: value },
        })),
      removeVariable: (key) =>
        set((state) => {
          const newEnv = { ...state.environment };
          delete newEnv[key];
          return { environment: newEnv };
        }),
      resetEnvironment: () => set({ environment: {} }),
    }),
    {
      name: "environment-storage", // 存储名称
    }
  )
);
