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
import { File, FileType, CustomizationOptions, FileOperation } from "@/types/filesystem";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useFileItemStore } from "@/lib/store/filesystem";

// Zustand 状态管理

interface FileItemProps {
  file: File;
  index: number;
  viewMode: "grid" | "list";
  customOptions: CustomizationOptions;
  onDelete: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, file: File) => void;
  onFileOperation: (operation: FileOperation, file: File) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  index,
  viewMode,
  customOptions,
  onDelete,
  onContextMenu,
  onFileOperation,
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

  return (
    <Draggable draggableId={file.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
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
            ${viewMode === "grid" ? "w-40" : "w-full"}
          `}
          onClick={handleSelect}
          onContextMenu={(e) => onContextMenu(e, file)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
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
          <motion.div
            className={`${
              viewMode === "grid" ? "text-center w-full" : "flex-1"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm font-medium">{file.name}</span>
            {viewMode === "list" && (
              <div className="text-xs text-gray-400">
                <div>{`大小: ${(file.size / 1024).toFixed(2)} KB`}</div>
                <div>{`修改时间: ${format(
                  file.lastModified,
                  "yyyy-MM-dd HH:mm"
                )}`}</div>
                <div>{`所有者: ${file.owner}`}</div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </Draggable>
  );
};
