"use client";

import React from "react";
import { File, Folder as FolderType } from "@/types/filesystem";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableFileItem } from "./sortable-file-item";
import { useFilesystemStore } from "@/store/useFilesystemStore";

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
  const setFiles = useFilesystemStore((state) => state.setFiles);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((file) => file.id === active.id);
      const newIndex = files.findIndex((file) => file.id === over?.id);

      const newFiles = arrayMove(files, oldIndex, newIndex);
      setFiles(newFiles.filter((file) => !isFolder(file)) as File[]);
    }
  };

  const sortableFiles = files.filter((file) => !isFolder(file));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortableFiles.map((file) => file.id)}
        strategy={
          viewMode === "grid"
            ? horizontalListSortingStrategy
            : verticalListSortingStrategy
        }
      >
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-4 gap-4"
              : "flex flex-col space-y-2"
          }`}
        >
          {sortableFiles.map((file, index) => (
            <SortableFileItem
              key={file.id}
              id={file.id.toString()}
              file={file as File}
              viewMode={viewMode}
              customOptions={customOptions}
              onDelete={handleDelete}
              onContextMenu={handleContextMenu}
              onFileOperation={handleFileOperation}
              isSelectionMode={selectedFiles.length > 0}
              onShowMenu={(e) => handleContextMenu(e, file)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

// 辅助函数
const isFolder = (item: File | FolderType): item is FolderType => {
  return (item as FolderType).files !== undefined;
};
