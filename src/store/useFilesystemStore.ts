import {
  CustomizationOptions,
  File,
  FileOperation,
  Folder,
  Version,
  VersionDiff,
} from "@/types/filesystem";
import { create } from "zustand";
import { debounce } from "lodash";

import { filesystemApi } from "@/services/api/filesystem";
import { mockFilesystemApi } from "@/services/mock/filesystem";

const api =
  process.env.NEXT_PUBLIC_USE_MOCK === "true"
    ? mockFilesystemApi
    : filesystemApi;

interface FileUploadState {
  files: File[];
  folders: Folder[];
  setFiles: (files: File[]) => void;
  setFolders: (folders: Folder[]) => void;
}

interface FileSystemState {
  currentPath: string[];
  selectedFiles: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "size" | "type" | "date";
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: Error | null;
  setCurrentPath: (path: string[] | string) => void;
  setSelectedFiles: (files: string[] | ((prev: string[]) => string[])) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "name" | "size" | "type" | "date") => void;
  toggleSortOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  getPathSegments: () => string[];
  joinPath: (...paths: (string | string[])[]) => string;
  normalizePath: (path: string | string[]) => string;
  isMultiSelectMode: boolean;
  toggleMultiSelectMode: () => void;
  clearSelection: () => void;
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

interface FileClipboardState {
  clipboardItems: string[]; // 存储剪切/复制的文件ID
  clipboardOperation: "copy" | "cut" | null; // 当前剪贴板操作类型
  addToClipboard: (itemIds: string[], operation: "copy" | "cut") => void;
  clearClipboard: () => void;
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
  pasteFiles: () => Promise<void>;
  copyFiles: (fileIds: string[]) => void;
  cutFiles: (fileIds: string[]) => void;
}

interface TrashBinState {
  deletedFiles: File[];
  restoreFile: (id: string) => void;
  emptyTrash: () => void;
  toggleTheme: () => void;
  permanentlyDeleteFile: (id: string) => void;
}

