"use client";

import React, { useMemo, useCallback, useState } from "react";
import { mockFileSystem } from "@/data/mock-filesystem";
import { File, Folder as FolderType, FileOperation } from "@/types/filesystem";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/filesystem/header";
import { FileList } from "@/components/filesystem/file-list";
import { CustomContextMenu as ContextMenu } from "@/components/filesystem/context-menu";
import { SettingsPanel } from "@/components/filesystem/settings-panel";
import { SearchModal } from "@/components/filesystem/search-modal";
import { VersionHistory } from "@/components/filesystem/version-history";
import { TagManager } from "@/components/filesystem/tag-manager";
import { FileCompression } from "@/components/filesystem/file-compression";
import { AdvancedSearch } from "@/components/filesystem/advanced-search";
import { TrashBin } from "@/components/filesystem/trash-bin";
import { FileEncryption } from "@/components/filesystem/file-encryption";
import { FileProperties } from "@/components/filesystem/file-properties";
import { FilePreview } from "@/components/filesystem/file-preview";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { toast } from "@/hooks/use-toast";

// Zod schema for file operations validation
const fileOperationSchema = z.object({
  operation: z.enum([
    "open",
    "preview",
    "download",
    "rename",
    "delete",
    "copy",
    "cut",
    "paste",
    "share",
    "properties",
    "versionHistory",
    "manageTags",
    "compress",
    "encrypt",
  ]),
  file: z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1, "文件名不能为空"),
    type: z.enum([
      "folder",
      "image",
      "video",
      "document",
      "code",
      "audio",
      "archive",
      "unknown",
    ]),
    size: z.number().min(0, "文件大小不能为负数"),
    createdAt: z.date(),
    lastModified: z.date(),
    owner: z.string().min(1, "所有者不能为空"),
    permissions: z.string().min(1, "权限不能为空"),
    path: z.string().min(1, "路径不能为空"),
  }),
});

// Make sure the store or its types define these properties properly:
interface CustomizationOptionsData {
  showHiddenFiles: boolean;
  gridSize: "small" | "medium" | "large";
}

