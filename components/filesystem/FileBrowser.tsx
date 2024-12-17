"use client";

import {
  ArrowLeft,
  Battery,
  Bluetooth,
  Camera,
  BarChartIcon as ChartBar,
  Cog,
  Folder,
  FolderIcon as FolderVideo,
  ImageIcon,
  Moon,
  Signal,
  Timer,
  Wifi,
  Search,
  List,
  Grid,
  ArrowUpDown,
  FileIcon,
  Trash2,
  MoreVertical,
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
import { useState, useMemo, useCallback, useEffect } from "react";
import { mockFileSystem } from "@/utils/mock-filesystem";
import {
  File,
  Folder as FolderType,
  FileType,
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
import { SettingsPanel } from "./SettingsPanel";
import { FileItem } from "./FileItem";
import { FilePreview } from "./FilePreview";
import { FileUpload } from "./FileUpload";
import { SearchModal } from "./SearchModal";
import { ShareModal } from "./ShareModal";
import { VersionHistory } from "./VersionHistory";
import { TagManager } from "./TagManager";
import { RealtimeCollaboration } from "./RealtimeCollaboration";
import { FileCompression } from "./FileCompression";
import { CloudIntegration } from "./CloudIntegration";
import { AdvancedSearch } from "./AdvancedSearch";
import { TrashBin } from "./TrashBin";
import { FileEncryption } from "./FileEncryption";
import { FileProperties } from "./FileProperties";
import React from "react";
import { useDropzone } from "react-dropzone";

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Dropped files:", acceptedFiles);
    // TODO: 处理文件上传
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
      <div {...getRootProps()} className="h-screen flex flex-col md:flex-row">
        <AnimatePresence>
          {(!isMobile || orientation === "landscape") && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${isMobile ? "w-16" : "w-64"} ${
                customOptions.theme === "dark" ? "bg-gray-800" : "bg-white"
              } flex flex-col items-center py-4 space-y-6 shadow-lg`}
            >
              <div className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                <ChartBar className="w-6 h-6" />
              </div>
              <div className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                <Camera className="w-6 h-6" />
              </div>
              <div className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                <Timer className="w-6 h-6" />
              </div>
              <div className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                <ChartBar className="w-6 h-6 rotate-90" />
              </div>
              <div className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                <ChartBar className="w-6 h-6" />
              </div>
              <div className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition duration-200">
                <Folder className="w-6 h-6" />
              </div>
              <div className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                <Cog className="w-6 h-6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`h-12 ${
              customOptions.theme === "dark" ? "bg-gray-800" : "bg-white"
            } flex items-center justify-between px-4 text-sm shadow-md`}
          >
            <div className="flex items-center space-x-2">
              <span>{time}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-lg">File Browser</span>
            </div>
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Bluetooth className="w-4 h-4" />
              <Moon className="w-4 h-4" />
              <Battery className="w-4 h-4" />
              <span>26%</span>
            </div>
          </motion.div>

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
              <button
                onClick={() => setCurrentPath(currentPath.slice(0, -1))}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
                disabled={currentPath.length === 0}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
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
                      {index < currentPath.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
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
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                {customOptions.theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsSettingsPanelOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                {viewMode === "grid" ? (
                  <List className="w-5 h-5" />
                ) : (
                  <Grid className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => {
                  if (sortBy === "name") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("name");
                    setSortOrder("asc");
                  }
                }}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } rounded-full transition duration-200`}
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsVersionHistoryOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Clock className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsTagManagerOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Tag className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsRealtimeCollaborationOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFileCompressionOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Archive className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCloudIntegrationOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Cloud className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAdvancedSearchOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Lock className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsTrashBinOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Trash className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFileEncryptionOpen(true)}
                className={`p-2 ${
                  customOptions.theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded-full transition duration-200`}
              >
                <Lock className="w-5 h-5" />
              </button>
              {selectedFiles.length > 0 && (
                <button
                  onClick={handleDelete}
                  className={`p-2 ${
                    customOptions.theme === "dark"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-full transition duration-200`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
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
                                viewMode={viewMode}
                                isSelected={selectedFiles.includes(file.id)}
                                onSelect={handleFileClick}
                                onDelete={handleDelete}
                                customOptions={customOptions}
                                onContextMenu={handleContextMenu}
                                onFileOperation={handleFileOperation}
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
                      handleFileOperation(
                        "manageTags",
                        contextMenu.file as File
                      );
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
                      handleFileOperation(
                        "properties",
                        contextMenu.file as File
                      );
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
        <FileUpload
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
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
      </div>
    </DragDropContext>
  );
}
