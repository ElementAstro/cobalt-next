import React from "react";
import {
  ContextMenu as ContextMenuPrimitive,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FileItem } from "./FileItem";

interface ContextMenuProps {
  children: React.ReactNode;
  file: FileItem;
  onFileOperation: (
    operation: string,
    file: FileItem,
    content?: string
  ) => void;
}

export function ContextMenu({
  children,
  file,
  onFileOperation,
}: ContextMenuProps) {
  return (
    <ContextMenuPrimitive>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onFileOperation("rename", file)}>
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onFileOperation("delete", file)}>
          Delete
        </ContextMenuItem>
        {!file.isDirectory && (
          <ContextMenuItem onClick={() => onFileOperation("update", file)}>
            Edit
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenuPrimitive>
  );
}
