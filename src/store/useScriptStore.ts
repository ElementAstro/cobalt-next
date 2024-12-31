import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface Script {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt: Date | null;
  executionCount: number;
  version: number;
}

interface ScriptExecution {
  id: string;
  scriptId: string;
  status: "pending" | "running" | "completed" | "failed";
  output: string[];
  startedAt: Date | null;
  completedAt: Date | null;
}

interface ScriptStore {
  scripts: Script[];
  templates: string[];
  selectedScript: Script | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  history: { content: string }[];
  historyIndex: number;

  // Execution queue
  executionQueue: ScriptExecution[];
  activeExecution: ScriptExecution | null;
  terminalOutput: string[];

  // Basic CRUD operations
  addScript: (
    script: Omit<
      Script,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "lastExecutedAt"
      | "executionCount"
      | "version"
    >
  ) => Promise<void>;
  updateScript: (
    id: string,
    script: Partial<Omit<Script, "id">>
  ) => Promise<void>;
  deleteScript: (id: string) => Promise<void>;
  selectScript: (id: string) => void;

  // Template operations
  addTemplate: (template: string) => void;
  removeTemplate: (template: string) => void;

  // Bulk operations
  bulkDeleteScripts: (ids: string[]) => Promise<void>;
  bulkUpdateScripts: (ids: string[], updates: Partial<Script>) => Promise<void>;

  // Script execution
  executeScript: (id: string) => Promise<void>;
  scheduleScript: (
    id: string,
    schedule: { cronExpression: string }
  ) => Promise<void>;

  // Queue operations
  addToQueue: (scriptId: string) => void;
  removeFromQueue: (executionId: string) => void;
  clearQueue: () => void;
  processQueue: () => Promise<void>;

  // Terminal operations
  appendTerminalOutput: (output: string) => void;
  clearTerminal: () => void;

  // Import/export
  importScripts: (scripts: Script[]) => Promise<void>;
  exportScripts: (ids: string[]) => Promise<string>;

  // Search and filtering
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  toggleTag: (tag: string) => void;

  // Statistics
  getScriptStatistics: () => {
    totalScripts: number;
    totalExecutions: number;
    mostUsedScript: Script | null;
    categories: Record<string, number>;
  };

  // Duplication
  duplicateScript: (id: string) => Promise<void>;

  // Undo/Redo
  recordHistory: (content: string) => void;
  undo: () => void;
  redo: () => void;
}

