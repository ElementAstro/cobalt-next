"use client";

import React, { useMemo, useCallback, useState } from "react";
import { mockFileSystem } from "@/data/mock-filesystem";
import { File, Folder as FolderType } from "@/types/filesystem";
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
    // removed unused loading & error
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
  // removed unused states

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

  const [isVersionHistoryOpenTemp, setIsVersionHistoryOpenTemp] =
    useState(false);
  // state to open modals triggered by handleFileOperation
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
          break;
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

    // customOptions.showHiddenFiles is assigned a type from our patched interface
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
            upload: () => {}, // TODO: Implement upload modal
            search: () => setIsSearchModalOpen(true),
            share: () => {}, // TODO: Implement share modal
            versionHistory: () => setIsVersionHistoryOpen(true),
            tagManager: () => setIsTagManagerOpen(true),
            realtimeCollaboration: () => {}, // TODO: Implement realtime collaboration
            fileCompression: () => setIsFileCompressionOpen(true),
            cloudIntegration: () => {}, // TODO: Implement cloud integration
            advancedSearch: () => setIsAdvancedSearchOpen(true),
            authModal: () => {}, // TODO: Implement auth modal
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
                    ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                    : customOptions.options.gridSize === "medium"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                }`
              : "space-y-1"
          }`}
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
