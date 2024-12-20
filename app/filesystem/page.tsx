"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  List,
  Grid,
  ArrowUpDown,
  Upload,
  Share2,
  Clock,
  Tag,
  RefreshCw,
  Archive,
  Cloud,
  Lock,
  Trash2,
} from "lucide-react";
import { mockFileSystem } from "@/utils/mock-filesystem";
import {
  File,
  Folder as FolderType,
  CustomizationOptions,
} from "@/types/filesystem";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "./layout/Header";
import { FileList } from "./layout/FileList";
import { ContextMenu } from "./layout/ContextMenu";
import { SettingsPanel } from "./components/SettingsPanel";
import { SearchModal } from "./components/SearchModal";
import { ShareModal } from "./components/ShareModal";
import { VersionHistory } from "./components/VersionHistory";
import { TagManager } from "./components/TagManager";
import { RealtimeCollaboration } from "./components/RealtimeCollaboration";
import { FileCompression } from "./components/FileCompression";
import { CloudIntegration } from "./components/CloudIntegration";
import { AdvancedSearch } from "./components/AdvancedSearch";
import { TrashBin } from "./components/TrashBin";
import { FileEncryption } from "./components/FileEncryption";
import { FileProperties } from "./components/FileProperties";
import { useDropzone, DropEvent, FileRejection } from "react-dropzone";
import { FilePreview } from "./components/FilePreview";

