import { create } from "zustand";

interface CollaborationState {
  collaborators: string[];
  chat: { user: string; message: string }[];
  addCollaborator: (name: string) => void;
  addMessage: (message: { user: string; message: string }) => void;
  reset: () => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  collaborators: [],
  chat: [],
  addCollaborator: (name) =>
    set((state) => ({
      collaborators: [...state.collaborators, name],
    })),
  addMessage: (message) =>
    set((state) => ({
      chat: [...state.chat, message],
    })),
  reset: () => set({ collaborators: [], chat: [] }),
}));