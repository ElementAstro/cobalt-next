import { CustomizationOptions, File, Folder } from "@/types/filesystem";
import { create } from "zustand";

interface FileUploadState {
  files: File[];
  folders: Folder[];
  setFiles: (files: File[]) => void;
  setFolders: (folders: Folder[]) => void;
}

interface FileSystemState {
  currentPath: string;
  selectedFiles: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "size" | "type" | "date";
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: string | null;
  setCurrentPath: (path: string) => void;
  setSelectedFiles: (files: string[] | ((prev: string[]) => string[])) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "name" | "size" | "type" | "date") => void;
  toggleSortOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface FileItemState {
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
}

interface FileEncryptionState {
  selectedFile: File | null;
  password: string;
  isSuccess: boolean;
  isEncrypting: boolean;
  isProcessing: boolean;
  setIsSuccess: (success: boolean) => void;
  setSelectedFile: (file: File | null) => void;
  setPassword: (password: string) => void;
  toggleEncrypting: () => void;
  setIsProcessing: (processing: boolean) => void;
}

interface FileCompressionState {
  selectedFilesForCompression: File[];
  compressionType: "zip" | "rar" | "7z";
  isCompressing: boolean;
  setSelectedFilesForCompression: (files: File[]) => void;
  setCompressionType: (type: "zip" | "rar" | "7z") => void;
  setIsCompressing: (compressing: boolean) => void;
}

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

interface TrashBinState {
  deletedFiles: File[];
  theme: "light" | "dark";
  restoreFile: (id: number) => void;
  emptyTrash: () => void;
  toggleTheme: () => void;
}

interface TagManagerState {
  tags: string[];
  theme: "light" | "dark";
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

interface SettingsState {
  options: CustomizationOptions;
  setOptions: (options: CustomizationOptions) => void;
}

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

interface AppState
  extends FileUploadState,
    FileSystemState,
    FileItemState,
    FileEncryptionState,
    FileCompressionState,
    ContextMenuState,
    TrashBinState,
    TagManagerState,
    SettingsState,
    SearchState {}

export const useFilesystemStore = create<AppState>((set, get) => ({
  // File Upload
  files: [],
  folders: [],
  setFiles: (files) => set({ files }),
  setFolders: (folders) => set({ folders }),

  // File System
  currentPath: "/",
  selectedFiles: [],
  viewMode: "grid",
  sortBy: "name",
  sortOrder: "asc",
  loading: false,
  error: null,
  setCurrentPath: (path) => set({ currentPath: path }),
  setSelectedFiles: (files) =>
    set((state) => ({
      selectedFiles:
        typeof files === "function" ? files(state.selectedFiles) : files,
    })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleSortOrder: () =>
    set({ sortOrder: get().sortOrder === "asc" ? "desc" : "asc" }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // File Item
  selectedFileId: null,
  setSelectedFileId: (id) => set({ selectedFileId: id }),

  // File Encryption
  selectedFile: null,
  password: "",
  isSuccess: false,
  isEncrypting: true,
  isProcessing: false,
  setIsSuccess: (success) => set({ isSuccess: success }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setPassword: (password) => set({ password }),
  toggleEncrypting: () => set({ isEncrypting: !get().isEncrypting }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),

  // File Compression
  selectedFilesForCompression: [],
  compressionType: "zip",
  isCompressing: false,
  setSelectedFilesForCompression: (files) =>
    set({ selectedFilesForCompression: files }),
  setCompressionType: (type) => set({ compressionType: type }),
  setIsCompressing: (compressing) => set({ isCompressing: compressing }),

  // Context Menu
  isVisible: false,
  x: 0,
  y: 0,
  operations: [],
  theme: "light",
  setContextMenu: ({ isVisible, x, y, operations, theme }) =>
    set({ isVisible, x, y, operations, theme }),
  closeContextMenu: () => set({ isVisible: false, operations: [] }),
  handleOperation: (operation: string) => {
    console.log(`Operation selected: ${operation}`);
    set({ isVisible: false, operations: [] });
  },

  // Trash Bin
  deletedFiles: [],
  restoreFile: (id) =>
    set((state) => ({
      deletedFiles: state.deletedFiles.filter((file) => file.id !== id),
    })),
  emptyTrash: () => set({ deletedFiles: [] }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),

  // Tag Manager
  tags: ["Important", "Work", "Personal"],
  addTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
    })),
  removeTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),
  setTheme: (theme) => set({ theme }),

  // Settings
  options: {
    isOpen: false,
    onClose: () => {},
    options: {
      gridSize: "medium",
      showHiddenFiles: false,
      listView: "comfortable",
      sortBy: "name",
      sortDirection: "asc",
      thumbnailQuality: "medium",
      autoBackup: false,
      defaultView: "grid",
    },
    setOptions: () => {},
  },
  setOptions: (options) => set({ options }),

  // Search
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
