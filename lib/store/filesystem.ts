import { create } from "zustand";

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fileType: "all" | "document" | "image" | "video";
  setFileType: (type: "all" | "document" | "image" | "video") => void;
  dateRange: "any" | "past-week" | "past-month" | "past-year";
  setDateRange: (
    range: "any" | "past-week" | "past-month" | "past-year"
  ) => void;
  includeArchived: boolean;
  setIncludeArchived: (include: boolean) => void;
  searchResults: string[];
  setSearchResults: (results: string[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  fileType: "all",
  setFileType: (type) => set({ fileType: type }),
  dateRange: "any",
  setDateRange: (range) => set({ dateRange: range }),
  includeArchived: false,
  setIncludeArchived: (include) => set({ includeArchived: include }),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () =>
    set({
      searchTerm: "",
      fileType: "all",
      dateRange: "any",
      includeArchived: false,
      searchResults: [],
      isLoading: false,
    }),
}));

interface CloudState {
  selectedService: string;
  setSelectedService: (service: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  feedback: { type: "success" | "error"; message: string } | null;
  setFeedback: (
    feedback: { type: "success" | "error"; message: string } | null
  ) => void;
}

export const useCloudStore = create<CloudState>((set) => ({
  selectedService: "google-drive",
  setSelectedService: (service) => set({ selectedService: service }),
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  feedback: null,
  setFeedback: (feedback) => set({ feedback }),
}));

interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  operations: string[];
  theme: "light" | "dark";
  setContextMenu: (data: {
    isVisible: boolean;
    x: number;
    y: number;
    operations: string[];
    theme: "light" | "dark";
  }) => void;
  closeContextMenu: () => void;
  handleOperation: (operation: string) => void;
}

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  isVisible: false,
  x: 0,
  y: 0,
  operations: [],
  theme: "light",
  setContextMenu: ({ isVisible, x, y, operations, theme }) =>
    set({ isVisible, x, y, operations, theme }),
  closeContextMenu: () => set({ isVisible: false, operations: [] }),
  handleOperation: (operation: string) => {
    // 可以在这里添加操作处理逻辑
    console.log(`Operation selected: ${operation}`);
    set({ isVisible: false, operations: [] });
  },
}));

interface FileCompressionState {
  selectedFiles: File[];
  compressionType: "zip" | "rar" | "7z";
  isCompressing: boolean;
  setSelectedFiles: (files: File[]) => void;
  setCompressionType: (type: "zip" | "rar" | "7z") => void;
  setIsCompressing: (compressing: boolean) => void;
}

export const useFileCompression = create<FileCompressionState>((set) => ({
  selectedFiles: [],
  compressionType: "zip",
  isCompressing: false,
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  setCompressionType: (type) => set({ compressionType: type }),
  setIsCompressing: (compressing) => set({ isCompressing: compressing }),
}));

interface FileEncryptionState {
  selectedFile: File | null;
  password: string;
  isEncrypting: boolean;
  isProcessing: boolean;
  setSelectedFile: (file: File | null) => void;
  setPassword: (password: string) => void;
  toggleEncrypting: () => void;
  setIsProcessing: (processing: boolean) => void;
}

export const useFileEncryption = create<FileEncryptionState>((set) => ({
  selectedFile: null,
  password: "",
  isEncrypting: true,
  isProcessing: false,
  setSelectedFile: (file) => set({ selectedFile: file }),
  setPassword: (password) => set({ password }),
  toggleEncrypting: () =>
    set((state) => ({ isEncrypting: !state.isEncrypting })),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
}));

interface FileItemState {
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
}

export const useFileItemStore = create<FileItemState>((set) => ({
  selectedFileId: null,
  setSelectedFileId: (id) => set({ selectedFileId: id }),
}));

interface FileUploadState {
  files: File[];
  theme: "light" | "dark";
  setFiles: (files: File[]) => void;
  toggleTheme: () => void;
}

export const useFileUploadStore = create<FileUploadState>((set) => ({
  files: [],
  theme: "light",
  setFiles: (files) => set({ files }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));

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

export interface CustomizationOptions {
  theme: "light" | "dark";
  gridSize: "small" | "medium" | "large";
  showHiddenFiles: boolean;
}

interface SettingsState {
  options: CustomizationOptions;
  setOptions: (options: CustomizationOptions) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  options: {
    theme: "dark",
    gridSize: "medium",
    showHiddenFiles: false,
  },
  setOptions: (options) => set({ options }),
}));

interface ShareModalState {
  permissions: "view" | "edit" | "full";
  setPermissions: (permissions: "view" | "edit" | "full") => void;
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  permissions: "view",
  setPermissions: (permissions) => set({ permissions }),
}));

interface TagManagerState {
  tags: string[];
  theme: "light" | "dark";
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useTagManagerStore = create<TagManagerState>((set) => ({
  tags: ["Important", "Work", "Personal"],
  theme: "dark",
  addTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
    })),
  removeTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),
  setTheme: (theme) => set({ theme }),
}));

interface File {
  id: number;
  name: string;
  deletedAt: string;
}

interface TrashBinState {
  deletedFiles: File[];
  theme: "light" | "dark";
  restoreFile: (id: number) => void;
  emptyTrash: () => void;
  toggleTheme: () => void;
}

export const useTrashBinStore = create<TrashBinState>((set) => ({
  deletedFiles: [
    {
      id: 1,
      name: "document1.pdf",
      deletedAt: new Date(Date.now() - 86400000).toLocaleString(),
    },
    {
      id: 2,
      name: "image.jpg",
      deletedAt: new Date(Date.now() - 172800000).toLocaleString(),
    },
    {
      id: 3,
      name: "spreadsheet.xlsx",
      deletedAt: new Date(Date.now() - 259200000).toLocaleString(),
    },
  ],
  theme: "dark",
  restoreFile: (id) =>
    set((state) => ({
      deletedFiles: state.deletedFiles.filter((file) => file.id !== id),
    })),
  emptyTrash: () =>
    set(() => ({
      deletedFiles: [],
    })),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
}));
