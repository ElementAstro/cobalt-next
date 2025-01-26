"use client";

import React from "react";
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
} from "@/types/filesystem";
import { useFilesystemStore } from "@/store/useFilesystemStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FileItemProps {
  file: File & {
    thumbnailUrl?: string;
    url?: string;
  };
  index?: number; // Made optional since it's unused
  viewMode: "grid" | "list";
  customOptions?: CustomizationOptionsData;
  onDelete?: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent, file: File) => void;
  onFileOperation?: (operation: FileOperation, file: File) => void;
  isSelectionMode?: boolean;
  onShowMenu?: (e: React.MouseEvent, file: File) => void;
  layoutMode: "compact" | "comfortable" | "spacious";
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
}) => {
  const {
    selectedFileId,
    setSelectedFileId,
    favorites,
    tags,
    addToFavorites,
    removeFromFavorites,
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

  const handleSelect = () => {
    setSelectedFileId(isSelected ? null : file.id.toString());
  };

  const handleCheckedChange = (checked: boolean) => {
    setSelectedFileId(checked ? file.id.toString() : null);
  };

  const renderThumbnail = () => {
    if (file.type === "image") {
      return (
        <div className="relative w-full pt-[100%]">
          <img
            src={file.thumbnailUrl || file.url}
            alt={file.name}
            className="absolute inset-0 w-full h-full object-cover rounded"
          />
        </div>
      );
    }
    return (
      <div className="relative w-full pt-[100%] bg-gray-700 rounded flex items-center justify-center">
        {getIconForFileType(file.type)}
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
        className={cn(
          "relative group",
          viewMode === "grid"
            ? cn(
                "bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors",
                layoutMode === "compact" ? "p-1" : 
                layoutMode === "comfortable" ? "p-2" : "p-4"
              )
            : cn(
                "flex items-center space-x-2 hover:bg-gray-700/30 rounded-md",
                layoutMode === "compact" ? "py-1" : 
                layoutMode === "comfortable" ? "py-2" : "py-4"
              )
        )}
        onClick={handleSelect}
      >
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckedChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        )}

        {/* 收藏按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 z-10",
            isFavorite ? "text-yellow-500" : "text-gray-400"
          )}
          onClick={toggleFavorite}
        >
          <Star className="h-4 w-4" />
        </Button>

        {/* 标签显示 */}
        {fileTags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
            {fileTags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs py-0 h-5">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 缩略图/图标 */}
        <div
          className={cn(
            "relative",
            viewMode === "grid" 
              ? layoutMode === "compact" ? "w-24 h-24" :
                layoutMode === "comfortable" ? "w-32 h-32" : "w-40 h-40"
              : layoutMode === "compact" ? "w-8 h-8" :
                layoutMode === "comfortable" ? "w-10 h-10" : "w-12 h-12"
          )}
        >
          {renderThumbnail()}
        </div>

        {/* 文件信息 */}
        <div className={cn(
          "flex-1 min-w-0",
          layoutMode === "compact" ? "text-xs" :
          layoutMode === "comfortable" ? "text-sm" : "text-base"
        )}>
          <p className="font-medium truncate text-sm">{file.name}</p>
          {viewMode === "list" && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground mt-1">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{format(file.lastModified, "yyyy-MM-dd HH:mm")}</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div
          className={cn(
            "md:absolute md:right-2",
            viewMode === "grid"
              ? "md:top-2 mt-2"
              : "md:top-1/2 md:-translate-y-1/2",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
        >
          {onShowMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onShowMenu(e, file);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </SortableContext>
  );
};
