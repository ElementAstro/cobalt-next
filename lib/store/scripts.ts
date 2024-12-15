import { create } from "zustand";

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
