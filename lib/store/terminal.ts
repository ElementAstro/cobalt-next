import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CommandStatus = "success" | "error" | "running";

export interface CommandHistory {
  command: string;
  timestamp: string;
  status: CommandStatus;
  output: string;
}

interface TerminalState {
  input: string;
  output: string[];
  commandHistory: CommandHistory[];
  isExecuting: boolean;
  selectedTheme: keyof typeof THEMES;
  isHydrated: boolean;
  setInput: (input: string) => void;
  addOutput: (text: string) => void;
  addCommandHistory: (command: CommandHistory) => void;
  setExecuting: (status: boolean) => void;
  setTheme: (theme: keyof typeof THEMES) => void;
  clearTerminal: () => void;
  downloadHistory: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const THEMES = {
  default: "bg-background text-foreground",
  dark: "bg-gray-900 text-white",
  light: "bg-white text-black",
  blue: "bg-blue-900 text-blue-100",
  red: "bg-red-900 text-red-100",
  green: "bg-green-900 text-green-100",
} as const;

const initialState = {
  input: "",
  output: ["欢迎使用增强终端。请输入命令。"],
  commandHistory: [],
  isExecuting: false,
  selectedTheme: "dark" as keyof typeof THEMES,
  isHydrated: false,
};

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setInput: (input) => set({ input }),
      addOutput: (text) =>
        set((state) => ({ output: [...state.output, text] })),
      addCommandHistory: (command) => {
        const updatedHistory = [command, ...get().commandHistory];
        set({ commandHistory: updatedHistory });
      },
      setExecuting: (status) => set({ isExecuting: status }),
      setTheme: (theme) => set({ selectedTheme: theme }),
      clearTerminal: () => {
        set({ ...initialState });
      },
      downloadHistory: () => {
        if (typeof window === "undefined") return;

        const historyText = get()
          .commandHistory.map(
            (cmd) =>
              `${cmd.timestamp} - ${cmd.command} (${cmd.status})\n${cmd.output}`
          )
          .join("\n\n");

        const blob = new Blob([historyText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "terminal_history.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "terminal-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        commandHistory: state.commandHistory,
        selectedTheme: state.selectedTheme,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// 辅助hook用于确保hydration
export function useHydratedTerminalStore<T>(
  selector: (state: TerminalState) => T,
  defaultValue: T
): T {
  const value = useTerminalStore(selector);
  const isHydrated = useTerminalStore((state) => state.isHydrated);

  return isHydrated ? value : defaultValue;
}