export default function FileBrowser() {
  const {
    currentPath,
    setCurrentPath,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    setSortBy,
    toggleSortOrder,
    viewMode,
    setViewMode,
    selectedFiles,
    setSelectedFiles,
    options: customOptions,
    setOptions,
  } = useFilesystemStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: File | FolderType;
    isVisible: boolean;
    operations: string[];
    theme: string;
  } | null>(null);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isFileCompressionOpen, setIsFileCompressionOpen] = useState(false);
  const [isFileEncryptionOpen, setIsFileEncryptionOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isTrashBinOpen, setIsTrashBinOpen] = useState(false);

  const isFolder = (item: File | FolderType): item is FolderType => {
    return (item as FolderType).files !== undefined;
  };

  const handleDelete = useCallback(() => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const deleteFiles = (folder: FolderType) => {
      if (folder.files) {
        folder.files = folder.files.filter(
          (file) => !selectedFiles.includes(file.id.toString())
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
    toast({
      title: "删除成功",
      description: `已删除${selectedFiles.length}个文件`,
    });
  }, [selectedFiles, setSelectedFiles]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, file: File | FolderType) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        file,
        isVisible: true,
        operations: [
          "preview",
          "download",
          "rename",
          "share",
          "versionHistory",
          "manageTags",
          "compress",
          "encrypt",
          "delete",
          "properties",
        ],
        theme: "dark",
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleFileOperation = useCallback(
    (operation: string, file: File) => {
      try {
        // Validate operation and file data
        const validated = fileOperationSchema.parse({
          operation,
          file,
        });

        switch (validated.operation) {
          case "preview":
            setPreviewFile(validated.file);
            break;
          case "download":
            // Handle download logic here
            break;
          case "rename":
            // Handle rename logic here
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
            setIsPropertiesOpen(true);
            break;
          default:
            throw new Error(`无效操作: ${operation}`);
        }
      } catch (error) {
        console.error("文件操作验证失败:", error);
        setError(error instanceof Error ? error.message : "未知错误");
        toast({
          title: "操作失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive",
        });
      }
    },
    [
      handleDelete,
      setIsFileCompressionOpen,
      setIsFileEncryptionOpen,
      setIsTagManagerOpen,
      setIsVersionHistoryOpen,
      setIsPropertiesOpen,
    ]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setSelectedFiles((items: string[]) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });

      const reorderedFiles = arrayMove(
        mockFileSystem.files,
        mockFileSystem.files.findIndex(
          (file: File | FolderType) => file.id === active.id
        ),
        mockFileSystem.files.findIndex(
          (file: File | FolderType) => file.id === over.id
        )
      );

      mockFileSystem.files = reorderedFiles as (File | FolderType)[];
    }
  };

  const currentFolder = useMemo(() => {
    let folder: FolderType = mockFileSystem;
    for (const pathPart of currentPath) {
      const nextFolder = folder.files.find(
        (f: File | FolderType) => isFolder(f) && f.name === pathPart
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

    if (!customOptions.options.showHiddenFiles) {
      result = result.filter((file) => !file.name.startsWith("."));
    }

    return result.sort((a, b) => {
      // folder first
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
        // lastModified
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
    customOptions.options.showHiddenFiles,
  ]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className="h-screen flex flex-col overflow-hidden bg-gray-900 text-gray-100">
        <Header
          currentPath={Array.isArray(currentPath) ? currentPath : [currentPath]}
          setCurrentPath={(path: string | string[]) =>
            setCurrentPath(Array.isArray(path) ? path.join("/") : path)
          }
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={
            sortBy === "date"
              ? "lastModified"
              : sortBy === "type"
              ? "name"
              : sortBy
          }
          sortOrder={sortOrder}
          setSortOrder={setSearchTerm}
          setSortBy={setSortBy}
          toggleSortOrder={toggleSortOrder}
          openModals={{
            settings: () => setIsSettingsPanelOpen(true),
            upload: () => {},
            search: () => setIsSearchModalOpen(true),
            share: () => {},
            versionHistory: () => setIsVersionHistoryOpen(true),
            tagManager: () => setIsTagManagerOpen(true),
            realtimeCollaboration: () => {},
            fileCompression: () => setIsFileCompressionOpen(true),
            cloudIntegration: () => {},
            advancedSearch: () => setIsAdvancedSearchOpen(true),
            authModal: () => {},
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
          className={`flex-1 overflow-auto px-2 py-1 md:p-2 ${
            viewMode === "grid"
              ? `grid gap-2 md:gap-3 auto-rows-min ${
                  customOptions.options.gridSize === "small"
                    ? "grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9"
                    : customOptions.options.gridSize === "medium"
                    ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7"
                }`
              : "space-y-1"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4a5568 #2d3748",
          }}
        >
          <SortableContext
            items={files.map((file) => file.id)}
            strategy={verticalListSortingStrategy}
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
          </SortableContext>
        </motion.div>
        <AnimatePresence>
          {contextMenu && contextMenu.isVisible && <ContextMenu />}
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
        options={customOptions.options}
        setOptions={(options: CustomizationOptionsData) =>
          setOptions({ ...customOptions })
        }
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <VersionHistory
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />
      <TagManager
        isOpen={isTagManagerOpen}
        onClose={() => setIsTagManagerOpen(false)}
      />
      <FileCompression
        isOpen={isFileCompressionOpen}
        onClose={() => setIsFileCompressionOpen(false)}
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
      {isPropertiesOpen && contextMenu?.file && (
        <FileProperties
          item={contextMenu.file}
          isOpen={isPropertiesOpen}
          onClose={() => setIsPropertiesOpen(false)}
        />
      )}
    </DndContext>
  );
}
