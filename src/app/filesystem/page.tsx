"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { mockFileSystem } from "@/data/mock-filesystem";
import {
  File,
  Folder as FolderType,
  FileOperation,
  ExtendedFile,
  FileSystemItem,
} from "@/types/filesystem";
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
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, m } from "framer-motion";
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
import {
  initializeFilesystem,
  useFilesystemStore,
} from "@/store/useFilesystemStore";
import { toast } from "@/hooks/use-toast";
import { TypeChart } from "@/components/filesystem/type-chart";
import { FolderOpen } from "lucide-react";

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
    "decrypt",
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
    modified: z.string().min(1, "修改时间不能为空"),
  }),
});

// Make sure the store or its types define these properties properly:
interface CustomizationOptionsData {
  showHiddenFiles: boolean;
  gridSize: "small" | "medium" | "large";
}

// 添加新的动画变体
const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const listTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// 添加拖动动画配置
const dragItemVariants = {
  dragging: {
    scale: 1.05,
    boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
    cursor: "grabbing",
  },
};

// 添加放置区域动画
const dropAreaVariants = {
  active: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgb(59, 130, 246)",
    transition: {
      duration: 0.2,
    },
  },
  inactive: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    transition: {
      duration: 0.2,
    },
  },
};

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
    files, // 添加这个
    folders, // 添加这个
    initialize, // 添加这个
    joinPath,
    getPathSegments,
  } = useFilesystemStore();

  // 修改 useEffect，确保组件挂载时初始化数据
  useEffect(() => {
    initialize();
  }, [initialize]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    file: FileSystemItem;
    isVisible: boolean;
    operations: string[];
    theme: string;
  } | null>(null);

  const [previewFile, setPreviewFile] = useState<ExtendedFile | null>(null);
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

  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  const [selectedOperation, setSelectedOperation] =
    useState<FileOperation | null>(null);
  const [lastActions, setLastActions] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

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
          if (isFolder(file as File | FolderType)) {
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
    (e: React.MouseEvent, file: FileSystemItem) => {
      e.preventDefault();

      // Get available operations
      const availableOperations = [
        ...(isFolder(file as File | FolderType) ? ["open"] : ["preview"]),
        "download",
        "rename",
        "share",
        "versionHistory",
        "manageTags",
        "compress",
        file.encrypted ? "decrypt" : "encrypt",
        "delete",
        "properties",
      ];

      // Calculate menu position
      const x = Math.min(
        e.clientX,
        window.innerWidth - 200 // Assume menu width is 200px
      );

      const y = Math.min(
        e.clientY,
        window.innerHeight - 400 // Assume max menu height is 400px
      );

      setContextMenu({
        x,
        y,
        file,
        isVisible: true,
        operations: availableOperations,
        theme: "dark",
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Use the error state
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      setError(null);
    }
  }, [error]);

  // Use closeContextMenu in click handler
  useEffect(() => {
    const handleClick = () => {
      closeContextMenu();
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [closeContextMenu]);

  // 优化文件夹导航处理
  const handleFolderNavigation = useCallback(
    (folderOrPath: FileSystemItem | string) => {
      if (typeof folderOrPath === "string") {
        // 如果是字符串路径，直接使用
        const pathSegments = folderOrPath.split("/").filter(Boolean);
        setCurrentPath(pathSegments);
      } else {
        // 如果是文件夹对象，组合路径
        const currentSegments = folderOrPath.path.split("/").filter(Boolean);
        const newPath = [...currentSegments, folderOrPath.name];
        setCurrentPath(newPath);
      }
    },
    [setCurrentPath]
  );

  const isFile = (item: FileSystemItem): item is File => {
    return !isFolder(item as File | FolderType);
  };

  // 修改文件操作处理以优化预览
  const handleFileOperation = useCallback(
    (operation: string, file: FileSystemItem) => {
      try {
        const validated = fileOperationSchema.parse({
          operation,
          file,
        });

        switch (validated.operation) {
          case "open":
            if (isFolder(file as File | FolderType)) {
              handleFolderNavigation(file);
            } else {
              // 非文件夹时也触发预览
              setPreviewFile(file as ExtendedFile);
            }
            break;
          case "preview":
            setPreviewFile(file as ExtendedFile);
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
          case "decrypt":
            if (isFile(file)) {
              setIsFileEncryptionOpen(true);
            }
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
      handleFolderNavigation,
    ]
  );

  const handleBatchOperation = useCallback(
    (operation: FileOperation) => {
      setIsBatchProcessing(true);
      setSelectedOperation(operation);

      // 处理所选文件
      selectedFiles.forEach((fileId) => {
        const file = files.find((f) => f.id === fileId);
        if (file) {
          handleFileOperation(operation, file);
        }
      });

      setIsBatchProcessing(false);
      setSelectedOperation(null);

      // 记录操作历史
      setLastActions((prev) => [...prev.slice(-9), operation]);
    },
    [selectedFiles, files, handleFileOperation]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // 优化拖动处理
  const handleDragStart = (event: DragEndEvent) => {
    setIsDragging(true);
    setDraggedItem(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setDraggedItem(null);

    if (!over) return;

    if (active.id !== over.id) {
      setSelectedFiles((items: string[]) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        // 添加动画过渡效果
        const newItems = arrayMove(items, oldIndex, newIndex);
        setTimeout(() => {
          // 触发重新渲染以展示动画
          setSelectedFiles([...newItems]);
        }, 0);

        return newItems;
      });

      // 处理文件系统更新
      const reorderedFiles = arrayMove(
        mockFileSystem.files,
        mockFileSystem.files.findIndex((f) => f.id === active.id),
        mockFileSystem.files.findIndex((f) => f.id === over.id)
      ) as (File | FolderType)[];

      mockFileSystem.files = reorderedFiles;
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

  // 修改 files 的 useMemo 逻辑，使用 store 中的数据
  const filteredFiles = useMemo(() => {
    let result = [...files, ...folders];

    if (result.length === 0) {
      // 当前目录为空时的处理
      return [];
    }

    if (searchTerm) {
      result = result.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (!customOptions.options.showHiddenFiles) {
      result = result.filter((file) => !file.name.startsWith("."));
    }

    // 修改文件类型过滤逻辑
    if (selectedFileTypes.length > 0) {
      result = result.filter((file) => {
        // 如果选中了文件夹类型
        if (selectedFileTypes.includes("folder")) {
          if (isFolder(file)) return true;
        }
        // 如果是文件且其类型在选中列表中
        if (!isFolder(file)) {
          return selectedFileTypes.includes((file as File).type);
        }
        return false;
      });
    }

    return result.sort((a, b) => {
      if (isFolder(a) && !isFolder(b)) return -1;
      if (!isFolder(a) && isFolder(b)) return 1;

      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "size") {
        const aSize = a.size ?? 0;
        const bSize = b.size ?? 0;
        return sortOrder === "asc" ? aSize - bSize : bSize - aSize;
      } else {
        const aTime = a.lastModified?.getTime() ?? 0;
        const bTime = b.lastModified?.getTime() ?? 0;
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      }
    });
  }, [
    files,
    folders,
    searchTerm,
    sortBy,
    sortOrder,
    customOptions.options.showHiddenFiles,
    selectedFileTypes, // 修改依赖
  ]);

  // 添加状态用于选中的文件或文件夹
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="h-screen flex flex-col overflow-hidden bg-gray-900 text-gray-100"
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Header
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
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
          onBatchOperation={handleBatchOperation}
          isBatchProcessing={isBatchProcessing}
          lastActions={lastActions}
        />

        {/* 添加快捷操作工具栏 */}
        <motion.div
          className="bg-gray-800 border-b border-gray-700 p-2"
          variants={dropAreaVariants}
          animate={isDragging ? "active" : "inactive"}
        >
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={() => setIsFileCompressionOpen(true)}
            >
              压缩
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsFileEncryptionOpen(true)}
            >
              加密
            </Button>
            <Button variant="ghost" onClick={() => setIsTagManagerOpen(true)}>
              标签
            </Button>
            {/* 更多快捷操作按钮 */}
          </div>
        </motion.div>

        <motion.div
          className="flex-1 overflow-auto"
          variants={listTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="container mx-auto p-4 space-y-4">
            {/* 添加类型图表 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div className="md:col-span-3" layout>
                <AnimatePresence mode="wait">
                  {filteredFiles.length === 0 ? (
                    <motion.div
                      className="flex flex-col items-center justify-center h-64 text-gray-500"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <FolderOpen className="w-16 h-16 mb-4" />
                      <p className="text-lg">此文件夹为空</p>
                    </motion.div>
                  ) : (
                    <SortableContext
                      items={filteredFiles.map((file) => file.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <motion.div
                        variants={dragItemVariants}
                        animate={isDragging ? "dragging" : ""}
                      >
                        <FileList
                          files={filteredFiles}
                          viewMode={viewMode}
                          customOptions={customOptions}
                          handleDelete={handleDelete}
                          handleContextMenu={handleContextMenu}
                          handleFileOperation={handleFileOperation}
                          selectedFiles={selectedFiles}
                          isDragging={isDragging}
                          draggedItem={draggedItem}
                        />
                      </motion.div>
                    </SortableContext>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="md:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <TypeChart
                  files={filteredFiles}
                  onTypeSelect={setSelectedFileTypes}
                  selectedTypes={selectedFileTypes}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Modals with enhanced animations */}
        <AnimatePresence>
          {contextMenu && contextMenu.isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <ContextMenu />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {previewFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FilePreview
                file={previewFile}
                onClose={() => setPreviewFile(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 添加所有对话框组件 */}
        <SettingsPanel
          isOpen={isSettingsPanelOpen}
          onClose={() => setIsSettingsPanelOpen(false)}
          options={customOptions.options}
          setOptions={(newOptions) =>
            setOptions({ ...customOptions, options: newOptions })
          }
        />

        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />

        <AdvancedSearch
          isOpen={isAdvancedSearchOpen}
          onClose={() => setIsAdvancedSearchOpen(false)}
        />

        <TrashBin isOpen={isTrashBinOpen} setIsOpen={setIsTrashBinOpen} />

        {selectedItem && (
          <>
            <VersionHistory
              isOpen={isVersionHistoryOpen}
              onClose={() => setIsVersionHistoryOpen(false)}
              file={selectedItem as File}
            />

            <TagManager
              isOpen={isTagManagerOpen}
              onClose={() => setIsTagManagerOpen(false)}
              selectedFiles={selectedFiles
                .map((id) => files.find((f) => f.id.toString() === id))
                .filter((f): f is File => f !== undefined)}
            />

            <FileCompression
              isOpen={isFileCompressionOpen}
              onClose={() => setIsFileCompressionOpen(false)}
              selectedFiles={selectedFiles
                .map((id) => files.find((f) => f.id.toString() === id))
                .filter((f): f is File => f !== undefined)}
            />

            <FileEncryption
              isOpen={isFileEncryptionOpen}
              onClose={() => setIsFileEncryptionOpen(false)}
              selectedFiles={selectedFiles
                .map((id) => files.find((f) => f.id.toString() === id))
                .filter((f): f is File => f !== undefined)}
            />

            <FileProperties
              item={selectedItem}
              isOpen={isPropertiesOpen}
              onClose={() => setIsPropertiesOpen(false)}
            />
          </>
        )}
      </motion.div>
    </DndContext>
  );
}
