"use client";

import React from "react";
import { File, Folder as FolderType, FileSystemItem } from "@/types/filesystem";
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
import { motion, AnimatePresence } from "framer-motion";

interface FileListProps {
  files: FileSystemItem[];
  viewMode: "grid" | "list";
  customOptions: any;
  handleDelete: () => void;
  handleContextMenu: (e: React.MouseEvent, file: FileSystemItem) => void;
  handleFileOperation: (operation: string, file: FileSystemItem) => void;
  selectedFiles: string[];
  isDragging: boolean;
  draggedItem: string | null;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  viewMode,
  customOptions,
  handleDelete,
  handleContextMenu,
  handleFileOperation,
  selectedFiles,
  isDragging,
  draggedItem
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

  // 添加拖拽动画变体
  const dragItemVariants = {
    dragging: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
      cursor: "grabbing",
      zIndex: 50
    },
    normal: {
      scale: 1,
      boxShadow: "none",
      cursor: "grab",
      zIndex: 1
    }
  };

  // 添加放置区域动画变体
  const dropAreaVariants = {
    active: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgb(59, 130, 246)",
      transition: { duration: 0.2 }
    },
    inactive: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      transition: { duration: 0.2 }
    }
  };

  // 修改拖拽处理函数以支持动画
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((file) => file.id === active.id);
      const newIndex = files.findIndex((file) => file.id === over?.id);

      const newFiles = arrayMove(files, oldIndex, newIndex);
      
      // 添加重新排序动画
      const animateReorder = async () => {
        await setFiles(newFiles.filter((file) => !isFolder(file)) as File[]);
      };
      
      animateReorder();
    }
  };

  const groupFiles = (files: FileSystemItem[]) => {
    if (groupBy === "none") return { "": files };

    return files.reduce((groups, file) => {
      let key = "";
      if (groupBy === "type") {
        key = isFolder(file) ? "folder" : (file as File).type;
      } else if (groupBy === "date") {
        key = format(file.createdAt, "yyyy-MM-dd");
      }
      return {
        ...groups,
        [key]: [...(groups[key] || []), file],
      };
    }, {} as Record<string, FileSystemItem[]>);
  };

  const processFiles = (files: FileSystemItem[]) => {
    // 分离文件夹和普通文件
    const folders = files.filter(isFolder);
    const regularFiles = files.filter((f) => !isFolder(f));

    // 如果未分组，将文件夹放在前面
    if (groupBy === "none") {
      return { "": [...folders, ...regularFiles] };
    }

    // 按组显示，保持文件夹在最前
    const groups = regularFiles.reduce((acc, file) => {
      let key = "";
      if (groupBy === "type") {
        key = (file as File).type;
      } else if (groupBy === "date") {
        key = format(file.createdAt, "yyyy-MM-dd");
      }
      return {
        ...acc,
        [key]: [...(acc[key] || []), file],
      };
    }, {} as Record<string, FileSystemItem[]>);

    // 确保文件夹始终显示在第一个分组
    if (folders.length > 0) {
      return {
        "文件夹": folders,
        ...groups,
      };
    }

    return groups;
  };

  const processedFiles = processFiles(files);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <motion.div 
        className="flex flex-col gap-4"
        variants={dropAreaVariants}
        animate={isDragging ? "active" : "inactive"}
      >
        <div className="flex justify-between items-center">
          <Select
            value={layoutMode}
            onValueChange={(value) => setLayoutMode(value as typeof layoutMode)}
          >
            <SelectTrigger className="w-[120px]">
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
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="分组方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">不分组</SelectItem>
              <SelectItem value="type">按类型</SelectItem>
              <SelectItem value="date">按日期</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {Object.entries(processedFiles).map(([group, items]) => (
            <motion.div 
              key={group} 
              className="space-y-2"
              layout
            >
              <motion.h3 
                className="text-lg font-semibold mb-4 text-gray-400 px-2"
                layout
              >
                {group}
              </motion.h3>
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={
                  viewMode === "grid"
                    ? horizontalListSortingStrategy
                    : verticalListSortingStrategy
                }
              >
                <motion.div
                  className={cn(
                    "grid gap-4",
                    viewMode === "grid"
                      ? {
                          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6":
                            layoutMode === "spacious",
                          "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8":
                            layoutMode === "comfortable",
                          "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12":
                            layoutMode === "compact",
                        }
                      : "grid-cols-1"
                  )}
                  layout
                >
                  <AnimatePresence>
                    {items.map((item) => (
                      <SortableFileItem
                        key={item.id}
                        id={item.id.toString()}
                        file={item}
                        viewMode={viewMode}
                        customOptions={customOptions}
                        onDelete={handleDelete}
                        onContextMenu={handleContextMenu}
                        onFileOperation={handleFileOperation}
                        isSelectionMode={selectedFiles.length > 0}
                        onShowMenu={(e) => handleContextMenu(e, item)}
                        layoutMode={layoutMode}
                        isFolder={isFolder(item)}
                        isDragging={isDragging && draggedItem === item.id.toString()}
                        dragVariants={dragItemVariants}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DndContext>
  );
};

// 辅助函数
const isFolder = (item: FileSystemItem): item is FolderType => {
  return 'files' in item;
};
