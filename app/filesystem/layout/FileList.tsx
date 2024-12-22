"use client";

import React, { useMemo } from "react";
import { File, Folder as FolderType } from "@/types/filesystem";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { FileItem } from "../components/FileItem";

interface FileListProps {
  files: (File | FolderType)[];
  viewMode: "grid" | "list";
  customOptions: any;
  handleDelete: () => void;
  handleContextMenu: (e: React.MouseEvent, file: File | FolderType) => void;
  handleFileOperation: (operation: string, file: File) => void;
  selectedFiles: string[];
}

export const FileList: React.FC<FileListProps> = ({
  files,
  viewMode,
  customOptions,
  handleDelete,
  handleContextMenu,
  handleFileOperation,
  selectedFiles,
}) => {
  return (
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
                  draggableId={file.id.toString()}
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
  );
};

// 辅助函数
const isFolder = (item: File | FolderType): item is FolderType => {
  return (item as FolderType).files !== undefined;
};