export default function FileBrowser() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "size" | "lastModified">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: File | FolderType;
  } | null>(null);
  const [customOptions, setCustomOptions] = useState<
    CustomizationOptions["options"]
  >({
    gridSize: "medium",
    showHiddenFiles: false,
    listView: "comfortable",
    sortBy: "name",
    sortDirection: "asc",
    thumbnailQuality: "medium",
    autoBackup: true,
    defaultView: "grid",
  });
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isRealtimeCollaborationOpen, setIsRealtimeCollaborationOpen] =
    useState(false);
  const [isFileCompressionOpen, setIsFileCompressionOpen] = useState(false);
  const [isCloudIntegrationOpen, setIsCloudIntegrationOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrashBinOpen, setIsTrashBinOpen] = useState(false);
  const [isFileEncryptionOpen, setIsFileEncryptionOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      console.log("Dropped files:", acceptedFiles);
      // Transform browser File objects into your custom File type
      const customFiles = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        createdAt: new Date(),
        owner: "current-user",
        permissions: { read: true, write: true },
        path: `/uploads/${file.name}`,
      }));
      // TODO: Handle the transformed files
    },
    []
  );

  // 添加批量选择状态
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // 添加排序功能
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isFolder = (item: File | FolderType): item is FolderType => {
    return (item as FolderType).files !== undefined;
  };

  const currentFolder = useMemo(() => {
    let folder: FolderType = mockFileSystem;
    for (const pathPart of currentPath) {
      const nextFolder = folder.files.find(
        (f) => isFolder(f) && f.name === pathPart
      ) as FolderType;
      if (nextFolder) {
        folder = nextFolder;
      } else {
        break;
      }
    }
    return folder;
  }, [currentPath]);

  const files = useMemo(() => {
    let result: (File | FolderType)[] = currentFolder.files || [];
    if (searchTerm) {
      result = result.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (!customOptions.showHiddenFiles) {
      result = result.filter((file) => !file.name.startsWith("."));
    }
    return result.sort((a, b) => {
      if (isFolder(a) && !isFolder(b)) return -1;
      if (!isFolder(a) && isFolder(b)) return 1;
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "size") {
        if ("size" in a && "size" in b) {
          return sortOrder === "asc" ? a.size - b.size : b.size - a.size;
        }
        return 0;
      } else {
        if ("lastModified" in a && "lastModified" in b) {
          return sortOrder === "asc"
            ? a.lastModified.getTime() - b.lastModified.getTime()
            : b.lastModified.getTime() - a.lastModified.getTime();
        }
        return 0;
      }
    });
  }, [
    currentFolder,
    searchTerm,
    sortBy,
    sortOrder,
    customOptions.showHiddenFiles,
  ]);

  const handleFileClick = useCallback(
    (file: File | FolderType) => {
      if (isFolder(file)) {
        setCurrentPath([...currentPath, file.name]);
      } else {
        setPreviewFile(file as File);
      }
    },
    [currentPath]
  );

  const handleDelete = useCallback(() => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const deleteFiles = (folder: FolderType) => {
      if (folder.files) {
        folder.files = folder.files.filter(
          (file) => !selectedFiles.includes(file.id)
        );
        folder.files.forEach((file) => {
          if (isFolder(file)) {
            deleteFiles(file as FolderType);
          }
        });
      }
    };
    deleteFiles(mockFileSystem);
    setSelectedFiles([]);
  }, [selectedFiles]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, file: File | FolderType) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, file });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setCustomOptions((prev) => ({
      ...prev,
    }));
  }, []);

  const handleFileOperation = useCallback(
    (operation: string, file: File) => {
      switch (operation) {
        case "preview":
          setPreviewFile(file);
          break;
        case "download":
          // Handle download logic here
          break;
        case "rename":
          // Handle rename logic here
          break;
        case "share":
          setIsShareModalOpen(true);
          break;
        case "versionHistory":
          setIsVersionHistoryOpen(true);
          break;
        case "manageTags":
          setIsTagManagerOpen(true);
          break;
        case "compress":
          setIsFileCompressionOpen(true);
          break;
        case "encrypt":
          setIsFileEncryptionOpen(true);
          break;
        case "delete":
          handleDelete();
          break;
        case "properties":
          setSelectedFile(file);
          setIsPropertiesOpen(true);
          break;
        default:
          break;
      }
    },
    [handleDelete]
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const reorderedFiles = Array.from(files);
    const [movedFile] = reorderedFiles.splice(source.index, 1);
    reorderedFiles.splice(destination.index, 0, movedFile);

    // 更新 mockFileSystem 或状态以反映重新排序
    currentFolder.files = reorderedFiles as (File | FolderType)[];
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 flex flex-col">
        <Header
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          openModals={{
            settings: () => setIsSettingsPanelOpen(true),
            upload: () => setIsUploadModalOpen(true),
            search: () => setIsSearchModalOpen(true),
            share: () => setIsShareModalOpen(true),
            versionHistory: () => setIsVersionHistoryOpen(true),
            tagManager: () => setIsTagManagerOpen(true),
            realtimeCollaboration: () => setIsRealtimeCollaborationOpen(true),
            fileCompression: () => setIsFileCompressionOpen(true),
            cloudIntegration: () => setIsCloudIntegrationOpen(true),
            advancedSearch: () => setIsAdvancedSearchOpen(true),
            authModal: () => setIsAuthModalOpen(true),
            trashBin: () => setIsTrashBinOpen(true),
            fileEncryption: () => setIsFileEncryptionOpen(true),
          }}
          selectedFiles={selectedFiles}
          handleDelete={handleDelete}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 overflow-auto p-4 ${
            viewMode === "grid"
              ? `grid gap-4 ${
                  customOptions.gridSize === "small"
                    ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                    : customOptions.gridSize === "medium"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`
              : "space-y-2"
          }`}
        >
          <FileList
            files={files}
            viewMode={viewMode}
            customOptions={customOptions}
            handleDelete={handleDelete}
            handleContextMenu={handleContextMenu}
            handleFileOperation={handleFileOperation}
            selectedFiles={selectedFiles}
          />
        </motion.div>
        <AnimatePresence>
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              file={contextMenu.file as File}
              handleFileOperation={handleFileOperation}
              closeContextMenu={closeContextMenu}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {previewFile && (
            <FilePreview
              file={previewFile}
              onClose={() => setPreviewFile(null)}
            />
          )}
        </AnimatePresence>
      </div>
      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        options={customOptions}
        setOptions={setCustomOptions}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <VersionHistory
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />
      <TagManager
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
      />
      <RealtimeCollaboration
        isOpen={isRealtimeCollaborationOpen}
        onClose={() => setIsRealtimeCollaborationOpen(false)}
      />
      <FileCompression
        isOpen={isFileCompressionOpen}
        onClose={() => setIsFileCompressionOpen(false)}
      />
      <CloudIntegration
        isOpen={isCloudIntegrationOpen}
        onClose={() => setIsCloudIntegrationOpen(false)}
      />
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
      />
      <TrashBin
        isOpen={isTrashBinOpen}
        setIsOpen={() => setIsTrashBinOpen(false)}
      />
      <FileEncryption
        isOpen={isFileEncryptionOpen}
        onClose={() => setIsFileEncryptionOpen(false)}
      />
      {selectedFile && (
        <FileProperties
          file={selectedFile}
          isOpen={isPropertiesOpen}
          onClose={() => setIsPropertiesOpen(false)}
        />
      )}
    </DragDropContext>
  );
}