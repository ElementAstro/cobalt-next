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
  CustomizationOptions,
  FileOperation,
  CustomizationOptionsData,
} from "@/types/filesystem";
import { useFileItemStore } from "@/lib/store/filesystem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatFileSize } from "@/lib/utils";

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
  const isSelected = selectedFileId === file.id;

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
    setSelectedFileId(isSelected ? null : file.id);
  };

  const handleCheckedChange = (checked: boolean) => {
    setSelectedFileId(checked ? file.id : null);
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
      <div className="relative w-full pt-[100%] bg-gray-700 rounded">
        {getIconForFileType(file.type)}
      </div>
    );
  };

  return (
    <Draggable draggableId={file.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group relative
            ${viewMode === "grid" ? "flex flex-col" : "flex items-center"}
            ${isSelected ? "ring-2 ring-blue-500" : ""}
            ${snapshot.isDragging ? "opacity-50" : ""}
            rounded-lg overflow-hidden
            hover:bg-gray-700 transition-all duration-200
          `}
          onClick={handleSelect}
        >
          {isSelectionMode && (
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleCheckedChange}
              />
            </div>
          )}

          {viewMode === "grid" ? (
            renderThumbnail()
          ) : (
            <div className="flex-shrink-0 w-10 h-10">
              {getIconForFileType(file.type)}
            </div>
          )}

          <div
            className={`
            ${viewMode === "grid" ? "p-2" : "flex-1 ml-3"}
          `}
          >
            <div className="font-medium truncate">{file.name}</div>
            {viewMode === "list" && (
              <div className="text-sm text-gray-400">
                {formatFileSize(file.size)} •{" "}
                {format(file.lastModified, "yyyy-MM-dd HH:mm")}
              </div>
            )}
          </div>

          <div
            className={`
            absolute right-2 top-2
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          `}
          >
            {onShowMenu && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onShowMenu(e, file);
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
