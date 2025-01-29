"use client";

import React from "react";
import { format } from "date-fns";
import { File, Folder, FileSystemItem } from "@/types/filesystem";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, Folder as FolderIcon, File as FileIcon } from "lucide-react";

interface FilePropertiesProps {
  item: FileSystemItem;
  isOpen: boolean;
  onClose: () => void;
}

export const FileProperties: React.FC<FilePropertiesProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  // 判断是否为文件夹
  const isFolder = (item: FileSystemItem): item is Folder => {
    return 'files' in item;
  };

  function formatFileSize(size: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  }

  const renderProperties = () => {
    const commonProperties = [
      { label: "名称", value: item.name },
      { label: "位置", value: item.path },
      { label: "大小", value: formatFileSize(item.size) },
      { label: "创建时间", value: format(item.createdAt, "yyyy-MM-dd HH:mm:ss") },
      { label: "修改时间", value: format(item.lastModified, "yyyy-MM-dd HH:mm:ss") },
      { label: "所有者", value: item.owner },
      { label: "权限", value: item.permissions },
    ];

    if (isFolder(item)) {
      // 文件夹特有属性
      return [
        ...commonProperties,
        { label: "项目数量", value: item.itemCount?.toString() || "0" },
        { label: "类型", value: "文件夹" },
      ];
    } else {
      // 文件特有属性
      const file = item as File;
      return [
        ...commonProperties,
        { label: "类型", value: file.type },
        { label: "版本数", value: file.versions?.length.toString() || "1" },
        ...(file.language ? [{ label: "语言", value: file.language }] : []),
      ];
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-gray-900 text-gray-100 border-gray-800">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
              {isFolder(item) ? (
                <FolderIcon className="w-6 h-6 text-blue-500" />
              ) : (
                <FileIcon className="w-6 h-6 text-gray-400" />
              )}
              属性
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription className="text-gray-400">
            {isFolder(item) ? "文件夹" : "文件"}详细信息
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Table>
            <TableBody>
              {renderProperties().map((prop, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-gray-400 w-1/3">
                    {prop.label}
                  </TableCell>
                  <TableCell className="text-gray-100">
                    {prop.value || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
};
