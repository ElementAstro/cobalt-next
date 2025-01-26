"use client";

import React from "react";
import { File, Folder as FolderType } from "@/types/filesystem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  const [layoutMode, setLayoutMode] = React.useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [groupBy, setGroupBy] = React.useState<"none" | "type" | "date">("none");

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

  const groupFiles = (files: File[]) => {
    if (groupBy === "none") return { "": files };

    return files.reduce((groups, file) => {
      let key = "";
      if (groupBy === "type") {
        key = file.type;
      } else if (groupBy === "date") {
        key = format(file.createdAt, "yyyy-MM-dd");
      }
      return {
        ...groups,
        [key]: [...(groups[key] || []), file],
      };
    }, {} as Record<string, File[]>);
  };

  const groupedFiles = groupFiles(files.filter((file) => !isFolder(file)) as File[]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-4 flex justify-between items-center">
        <Select
          value={layoutMode}
          onValueChange={(value) => setLayoutMode(value as typeof layoutMode)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择布局" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">紧凑</SelectItem>
            <SelectItem value="comfortable">舒适</SelectItem>
            <SelectItem value="spacious">宽敞</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as typeof groupBy)}
        >
          <SelectTrigger>
            <SelectValue placeholder="分组方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">不分组</SelectItem>
            <SelectItem value="type">按类型</SelectItem>
            <SelectItem value="date">按日期</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.entries(groupedFiles).map(([group, files]) => (
        <div key={group}>
          {group && (
            <h3 className="text-lg font-semibold mb-2 text-gray-400">
              {group}
            </h3>
          )}
          <SortableContext
            items={files.map((file) => file.id)}
            strategy={
              viewMode === "grid"
                ? horizontalListSortingStrategy
                : verticalListSortingStrategy
            }
          >
            <div
              className={cn(
                viewMode === "grid" ? "grid gap-4" : "flex flex-col space-y-2",
                {
                  "grid-cols-6": layoutMode === "compact" && viewMode === "grid",
                  "grid-cols-4": layoutMode === "comfortable" && viewMode === "grid",
                  "grid-cols-3": layoutMode === "spacious" && viewMode === "grid",
                }
              )}
            >
              {files.map((file) => (
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
                  layoutMode={layoutMode}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      ))}
    </DndContext>
  );
};

// 辅助函数
const isFolder = (item: File | FolderType): item is FolderType => {
  return (item as FolderType).files !== undefined;
};
