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
} from "lucide-react";
import { File, FileType, CustomizationOptions, FileOperation } from "./types";
import { format } from "date-fns";

interface FileItemProps {
  file: File;
  index: number;
  viewMode: "grid" | "list";
  isSelected?: boolean;
  onSelect: (file: File) => void;
  onDelete: (id: string) => void;
  customOptions: CustomizationOptions;
  onContextMenu: (e: React.MouseEvent, file: File) => void;
  onFileOperation: (operation: FileOperation, file: File) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  index,
  viewMode,
  isSelected = false,
  onSelect,
  onDelete,
  customOptions,
  onContextMenu,
  onFileOperation,
}) => {
  const getIconForFileType = (type: FileType) => {
    switch (type) {
      case "folder":
        return <Folder className="w-12 h-12" />;
      case "image":
        return <ImageIcon className="w-12 h-12" />;
      case "video":
        return <FolderVideo className="w-12 h-12" />;
      case "document":
        return <FileText className="w-12 h-12" />;
      case "audio":
        return <FileAudio className="w-12 h-12" />;
      case "archive":
        return <FileArchive className="w-12 h-12" />;
      default:
        return <FileIcon className="w-12 h-12" />;
    }
  };

  return (
    <Draggable draggableId={file.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            ${
              viewMode === "grid"
                ? "flex flex-col items-center space-y-2 p-4"
                : "flex items-center space-x-4 p-2 hover:bg-gray-800 rounded"
            }
            ${
              isSelected
                ? customOptions.theme === "dark"
                  ? "bg-blue-800"
                  : "bg-blue-200"
                : ""
            }
            ${snapshot.isDragging ? "opacity-50" : "opacity-100"}
            cursor-pointer transition-all duration-200
          `}
          onClick={() => onSelect(file)}
          onContextMenu={(e) => onContextMenu(e, file)}
        >
          <div
            className={`
            ${viewMode === "grid" ? "w-32 h-24" : "w-12 h-12"} 
            ${customOptions.theme === "dark" ? "bg-gray-700" : "bg-gray-300"} 
            rounded flex items-center justify-center
          `}
          >
            {getIconForFileType(file.type)}
          </div>
          <div
            className={`${
              viewMode === "grid" ? "text-center w-full" : "flex-1"
            }`}
          >
            <span className="text-sm font-medium">{file.name}</span>
            {viewMode === "list" && (
              <div className="text-xs text-gray-400">
                <div>{`Size: ${(file.size / 1024).toFixed(2)} KB`}</div>
                <div>{`Modified: ${format(
                  file.lastModified,
                  "yyyy-MM-dd HH:mm"
                )}`}</div>
                <div>{`Owner: ${file.owner}`}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
