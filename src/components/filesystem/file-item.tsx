"use client";

import React, { useRef, useState } from "react";
import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Folder,
  FolderIcon as FolderVideo,
  ImageIcon,
  FileIcon,
  FileText,
  FileAudio,
  FileArchive,
  MoreVertical,
  Star,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  File,
  FileType,
  FileOperation,
  CustomizationOptionsData,
  FileSystemItem,
} from "@/types/filesystem";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FileItemProps {
  file: FileSystemItem; // 更新为基础接口类型
  index?: number;
  viewMode: "grid" | "list";
  customOptions?: CustomizationOptionsData;
  onDelete?: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent, file: FileSystemItem) => void;
  onFileOperation?: (operation: FileOperation, file: FileSystemItem) => void;
  isSelectionMode?: boolean;
  onShowMenu?: (e: React.MouseEvent, file: FileSystemItem) => void;
  layoutMode: "compact" | "comfortable" | "spacious";
  isFolder?: boolean;
}

// Add type for tags store structure
interface TagsStore {
  [key: string]: string[];
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  viewMode,
  isSelectionMode = false,
  onShowMenu,
  layoutMode,
  isFolder = false,
  onFileOperation,
  onContextMenu,
}) => {
  const longPressTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [isLongPressed, setIsLongPressed] = useState(false);

  const handleTouchStart = (e: React.TouchEvent, file: FileSystemItem) => {
    longPressTimeoutRef.current = setTimeout(() => {
      setIsLongPressed(true);
      onContextMenu?.(
        {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          preventDefault: () => {},
        } as React.MouseEvent,
        file
      );
    }, 500); // 500ms 长按阈值
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
    setIsLongPressed(false);
  };

  const {
    selectedFileId,
    setSelectedFileId,
    favorites,
    tags,
    addToFavorites,
    removeFromFavorites,
    setCurrentPath,
    currentPath,
    selectedFiles,
    setSelectedFiles,
    isMultiSelectMode,
    
  } = useFilesystemStore();

  const isSelected = selectedFileId === file.id.toString();
  const isFavorite = favorites.includes(file.id.toString());

  // Fix the tags indexing with proper type casting
  const fileTags: string[] =
    (tags as unknown as TagsStore)[file.id.toString()] || [];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const getIconForFileType = (type: FileType) => {
    switch (type) {
      case "folder":
        return <Folder className="w-12 h-12 text-blue-500" />;
      case "image":
        return <ImageIcon className="w-12 h-12 text-green-500" />;
      case "video":
        return <FolderVideo className="w-12 h-12 text-red-500" />;
      case "document":
        return <FileText className="w-12 h-12 text-yellow-500" />;
      case "audio":
        return <FileAudio className="w-12 h-12 text-purple-500" />;
      case "archive":
        return <FileArchive className="w-12 h-12 text-indigo-500" />;
      default:
        return <FileIcon className="w-12 h-12 text-gray-500" />;
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    if (isMultiSelectMode) {
      e.stopPropagation();
      // 多选模式下，点击切换选中状态
      if (isSelected) {
        setSelectedFiles(selectedFiles.filter(id => id !== file.id.toString()));
      } else {
        setSelectedFiles([...selectedFiles, file.id.toString()]);
      }
    } else {
      // 非多选模式下，文件夹进入，文件预览
      if (isFolder) {
        e.stopPropagation();
        if (onFileOperation) {
          onFileOperation('open', file);
        }
      } else if (onFileOperation) {
        onFileOperation('preview', file);
      }
    }
  };

  const renderThumbnail = () => {
    if (isFolder) {
      return (
        <div className="relative w-full pt-[100%] bg-gray-700 rounded flex items-center justify-center">
          <Folder className="absolute inset-0 m-auto w-12 h-12 text-blue-500" />
        </div>
      );
    }
    
    // 类型断言确保安全访问
    const fileItem = file as File;
    if (fileItem.type === "image") {
      return (
        <div className="relative w-full pt-[100%]">
          <img
            src={fileItem.thumbnailUrl || fileItem.url}
            alt={fileItem.name}
            className="absolute inset-0 w-full h-full object-cover rounded"
          />
        </div>
      );
    }
    return (
      <div className="relative w-full pt-[100%] bg-gray-700 rounded flex items-center justify-center">
        {getIconForFileType(fileItem.type)}
      </div>
    );
  };

  function formatFileSize(size: number): string {
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    let i = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && i < units.length - 1) {
      formattedSize /= 1024;
      i++;
    }

    // Round to 2 decimal places
    return `${formattedSize.toFixed(2)} ${units[i]}`;
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(file.id.toString());
    } else {
      addToFavorites(file.id.toString());
    }
  };

  return (
    <SortableContext
      items={[file.id.toString()]}
      strategy={rectSortingStrategy}
    >
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        whileHover={{ scale: 1.02 }}
        onContextMenu={(e) => onContextMenu?.(e, file)}
        onTouchStart={(e) => handleTouchStart(e, file)}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (!isLongPressed) {
            handleItemClick(e);
          }
        }}
        className={cn(
          "relative group cursor-pointer",
          isFolder && "hover:bg-blue-500/10",
          viewMode === "grid"
            ? cn(
                "bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors flex flex-col",
                {
                  "p-2 gap-2": layoutMode === "compact",
                  "p-3 gap-3": layoutMode === "comfortable",
                  "p-4 gap-4": layoutMode === "spacious",
                }
              )
            : cn(
                "flex items-center gap-4 hover:bg-gray-700/30 rounded-md",
                {
                  "py-1 px-2": layoutMode === "compact",
                  "py-2 px-3": layoutMode === "comfortable",
                  "py-3 px-4": layoutMode === "spacious",
                }
              )
        )}
      >
        {/* Checkbox - 只在多选模式下显示 */}
        {isMultiSelectMode && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedFiles([...selectedFiles, file.id.toString()]);
                } else {
                  setSelectedFiles(selectedFiles.filter(id => id !== file.id.toString()));
                }
              }}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        )}

        {/* Thumbnail/Icon container */}
        <div
          className={cn(
            "relative overflow-hidden rounded-md",
            viewMode === "grid"
              ? {
                  "w-full aspect-square": true,
                  "mt-4": isSelectionMode,
                }
              : {
                  "w-10 h-10": layoutMode === "compact",
                  "w-12 h-12": layoutMode === "comfortable",
                  "w-14 h-14": layoutMode === "spacious",
                }
          )}
        >
          {renderThumbnail()}
        </div>

        {/* File info */}
        <div
          className={cn(
            "min-w-0",
            viewMode === "grid" ? "text-center" : "flex-1",
            {
              "text-xs": layoutMode === "compact",
              "text-sm": layoutMode === "comfortable",
              "text-base": layoutMode === "spacious",
            }
          )}
        >
          <p className="font-medium truncate">{file.name}</p>
          {viewMode === "list" && (
            <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
              <span className="text-xs">{formatFileSize(file.size)}</span>
              <span className="text-xs">•</span>
              <span className="text-xs">
                {format(file.lastModified, "yyyy-MM-dd HH:mm")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className={cn(
            "absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            viewMode === "grid" ? "top-2" : "top-1/2 -translate-y-1/2"
          )}
        >
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7",
              isFavorite ? "text-yellow-500" : "text-gray-400"
            )}
            onClick={toggleFavorite}
          >
            <Star className="h-4 w-4" />
          </Button>

          {/* Menu button */}
          {onShowMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                onShowMenu(e, file);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tags */}
        {fileTags.length > 0 && (
          <div
            className={cn(
              "flex gap-1 flex-wrap",
              viewMode === "grid"
                ? "absolute bottom-2 left-2 right-2"
                : "mt-1"
            )}
          >
            {fileTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs py-0 px-1.5 h-5"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Folder info */}
        {isFolder && (
          <div className="text-xs text-gray-400 mt-1">
            {file.itemCount || 0} 个项目
          </div>
        )}
      </motion.div>
    </SortableContext>
  );
};
