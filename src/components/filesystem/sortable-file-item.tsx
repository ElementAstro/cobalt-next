"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { File, Folder as FolderType, FileSystemItem } from "@/types/filesystem";
import { FileItem } from "./file-item";
import { toNumber } from "lodash";
import { motion } from "framer-motion";

interface SortableFileItemProps {
  id: string;
  file: FileSystemItem; // 更新为基础接口类型
  viewMode: "grid" | "list";
  customOptions: any;
  onDelete: () => void;
  onContextMenu: (e: React.MouseEvent, file: FileSystemItem) => void;
  onFileOperation: (operation: string, file: FileSystemItem) => void;
  isSelectionMode: boolean;
  onShowMenu: (e: React.MouseEvent) => void;
  layoutMode: "compact" | "comfortable" | "spacious";
  isFolder?: boolean; // 新增属性
  isDragging: boolean;
  dragVariants: any;
}

export const SortableFileItem: React.FC<SortableFileItemProps> = ({
  id,
  file,
  viewMode,
  customOptions,
  onDelete,
  onContextMenu,
  onFileOperation,
  isSelectionMode,
  onShowMenu,
  layoutMode,
  isFolder = false, // 设置默认值
  isDragging,
  dragVariants,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id,
    // 禁用文件夹拖拽，因为可能会引起路径问题
    disabled: isFolder 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...(isFolder ? {} : { ...attributes, ...listeners })}
      variants={dragVariants}
      animate={isDragging ? "dragging" : "normal"}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layoutId={id}
      className={`
        ${viewMode === "grid" ? "h-full" : ""}
        ${
          layoutMode === "compact"
            ? "p-1"
            : layoutMode === "comfortable"
            ? "p-2"
            : "p-4"
        }
        ${isFolder ? "cursor-pointer" : ""}
      `}
    >
      <FileItem
        file={file}
        viewMode={viewMode}
        customOptions={customOptions}
        onDelete={onDelete}
        onContextMenu={onContextMenu}
        onFileOperation={onFileOperation}
        isSelectionMode={isSelectionMode}
        onShowMenu={(e) => onShowMenu(e)}
        index={toNumber(id)}
        layoutMode={layoutMode}
        isFolder={isFolder}
      />
    </motion.div>
  );
};
