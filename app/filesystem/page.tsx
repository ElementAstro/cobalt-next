"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Moon,
  Search,
  List,
  Grid,
  ArrowUpDown,
  FileIcon,
  Trash2,
  Eye,
  Download,
  Edit,
  Sun,
  Settings,
  Upload,
  RefreshCw,
  Share2,
  Clock,
  Tag,
  Lock,
  Cloud,
  Archive,
  Trash,
} from "lucide-react";
import { mockFileSystem } from "@/utils/mock-filesystem";
import {
  File,
  Folder as FolderType,
  CustomizationOptions,
} from "@/types/filesystem";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SettingsPanel } from "./components/SettingsPanel";
import { FileItem } from "./components/FileItem";
import { FilePreview } from "./components/FilePreview";
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
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [customOptions, setCustomOptions] = useState<CustomizationOptions>({
    theme: "dark",
    gridSize: "medium",
    showHiddenFiles: false,
    listView: "comfortable",
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
  });

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
      theme: prev.theme === "dark" ? "light" : "dark",
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
    // 这里只是示例，具体实现需要根据实际数据结构调整
    currentFolder.files = reorderedFiles as (File | FolderType)[];
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
          className={`${
            customOptions.theme === "dark" ? "bg-gray-800" : "bg-white"
          } p-4 flex items-center justify-between shadow-md`}
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setCurrentPath(currentPath.slice(0, -1))}
              variant="outline"
              size="sm"
              disabled={currentPath.length === 0}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                {currentPath.map((folder, index) => (
                  <React.Fragment key={folder}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() =>
                          setCurrentPath(currentPath.slice(0, index + 1))
                        }
                      >
                        {folder}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < currentPath.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-black"
                } rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <ScrollArea className="w-full max-w-md">
            <div className="flex space-x-2">
              <Button onClick={toggleTheme} variant="ghost" size="sm">
                {customOptions.theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={() => setIsSettingsPanelOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                variant="ghost"
                size="sm"
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5" />
                ) : (
                  <Grid className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={() => {
                  if (sortBy === "name") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("name");
                    setSortOrder("asc");
                  }
                }}
                variant="ghost"
                size="sm"
              >
                <ArrowUpDown className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Upload className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsSearchModalOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsShareModalOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsVersionHistoryOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Clock className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsTagManagerOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Tag className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsRealtimeCollaborationOpen(true)}
                variant="ghost"
                size="sm"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsFileCompressionOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Archive className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsCloudIntegrationOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Cloud className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsAdvancedSearchOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Lock className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsTrashBinOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Trash className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsFileEncryptionOpen(true)}
                variant="ghost"
                size="sm"
              >
                <Lock className="w-5 h-5" />
              </Button>
              {selectedFiles.length > 0 && (
                <Button onClick={handleDelete} variant="destructive" size="sm">
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          </ScrollArea>
        </motion.div>
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
          <AnimatePresence>
            <Droppable droppableId="file-list" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${
                    viewMode === "grid" ? "flex flex-wrap" : "flex flex-col"
                  }`}
                >
                  {files
                    .filter((file) => !isFolder(file))
                    .map((file, index) => (
                      <Draggable
                        key={file.id}
                        draggableId={file.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FileItem
                              file={file as File}
                              index={index}
                              viewMode={viewMode}
                              customOptions={customOptions}
                              onDelete={handleDelete}
                              onContextMenu={handleContextMenu}
                              onFileOperation={handleFileOperation}
                              isSelectionMode={selectedFiles.length > 0}
                              onShowMenu={(e) => handleContextMenu(e, file)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "fixed",
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 1000,
              }}
              className={`${
                customOptions.theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg`}
            >
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("preview", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Eye className="w-4 h-4 inline-block mr-2" />
                  Preview
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("download", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Download className="w-4 h-4 inline-block mr-2" />
                  Download
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("rename", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Edit className="w-4 h-4 inline-block mr-2" />
                  Rename
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("share", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Share2 className="w-4 h-4 inline-block mr-2" />
                  Share
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation(
                      "versionHistory",
                      contextMenu.file as File
                    );
                    closeContextMenu();
                  }}
                >
                  <Clock className="w-4 h-4 inline-block mr-2" />
                  Version History
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("manageTags", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Tag className="w-4 h-4 inline-block mr-2" />
                  Manage Tags
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("compress", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Archive className="w-4 h-4 inline-block mr-2" />
                  Compress/Decompress
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("encrypt", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Lock className="w-4 h-4 inline-block mr-2" />
                  Encrypt/Decrypt
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-500"
                  onClick={() => {
                    handleFileOperation("delete", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <Trash2 className="w-4 h-4 inline-block mr-2" />
                  Delete
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    handleFileOperation("properties", contextMenu.file as File);
                    closeContextMenu();
                  }}
                >
                  <FileIcon className="w-4 h-4 inline-block mr-2" />
                  Properties
                </li>
              </ul>
            </motion.div>
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