interface TagManagerState {
  tags: string[];
  tagColors: Record<string, string>;
  addGlobalTag: (tag: string, color?: string) => void;
  removeGlobalTag: (tag: string) => void;
  setTagColor: (tag: string, color: string) => void;
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
  searchResults: File[];
  setSearchResults: (results: File[]) => void;
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

interface VersionControlState {
  versions: Version[];
  selectedVersion: Version | null;
  isComparingVersions: boolean;
  comparedVersions: [Version | null, Version | null];
  setVersions: (versions: Version[]) => void;
  setSelectedVersion: (version: Version | null) => void;
  setIsComparingVersions: (comparing: boolean) => void;
  setComparedVersions: (versions: [Version | null, Version | null]) => void;
  fetchVersions: (fileId: string) => Promise<void>;
  restoreVersion: (fileId: string, versionId: string) => Promise<void>;
  createVersion: (fileId: string, comment: string) => Promise<void>;
  compareVersions: (v1: Version, v2: Version) => Promise<VersionDiff>;
}

interface AppState
  extends FileUploadState,
    FileSystemState,
    FileItemState,
    FileEncryptionState,
    FileCompressionState,
    FileClipboardState,
    ContextMenuState,
    TrashBinState,
    TagManagerState,
    SettingsState,
    SearchState,
    FilePreviewState,
    FileBreadcrumbState,
    FileMetadataState,
    VersionControlState {
  isLoading: boolean;
  error: Error | null;
  refreshFiles: () => void;
  fetchFiles: (path: string | string[]) => Promise<void>;
  fetchFolders: (path: string | string[]) => Promise<void>;
  uploadFiles: (files: FormData) => Promise<void>;
  searchFiles: (params: any) => Promise<void>;
  getFavorites: () => Promise<void>;
  getTags: () => Promise<void>;
  initialize: () => Promise<void>;
  operationHistory: {
    operation: FileOperation;
    timestamp: Date;
    files: string[];
  }[];
  addOperationToHistory: (operation: FileOperation, files: string[]) => void;
  clearHistory: () => void;
  batchOperations: {
    isProcessing: boolean;
    currentOperation: FileOperation | null;
    progress: number;
  };
  setBatchProcessing: (isProcessing: boolean) => void;
  updateBatchProgress: (progress: number) => void;
}

export const useFilesystemStore = create<AppState & FileClipboardState>(
  (set, get) => ({
    // File Upload
    files: [],
    folders: [],
    setFiles: (files) => set({ files }),
    setFolders: (folders) => set({ folders }),

    // File System
    currentPath: [],
    selectedFiles: [],
    viewMode: "grid",
    sortBy: "name",
    sortOrder: "asc",
    loading: false,
    error: null,
    setCurrentPath: (path) => {
      const pathArray =
        typeof path === "string" ? path.split("/").filter(Boolean) : path;
      set({ currentPath: pathArray });
      // 路径改变时自动刷新
      get().refreshFiles();
    },
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
    setError: (error: Error | null) => set({ error }),
    isMultiSelectMode: false,
    toggleMultiSelectMode: () => {
      set((state) => {
        const newMode = !state.isMultiSelectMode;
        // 退出多选模式时清空选择
        if (!newMode) {
          state.selectedFiles = [];
        }
        return { isMultiSelectMode: newMode };
      });
    },
    clearSelection: () => set({ selectedFiles: [] }),

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

    // 剪贴板相关状态和方法
    clipboardItems: [],
    clipboardOperation: null,

    addToClipboard: (itemIds, operation) =>
      set({
        clipboardItems: itemIds,
        clipboardOperation: operation,
      }),

    clearClipboard: () =>
      set({
        clipboardItems: [],
        clipboardOperation: null,
      }),

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

    // 优化上下文菜单操作
    copyFiles: (fileIds) => {
      get().addToClipboard(fileIds, "copy");
    },

    cutFiles: (fileIds) => {
      get().addToClipboard(fileIds, "cut");
    },

    pasteFiles: async () => {
      const { clipboardItems, clipboardOperation, currentPath, files } = get();

      if (!clipboardItems.length || !clipboardOperation) return;

      try {
        // 创建新的文件对象数组
        const newFiles = clipboardItems.map((id) => {
          const file = files.find((f) => f.id === id);
          if (!file) throw new Error(`File with id ${id} not found`);
          return {
            ...file,
            id: crypto.randomUUID(),
            path: currentPath.join("/"),
          };
        });

        // 如果是剪切操作,删除原文件
        if (clipboardOperation === "cut") {
          set((state) => ({
            files: state.files.filter(
              (f) => !clipboardItems.includes(f.id.toString())
            ),
          }));
        }

        // 添加新文件
        set((state) => ({
          files: [...state.files, ...newFiles],
        }));

        // 清空剪贴板
        get().clearClipboard();
      } catch (error) {
        console.error("Paste operation failed:", error);
        throw error;
      }
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
    permanentlyDeleteFile: (id) =>
      set((state) => ({
        deletedFiles: state.deletedFiles.filter((file) => file.id !== id),
      })),

    // Tag Manager
    tags: ["Important", "Work", "Personal"],
    tagColors: {
      Important: "#EF4444",
      Work: "#3B82F6",
      Personal: "#10B981",
    },
    addGlobalTag: (tag, color = "#3B82F6") =>
      set((state) => ({
        tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
        tagColors: { ...state.tagColors, [tag]: color },
      })),
    removeGlobalTag: (tag) =>
      set((state) => ({
        tags: state.tags.filter((t) => t !== tag),
        tagColors: Object.fromEntries(
          Object.entries(state.tagColors).filter(([key]) => key !== tag)
        ),
      })),
    setTagColor: (tag, color) =>
      set((state) => ({
        tagColors: { ...state.tagColors, [tag]: color },
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
      set((state) => ({
        showVersionHistory: show ?? !state.showVersionHistory,
      })),

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

    // API 操作方法
    fetchFiles: async (path: string | string[]) => {
      try {
        set({ isLoading: true, error: null });
        const normalized = get().normalizePath(path);
        const response = await api.getFiles(normalized);
        if (response.status === "success") {
          set({ files: response.data });
        }
      } catch (error) {
        set({ error: error as Error });
        console.error("Error fetching files:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchFolders: async (path: string | string[]) => {
      try {
        set({ isLoading: true, error: null });
        const normalized = get().normalizePath(path);
        const response = await api.getFolders(normalized);
        if (response.status === "success") {
          set({ folders: response.data });
        }
      } catch (error) {
        set({ error: error as Error });
        console.error("Error fetching folders:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    // FILEPATH: /d:/cobalt-next/src/store/useFilesystemStore.ts
    uploadFiles: async (files: FormData): Promise<void> => {
      try {
        const api =
          process.env.NEXT_PUBLIC_USE_MOCK === "true"
            ? mockFilesystemApi
            : filesystemApi;

        set({ isLoading: true, error: null });

        /*
   
    const fileList = Array.from(files.getAll('file')).filter((entry): entry is File => entry instanceof File);
    const currentPath = get().currentPath;
    
    // 并发上传所有文件
    const uploadPromises = fileList.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', currentPath.join('/'));
      
      const response = await api.uploadFiles(formData);
      return response.data;
    });
    
    const uploadedFiles = await Promise.all(uploadPromises);
    const flattenedFiles = uploadedFiles.flat();

    set(state => ({
    
      files: [...state.files, ...flattenedFiles]
    
    }));
    
    
    // 上传完成后自动刷新
    await get().refreshFiles();
    */
      } catch (error) {
        set({ error: error as Error });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    searchFiles: async (params) => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.search(params);
        set({ searchResults: response.data });
      } catch (error) {
        set({ error: error as Error });
      } finally {
        set({ isLoading: false });
      }
    },

    getFavorites: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.getFavorites();
        set({ favorites: response.data });
      } catch (error) {
        set({ error: error as Error });
      } finally {
        set({ isLoading: false });
      }
    },

    getTags: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.getTags();
        set({
          tags: response.data.tags,
          tagColors: response.data.colors,
        });
      } catch (error) {
        set({ error: error as Error });
      } finally {
        set({ isLoading: false });
      }
    },

    // 添加防抖的刷新函数
    refreshFiles: debounce(async () => {
      const state = get();
      if (!state.isLoading) {
        await state.fetchFiles(state.currentPath);
        await state.fetchFolders(state.currentPath);
      }
    }, 300),

    // 修改初始化方法以确保数据加载
    initialize: async () => {
      const state = get();
      try {
        set({ isLoading: true, error: null });
        await Promise.all([
          state.fetchFiles(state.currentPath),
          state.fetchFolders(state.currentPath),
          state.getFavorites(),
          state.getTags(),
        ]);
      } catch (error) {
        set({ error: error as Error });
        console.error("Error initializing filesystem:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    // 添加新的工具方法
    getPathSegments: () => {
      return get().currentPath;
    },

    joinPath: (...paths: (string | string[])[]) => {
      const flattened = paths
        .flat()
        .map((p) => p.replace(/^\/+|\/+$/g, ""))
        .filter(Boolean);
      return "/" + flattened.join("/");
    },

    normalizePath: (path: string | string[]) => {
      if (Array.isArray(path)) {
        return "/" + path.filter(Boolean).join("/");
      }
      if (!path) return "/";
      return "/" + path.split("/").filter(Boolean).join("/");
    },

    operationHistory: [],

    addOperationToHistory: (operation, files) =>
      set((state) => ({
        operationHistory: [
          ...state.operationHistory,
          {
            operation,
            timestamp: new Date(),
            files,
          },
        ],
      })),

    clearHistory: () => set({ operationHistory: [] }),

    batchOperations: {
      isProcessing: false,
      currentOperation: null,
      progress: 0,
    },

    setBatchProcessing: (isProcessing) =>
      set((state) => ({
        batchOperations: {
          ...state.batchOperations,
          isProcessing,
        },
      })),

    updateBatchProgress: (progress) =>
      set((state) => ({
        batchOperations: {
          ...state.batchOperations,
          progress,
        },
      })),

    // Version Control State
    versions: [],
    selectedVersion: null,
    isComparingVersions: false,
    comparedVersions: [null, null],

    setVersions: (versions) => set({ versions }),
    setSelectedVersion: (version) => set({ selectedVersion: version }),
    setIsComparingVersions: (comparing) =>
      set({ isComparingVersions: comparing }),
    setComparedVersions: (versions) => set({ comparedVersions: versions }),

    fetchVersions: async (fileId: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.getVersions(fileId);
        if (response.status === "success") {
          set({ versions: response.data });
        }
      } catch (error) {
        set({ error: error as Error });
        console.error("Error fetching versions:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    restoreVersion: async (fileId: string, versionId: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.restoreVersion(fileId, versionId);
        if (response.status === "success") {
          // 更新当前文件
          await get().refreshFiles();
        }
      } catch (error) {
        set({ error: error as Error });
        console.error("Error restoring version:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    createVersion: async (fileId: string, comment: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.createVersion(fileId, comment);
        if (response.status === "success") {
          await get().fetchVersions(fileId);
        }
      } catch (error) {
        set({ error: error as Error });
        console.error("Error creating version:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    compareVersions: async (v1: Version, v2: Version) => {
      try {
        set({ isLoading: true, error: null });
        const response = await api.compareVersions(
          v1.id.toString(),
          v2.id.toString()
        );
        if (response.status === "success") {
          set({ comparedVersions: [v1, v2] });
          return response.data;
        }
        throw new Error("Failed to compare versions");
      } catch (error) {
        set({ error: error as Error });
        console.error("Error comparing versions:", error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  })
);

// 导出初始化函数供组件使用
export const initializeFilesystem = () => {
  useFilesystemStore.getState().initialize();
};
