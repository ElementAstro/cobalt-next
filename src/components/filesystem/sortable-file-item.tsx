"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { File } from "@/types/filesystem";
import { FileItem } from "./file-item";
import { toNumber } from "lodash";

interface SortableFileItemProps {
  id: string;
  file: File;
  viewMode: "grid" | "list";
  customOptions: any;
  onDelete: () => void;
  onContextMenu: (e: React.MouseEvent, file: File) => void;
  onFileOperation: (operation: string, file: File) => void;
  isSelectionMode: boolean;
  onShowMenu: (e: React.MouseEvent) => void;
  layoutMode: "compact" | "comfortable" | "spacious"; // 新增属性
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
  layoutMode, // 新增参数
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        ${viewMode === "grid" ? "h-full" : ""}
        ${
          layoutMode === "compact"
            ? "p-1"
            : layoutMode === "comfortable"
            ? "p-2"
            : "p-4"
        }
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
        onShowMenu={onShowMenu}
        index={toNumber(id)}
        layoutMode={layoutMode} // 传递到 FileItem
      />
    </div>
  );
};
