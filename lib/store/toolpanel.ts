import { create } from "zustand";
import { Tool } from "@/types/toolpanel";

interface ToolState {
  tools: Tool[];
  selectedTool: string | null;
  searchTerm: string;
  incrementUsage: (id: string) => void;
  setSelectedTool: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setTools: (tools: Tool[]) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  tools: [],
  selectedTool: null,
  searchTerm: "",
  incrementUsage: (id: string) =>
    set((state) => ({
      tools: state.tools.map((tool) =>
        tool.id === id ? { ...tool, usageCount: tool.usageCount + 1 } : tool
      ),
    })),
  setSelectedTool: (id: string | null) => set({ selectedTool: id }),
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setTools: (tools: Tool[]) => set({ tools }),
}));