export const useScriptStore = create<ScriptStore>()(
  persist(
    (set, get) => ({
      scripts: [],
      templates: [],
      selectedScript: null,
      loading: false,
      error: null,
      searchQuery: "",
      selectedCategory: null,
      selectedTags: [],
      history: [],
      historyIndex: -1,

      // Execution queue state
      executionQueue: [],
      activeExecution: null,
      terminalOutput: [],

      addScript: async (script) => {
        try {
          set({ loading: true, error: null });
          const newScript = {
            ...script,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            lastExecutedAt: null,
            executionCount: 0,
            version: 1,
          };
          set((state) => ({ scripts: [...state.scripts, newScript] }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to add script",
          });
        } finally {
          set({ loading: false });
        }
      },

      addTemplate: (template) => {
        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      removeTemplate: (template) => {
        set((state) => ({
          templates: state.templates.filter((t) => t !== template),
        }));
      },

      updateScript: async (id, script) => {
        try {
          set({ loading: true, error: null });
          set((state) => ({
            scripts: state.scripts.map((s) =>
              s.id === id
                ? {
                    ...s,
                    ...script,
                    updatedAt: new Date(),
                    version: s.version + 1,
                  }
                : s
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update script",
          });
        } finally {
          set({ loading: false });
        }
      },

      deleteScript: async (id) => {
        try {
          set({ loading: true, error: null });
          set((state) => ({
            scripts: state.scripts.filter((s) => s.id !== id),
            selectedScript:
              state.selectedScript?.id === id ? null : state.selectedScript,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete script",
          });
        } finally {
          set({ loading: false });
        }
      },

      selectScript: (id) => {
        set((state) => ({
          selectedScript: state.scripts.find((s) => s.id === id) || null,
        }));
      },

      bulkDeleteScripts: async (ids) => {
        try {
          set({ loading: true, error: null });
          set((state) => ({
            scripts: state.scripts.filter((s) => !ids.includes(s.id)),
            selectedScript: ids.includes(state.selectedScript?.id || "")
              ? null
              : state.selectedScript,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete scripts",
          });
        } finally {
          set({ loading: false });
        }
      },

      duplicateScript: async (id) => {
        try {
          set({ loading: true, error: null });
          const script = get().scripts.find((s) => s.id === id);
          if (script) {
            const newScript = {
              ...script,
              id: uuidv4(),
              name: `${script.name} (Copy)`,
              createdAt: new Date(),
              updatedAt: new Date(),
              lastExecutedAt: null,
              executionCount: 0,
              version: 1,
            };
            set((state) => ({ scripts: [...state.scripts, newScript] }));
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to duplicate script",
          });
        } finally {
          set({ loading: false });
        }
      },

      bulkUpdateScripts: async (ids, updates) => {
        try {
          set({ loading: true, error: null });
          set((state) => ({
            scripts: state.scripts.map((s) =>
              ids.includes(s.id)
                ? { ...s, ...updates, updatedAt: new Date() }
                : s
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update scripts",
          });
        } finally {
          set({ loading: false });
        }
      },

      executeScript: async (id) => {
        try {
          set({ loading: true, error: null });
          set((state) => ({
            scripts: state.scripts.map((s) =>
              s.id === id
                ? {
                    ...s,
                    lastExecutedAt: new Date(),
                    executionCount: s.executionCount + 1,
                  }
                : s
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to execute script",
          });
        } finally {
          set({ loading: false });
        }
      },

      scheduleScript: async (id, schedule) => {
        // Implementation would depend on scheduling library
      },

      // Queue operations
      addToQueue: (scriptId) => {
        const execution: ScriptExecution = {
          id: uuidv4(),
          scriptId,
          status: "pending",
          output: [],
          startedAt: null,
          completedAt: null,
        };
        set((state) => ({
          executionQueue: [...state.executionQueue, execution],
        }));
      },

      removeFromQueue: (executionId) => {
        set((state) => ({
          executionQueue: state.executionQueue.filter(
            (e) => e.id !== executionId
          ),
        }));
      },

      clearQueue: () => {
        set({ executionQueue: [], activeExecution: null });
      },

      processQueue: async () => {
        const { executionQueue } = get();
        if (executionQueue.length === 0) return;

        const nextExecution = executionQueue[0];
        set((state) => ({
          executionQueue: state.executionQueue.slice(1),
          activeExecution: {
            ...nextExecution,
            status: "running",
            startedAt: new Date(),
          },
        }));

        try {
          // Simulate script execution
          await new Promise((resolve) => setTimeout(resolve, 2000));

          set((state) => ({
            activeExecution: state.activeExecution
              ? {
                  ...state.activeExecution,
                  status: "completed",
                  completedAt: new Date(),
                }
              : null,
          }));
        } catch (error) {
          set((state) => ({
            activeExecution: state.activeExecution
              ? {
                  ...state.activeExecution,
                  status: "failed",
                  completedAt: new Date(),
                }
              : null,
          }));
        } finally {
          // Process next in queue
          get().processQueue();
        }
      },

      // Terminal operations
      appendTerminalOutput: (output) => {
        set((state) => ({
          terminalOutput: [...state.terminalOutput, output],
        }));
      },

      clearTerminal: () => {
        set({ terminalOutput: [] });
      },

      importScripts: async (scripts) => {
        try {
          set({ loading: true, error: null });
          const newScripts = scripts.map((script) => ({
            ...script,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            lastExecutedAt: null,
            executionCount: 0,
            version: 1,
          }));
          set((state) => ({ scripts: [...state.scripts, ...newScripts] }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to import scripts",
          });
        } finally {
          set({ loading: false });
        }
      },

      exportScripts: async (ids) => {
        const scripts = get().scripts.filter((s) => ids.includes(s.id));
        return JSON.stringify(scripts, null, 2);
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),

      getScriptStatistics: () => {
        const scripts = get().scripts;
        return {
          totalScripts: scripts.length,
          totalExecutions: scripts.reduce(
            (sum, s) => sum + s.executionCount,
            0
          ),
          mostUsedScript: scripts.reduce<Script | null>(
            (mostUsed, s) =>
              !mostUsed || s.executionCount > mostUsed.executionCount
                ? s
                : mostUsed,
            null
          ),
          categories: scripts.reduce<Record<string, number>>((acc, s) => {
            acc[s.category] = (acc[s.category] || 0) + 1;
            return acc;
          }, {}),
        };
      },

      recordHistory: (content: string) => {
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push({ content });
          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            return {
              historyIndex: state.historyIndex - 1,
            };
          }
          return {};
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            return {
              historyIndex: state.historyIndex + 1,
            };
          }
          return {};
        });
      },
    }),
    {
      name: "script-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

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
  setInput: (input: string | ((prev: string) => string)) => void;
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
      setInput: (input) =>
        set((state) => ({
          input: typeof input === "function" ? input(state.input) : input,
        })),
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

interface EditorState {
  theme: "monokai" | "github" | "dark";
  fontSize: number;
  tabSize: number;
  wordWrap: "off" | "on";
  showInvisibles: boolean;
  showGutter: boolean;
  highlightActiveLine: boolean;
  enableLiveAutocompletion: boolean;
  enableSnippets: boolean;
  enableFormat: boolean;
  toggleTheme: () => void;
  setOptions: (
    options: Partial<Omit<EditorState, "toggleTheme" | "setOptions">>
  ) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  theme: "monokai",
  fontSize: 14,
  tabSize: 2,
  wordWrap: "off",
  showInvisibles: false,
  showGutter: true,
  highlightActiveLine: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  enableFormat: true,
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "monokai" : "dark",
    })),
  setOptions: (options) =>
    set((state) => ({
      ...state,
      ...options,
    })),
}));
