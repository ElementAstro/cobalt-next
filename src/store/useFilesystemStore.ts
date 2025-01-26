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
  setContextMenu: (data: {
    isVisible: boolean;
    x: number;
    y: number;
    operations: string[];
  }) => void;
  closeContextMenu: () => void;
  handleOperation: (operation: string) => void;
}

interface TrashBinState {
  deletedFiles: File[];
  restoreFile: (id: number) => void;
  emptyTrash: () => void;
  toggleTheme: () => void;
}

interface TagManagerState {
  tags: string[];
  addGlobalTag: (tag: string) => void;
  removeGlobalTag: (tag: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

interface SettingsState {
  options: CustomizationOptions;
  setOptions: (options: CustomizationOptions) => void;
  theme: "light" | "dark" | "system";
  fontSize: number;
  resetSettings: () => Promise<void>;
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
  minSize: number;
  setMinSize: (size: number) => void;
  maxSize: number;
  setMaxSize: (size: number) => void;
  owner: string;
  setOwner: (owner: string) => void;
  searchTags: string;
  setSearchTags: (tags: string) => void;
  reset: () => void;
}

interface FilePreviewState {
  previewFile: File | null;
  showPreview: boolean;
  showProperties: boolean;
  showVersionHistory: boolean;
  setPreviewFile: (file: File | null) => void;
  togglePreview: (show?: boolean) => void;
  toggleProperties: (show?: boolean) => void;
  toggleVersionHistory: (show?: boolean) => void;
}

interface FileBreadcrumbState {
  path: string[];
  history: string[][];
  currentHistoryIndex: number;
  setPath: (path: string[]) => void;
  goBack: () => void;
  goForward: () => void;
  addToHistory: (path: string[]) => void;
}

interface FileMetadataState {
  favorites: string[];
  fileTags: Record<string, string[]>;
  addToFavorites: (fileId: string) => void;
  removeFromFavorites: (fileId: string) => void;
  addFileTag: (fileId: string, tag: string) => void;
  removeFileTag: (fileId: string, tag: string) => void;
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
    SearchState,
    FilePreviewState,
    FileBreadcrumbState,
    FileMetadataState {}

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
  setContextMenu: ({ isVisible, x, y, operations }) =>
    set({ isVisible, x, y, operations }),
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
  addGlobalTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
    })),
  removeGlobalTag: (tag) =>
    set((state) => ({
      tags: state.tags.filter((t) => t !== tag),
    })),
  setTheme: (theme) => set({ theme }),

  // Settings
  options: {
    isOpen: false,
    onClose: () => {},
    options: {
      gridSize: "small" as const,
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
  theme: "system" as const,
  fontSize: 16,
  resetSettings: async () => {
    try {
      set({
        theme: "system" as const,
        fontSize: 16,
        options: {
          isOpen: false,
          onClose: () => {},
          options: {
            gridSize: "small" as const,
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
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

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
  minSize: 0,
  setMinSize: (size) => set({ minSize: size }),
  maxSize: 0,
  setMaxSize: (size) => set({ maxSize: size }),
  owner: "",
  setOwner: (owner) => set({ owner }),
  searchTags: "",
  setSearchTags: (tags) => set({ searchTags: tags }),
  reset: () =>
    set({
      searchTerm: "",
      fileType: "all",
      dateRange: "any",
      includeArchived: false,
      searchResults: [],
      isLoading: false,
      minSize: 0,
      maxSize: 0,
      owner: "",
      searchTags: "",
    }),

  // File Preview State
  previewFile: null,
  showPreview: false,
  showProperties: false,
  showVersionHistory: false,
  setPreviewFile: (file) => set({ previewFile: file }),
  togglePreview: (show) =>
    set((state) => ({ showPreview: show ?? !state.showPreview })),
  toggleProperties: (show) =>
    set((state) => ({ showProperties: show ?? !state.showProperties })),
  toggleVersionHistory: (show) =>
    set((state) => ({ showVersionHistory: show ?? !state.showVersionHistory })),

  // Breadcrumb History State
  path: [],
  history: [[]],
  currentHistoryIndex: 0,
  setPath: (path) => {
    set({ path });
    get().addToHistory(path);
  },
  goBack: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex > 0) {
      set({
        currentHistoryIndex: currentHistoryIndex - 1,
        path: history[currentHistoryIndex - 1],
      });
    }
  },
  goForward: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex < history.length - 1) {
      set({
        currentHistoryIndex: currentHistoryIndex + 1,
        path: history[currentHistoryIndex + 1],
      });
    }
  },
  addToHistory: (path) => {
    const { currentHistoryIndex, history } = get();
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), path];
    set({
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1,
    });
  },

  // Metadata State
  favorites: [],
  fileTags: {},
  addToFavorites: (fileId) =>
    set((state) => ({
      favorites: [...new Set([...state.favorites, fileId])],
    })),
  removeFromFavorites: (fileId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== fileId),
    })),
  addFileTag: (fileId, tag) =>
    set((state) => ({
      fileTags: {
        ...state.fileTags,
        [fileId]: [...new Set([...(state.fileTags[fileId] || []), tag])],
      },
    })),
  removeFileTag: (fileId, tag) =>
    set((state) => ({
      fileTags: {
        ...state.fileTags,
        [fileId]: (state.fileTags[fileId] || []).filter((t) => t !== tag),
      },
    })),
}));
