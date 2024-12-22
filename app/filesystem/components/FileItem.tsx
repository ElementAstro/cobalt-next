"use client";

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Folder,
  FolderIcon as FolderVideo,
  ImageIcon,
  FileIcon,
  FileText,
  FileAudio,
  FileArchive,
  MoreVertical,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  File,
  FileType,
  FileOperation,
  CustomizationOptionsData,
} from "@/types/filesystem";
import { useFileItemStore } from "@/lib/store/filesystem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatFileSize } from "@/lib/utils";

interface FileItemProps {
  file: File & {
    thumbnailUrl?: string;
    url?: string;
  };
  index: number;
  viewMode: "grid" | "list";
  customOptions?: CustomizationOptionsData;
  onDelete?: (id: string) => void;
  onContextMenu?: (e: React.MouseEvent, file: File) => void;
  onFileOperation?: (operation: FileOperation, file: File) => void;
  isSelectionMode?: boolean;
  onShowMenu?: (e: React.MouseEvent, file: File) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  index,
  viewMode,
  isSelectionMode = false,
  onShowMenu,
}) => {
  const { selectedFileId, setSelectedFileId } = useFileItemStore();
  const isSelected = selectedFileId === file.id.toString();

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

  return (
    <Draggable draggableId={file.id.toString()} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...(provided.draggableProps as any)}
          {...(provided.dragHandleProps as any)}
          whileHover={{ scale: 1.02 }}
          className={`relative group ${
            viewMode === "grid"
              ? "bg-gray-800/50 rounded-lg p-2 hover:bg-gray-700/50 transition-colors"
              : "flex items-center space-x-2 p-1 hover:bg-gray-700/30 rounded-md"
          }`}
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

          {/* Thumbnail/Icon */}
          <div
            className={cn(
              "relative",
              viewMode === "grid" ? "w-full" : "w-10 h-10"
            )}
          >
            {renderThumbnail()}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <p className="font-medium truncate text-sm">{file.name}</p>
            {viewMode === "list" && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-muted-foreground mt-1">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span>{format(file.lastModified, "yyyy-MM-dd HH:mm")}</span>
              </div>
            )}
          </div>

          {/* Actions */}
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
      )}
    </Draggable>
  );
};
