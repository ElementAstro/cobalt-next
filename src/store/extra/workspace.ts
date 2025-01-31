import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Workspace {
  id: string;
  name: string;
  apps: string[];
  layout: 'grid' | 'list';
  sortOrder: string[];
  filters: {
    category?: string;
    tags?: string[];
    search?: string;
  };
}

interface WorkspaceState {
  workspaces: Record<string, Workspace>;
  activeWorkspace: string | null;
  workspaceHistory: string[];
}

interface WorkspaceActions {
  createWorkspace: (workspace: Omit<Workspace, 'id'>) => string;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string | null) => void;
  addAppToWorkspace: (workspaceId: string, appId: string) => void;
  removeAppFromWorkspace: (workspaceId: string, appId: string) => void;
  updateWorkspaceLayout: (workspaceId: string, layout: 'grid' | 'list') => void;
  updateWorkspaceSort: (workspaceId: string, sortOrder: string[]) => void;
}

const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  persist(
    (set, get) => ({
      workspaces: {},
      activeWorkspace: null,
      workspaceHistory: [],

      createWorkspace: (workspace) => {
        const id = Date.now().toString();
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [id]: { ...workspace, id },
          },
          activeWorkspace: id,
        }));
        return id;
      },

      updateWorkspace: (id, updates) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [id]: { ...state.workspaces[id], ...updates },
          },
        }));
      },

      deleteWorkspace: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.workspaces;
          return {
            workspaces: remaining,
            activeWorkspace:
              state.activeWorkspace === id ? null : state.activeWorkspace,
          };
        });
      },

      setActiveWorkspace: (id) => {
        if (id) {
          set((state) => ({
            activeWorkspace: id,
            workspaceHistory: [...state.workspaceHistory, id].slice(-10),
          }));
        }
      },

      addAppToWorkspace: (workspaceId, appId) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              apps: [...state.workspaces[workspaceId].apps, appId],
            },
          },
        }));
      },

      removeAppFromWorkspace: (workspaceId, appId) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              apps: state.workspaces[workspaceId].apps.filter(
                (id) => id !== appId
              ),
            },
          },
        }));
      },

      updateWorkspaceLayout: (workspaceId, layout) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              layout,
            },
          },
        }));
      },

      updateWorkspaceSort: (workspaceId, sortOrder) => {
        set((state) => ({
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              sortOrder,
            },
          },
        }));
      },
    }),
    {
      name: 'app-workspaces',
    }
  )
);

export default useWorkspaceStore;
