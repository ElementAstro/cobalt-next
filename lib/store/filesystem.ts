import {
  CustomizationOptions,
  Folder,
  File,
  CustomizationOptionsData,
} from "@/types/filesystem";
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
  isSuccess: boolean;
  isEncrypting: boolean;
  isProcessing: boolean;
  setIsSuccess: (success: boolean) => void;
  setSelectedFile: (file: File | null) => void;
  setPassword: (password: string) => void;
  toggleEncrypting: () => void;
  setIsProcessing: (processing: boolean) => void;
}

export const useFileEncryption = create<FileEncryptionState>((set) => ({
  selectedFile: null,
  password: "",
  isSuccess: false,
  isEncrypting: true,
  isProcessing: false,
  setIsSuccess: (success) => set({ isSuccess: success }),
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

interface SettingsState {
  options: CustomizationOptionsData;
  setOptions: (options: CustomizationOptionsData) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
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
      type: "document",
      size: 1024,
      lastModified: new Date(),
      createdAt: new Date(),
      path: "/documents/document1.pdf",
      owner: "John Doe",
      permissions: "read-write",
    },
    {
      id: 2,
      name: "image.jpg",
      type: "image",
      size: 2048,
      lastModified: new Date(),
      createdAt: new Date(),
      path: "/images/image.jpg",
      owner: "Jane Doe",
      permissions: "read-only",
    },
    {
      id: 3,
      name: "spreadsheet.xlsx",
      type: "document",
      size: 512,
      lastModified: new Date(),
      createdAt: new Date(),
      path: "/documents/spreadsheet.xlsx",
      owner: "John Doe",
      permissions: "read-write",
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

interface FileSystemStore {
  currentPath: string[];
  selectedFiles: string[];
  viewMode: "grid" | "list";
  sortBy: "name" | "size" | "lastModified";
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: string | null;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  previewFile: File | null;
  setPreviewFile: (file: File | null) => void;

  contextMenu: {
    x: number;
    y: number;
    file: File | Folder;
  } | null;
  setContextMenu: (
    context: {
      x: number;
      y: number;
      file: File | Folder;
    } | null
  ) => void;

  // Modals State
  isSettingsPanelOpen: boolean;
  setIsSettingsPanelOpen: (isOpen: boolean) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (isOpen: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (isOpen: boolean) => void;
  isVersionHistoryOpen: boolean;
  setIsVersionHistoryOpen: (isOpen: boolean) => void;
  isTagManagerOpen: boolean;
  setIsTagManagerOpen: (isOpen: boolean) => void;
  isRealtimeCollaborationOpen: boolean;
  setIsRealtimeCollaborationOpen: (isOpen: boolean) => void;
  isFileCompressionOpen: boolean;
  setIsFileCompressionOpen: (isOpen: boolean) => void;
  isCloudIntegrationOpen: boolean;
  setIsCloudIntegrationOpen: (isOpen: boolean) => void;
  isAdvancedSearchOpen: boolean;
  setIsAdvancedSearchOpen: (isOpen: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  isTrashBinOpen: boolean;
  setIsTrashBinOpen: (isOpen: boolean) => void;
  isFileEncryptionOpen: boolean;
  setIsFileEncryptionOpen: (isOpen: boolean) => void;
  isPropertiesOpen: boolean;
  setIsPropertiesOpen: (isOpen: boolean) => void;

  setCurrentPath: (path: string[]) => void;
  setSelectedFiles: (files: string[]) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "name" | "size" | "lastModified") => void;
  toggleSortOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFileSystemStore = create<FileSystemStore>((set) => ({
  currentPath: ["/"],
  selectedFiles: [],
  viewMode: "grid",
  sortBy: "name",
  sortOrder: "asc",
  loading: false,
  error: null,

  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),

  previewFile: null,
  setPreviewFile: (file) => set({ previewFile: file }),

  contextMenu: null,
  setContextMenu: (context) => set({ contextMenu: context }),

  // Modals State
  isSettingsPanelOpen: false,
  setIsSettingsPanelOpen: (isOpen) => set({ isSettingsPanelOpen: isOpen }),
  isUploadModalOpen: false,
  setIsUploadModalOpen: (isOpen) => set({ isUploadModalOpen: isOpen }),
  isSearchModalOpen: false,
  setIsSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
  isShareModalOpen: false,
  setIsShareModalOpen: (isOpen) => set({ isShareModalOpen: isOpen }),
  isVersionHistoryOpen: false,
  setIsVersionHistoryOpen: (isOpen) => set({ isVersionHistoryOpen: isOpen }),
  isTagManagerOpen: false,
  setIsTagManagerOpen: (isOpen) => set({ isTagManagerOpen: isOpen }),
  isRealtimeCollaborationOpen: false,
  setIsRealtimeCollaborationOpen: (isOpen) =>
    set({ isRealtimeCollaborationOpen: isOpen }),
  isFileCompressionOpen: false,
  setIsFileCompressionOpen: (isOpen) => set({ isFileCompressionOpen: isOpen }),
  isCloudIntegrationOpen: false,
  setIsCloudIntegrationOpen: (isOpen) =>
    set({ isCloudIntegrationOpen: isOpen }),
  isAdvancedSearchOpen: false,
  setIsAdvancedSearchOpen: (isOpen) => set({ isAdvancedSearchOpen: isOpen }),
  isAuthModalOpen: false,
  setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  isTrashBinOpen: false,
  setIsTrashBinOpen: (isOpen) => set({ isTrashBinOpen: isOpen }),
  isFileEncryptionOpen: false,
  setIsFileEncryptionOpen: (isOpen) => set({ isFileEncryptionOpen: isOpen }),
  isPropertiesOpen: false,
  setIsPropertiesOpen: (isOpen) => set({ isPropertiesOpen: isOpen }),

  setCurrentPath: (path) => set({ currentPath: path }),
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc" })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
