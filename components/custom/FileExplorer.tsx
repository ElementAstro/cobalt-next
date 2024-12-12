"use client";

import * as React from "react";
import {
  ChevronRight,
  File,
  Folder,
  MoreHorizontal,
  Search,
  Edit2,
  Trash2,
  Copy,
  Plus,
  FilePlus,
  FolderPlus,
  Image,
  Paperclip,
  Code,
  Database,
} from "lucide-react"; // 添加更多图标
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface FileExplorerProps {
  data: (string | any[])[];
  theme?: "light" | "dark";
  showSearch?: boolean;
  onFileClick?: (file: string) => void;
  customIcons?: Record<string, React.ReactNode>;
}

export function FileExplorer({
  data,
  theme = "dark",
  showSearch = true,
  onFileClick,
  customIcons = {},
}: FileExplorerProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedFolders, setExpandedFolders] = React.useState<string[]>([]);
  const [fileStructure, setFileStructure] = React.useState(data);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState<"file" | "folder" | null>(
    null
  );
  const [newFileName, setNewFileName] = React.useState("");
  const [selectedDirectory, setSelectedDirectory] = React.useState(""); // 选择的目录
  const [filePreview, setFilePreview] = React.useState<{
    name: string;
    content: string;
  } | null>(null);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderPath)
        ? prev.filter((p) => p !== folderPath)
        : [...prev, folderPath]
    );
  };

  const handleRename = (file: string) => {
    setSelectedFile(file);
    setNewFileName(file.split("/").pop() || "");
    setIsRenaming(true);
  };

  const handleDelete = (file: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${file}?`
    );
    if (confirmed) {
      const updatedStructure = deleteFile(fileStructure, file);
      if (updatedStructure) {
        setFileStructure(updatedStructure);
        toast({
          title: "File deleted",
          description: `${file} has been deleted.`,
        });
      } else {
        toast({
          title: "Deletion Failed",
          description: `Could not delete ${file}.`,
        });
      }
    }
  };

  const handleCopyPath = (file: string) => {
    navigator.clipboard.writeText(file);
    toast({
      title: "Path copied",
      description: `Path "${file}" has been copied to clipboard.`,
    });
  };

  const confirmRename = () => {
    if (selectedFile && newFileName) {
      const updatedStructure = renameFile(
        fileStructure,
        selectedFile,
        newFileName
      );
      if (updatedStructure) {
        setFileStructure(updatedStructure);
        setIsRenaming(false);
        setSelectedFile(null);
        toast({
          title: "File renamed",
          description: `${selectedFile} has been renamed to ${newFileName}.`,
        });
      } else {
        toast({
          title: "Rename Failed",
          description: `Could not rename ${selectedFile}.`,
        });
      }
    }
  };

  const handleCreate = (type: "file" | "folder") => {
    setIsCreating(type);
    setNewFileName("");
  };

  const confirmCreate = () => {
    if (newFileName && isCreating) {
      const updatedStructure = createFileOrFolder(
        fileStructure,
        selectedDirectory,
        newFileName,
        isCreating
      );
      if (updatedStructure) {
        setFileStructure(updatedStructure);
        setIsCreating(null);
        toast({
          title: `${isCreating === "file" ? "File" : "Folder"} created`,
          description: `${newFileName} has been created.`,
        });
      } else {
        toast({
          title: "Creation Failed",
          description: `Could not create ${newFileName}.`,
        });
      }
    }
  };

  const bgColor = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const textColor = theme === "dark" ? "text-zinc-100" : "text-zinc-900";

  return (
    <div
      className={`w-full md:w-64 h-screen ${bgColor} ${textColor} p-2 overflow-auto`}
    >
      {showSearch && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      <div className="mb-4 flex space-x-2">
        <Button onClick={() => handleCreate("file")} size="sm">
          <FilePlus className="mr-2 h-4 w-4" />
          New File
        </Button>
        <Button onClick={() => handleCreate("folder")} size="sm">
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>
      <Tree
        items={fileStructure}
        level={0}
        searchTerm={searchTerm}
        expandedFolders={expandedFolders}
        toggleFolder={toggleFolder}
        theme={theme}
        onFileClick={onFileClick}
        customIcons={customIcons}
        onRename={handleRename}
        onDelete={handleDelete}
        onCopyPath={handleCopyPath}
        setFilePreview={setFilePreview}
        setSelectedDirectory={setSelectedDirectory} // 传递 setSelectedDirectory
      />
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for the file.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="mt-4"
          />
          <Button onClick={confirmRename} className="mt-4">
            Rename
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={!!isCreating} onOpenChange={() => setIsCreating(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create New {isCreating === "file" ? "File" : "Folder"}
            </DialogTitle>
            <DialogDescription>
              Enter a name for the new{" "}
              {isCreating === "file" ? "file" : "folder"}.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="mt-4"
          />
          <Button onClick={confirmCreate} className="mt-4">
            Create
          </Button>
        </DialogContent>
      </Dialog>
      {filePreview && (
        <Dialog open={!!filePreview} onOpenChange={() => setFilePreview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{filePreview.name}</DialogTitle>
            </DialogHeader>
            <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-96">
              {filePreview.content}
            </pre>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface TreeProps {
  items: (string | any[])[];
  level: number;
  searchTerm: string;
  expandedFolders: string[];
  toggleFolder: (folderPath: string) => void;
  theme: "light" | "dark";
  onFileClick?: (file: string) => void;
  customIcons: Record<string, React.ReactNode>;
  onRename: (file: string) => void;
  onDelete: (file: string) => void;
  onCopyPath: (file: string) => void;
  setFilePreview: (preview: { name: string; content: string } | null) => void;
  setSelectedDirectory: React.Dispatch<React.SetStateAction<string>>; // 添加 prop
  parentPath?: string;
}

function Tree({
  items,
  level,
  searchTerm,
  expandedFolders,
  toggleFolder,
  theme,
  onFileClick,
  customIcons,
  onRename,
  onDelete,
  onCopyPath,
  setFilePreview,
  setSelectedDirectory, // 接收 setSelectedDirectory
  parentPath = "",
}: TreeProps) {
  const textColor = theme === "dark" ? "text-zinc-300" : "text-zinc-700";
  const hoverBg = theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-100";

  return (
    <AnimatePresence>
      {items.map((item, index) => {
        const isArray = Array.isArray(item);
        const name = isArray ? item[0] : item;
        const children = isArray ? item.slice(1) : null;
        const fullPath = `${parentPath}/${name}`;

        if (!children) {
          if (
            searchTerm &&
            !name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return null;
          }
          return (
            <motion.div
              key={fullPath}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center gap-2 py-1 px-2 text-sm",
                textColor,
                hoverBg,
                "rounded cursor-pointer"
              )}
              style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
              onClick={() => {
                onFileClick && onFileClick(fullPath);
                setFilePreview({ name, content: `Content of ${name}` }); // 模拟内容
              }}
              draggable
              onDragStart={(e) => {
                (e as unknown as React.DragEvent).dataTransfer.setData(
                  "text/plain",
                  fullPath
                );
              }}
            >
              {getFileIcon(name, customIcons)}
              <span>{name}</span>
              <FileContextMenu
                theme={theme}
                onRename={() => onRename(fullPath)}
                onDelete={() => onDelete(fullPath)}
                onCopyPath={() => onCopyPath(fullPath)}
              />
            </motion.div>
          );
        }

        if (
          searchTerm &&
          !name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !children.some((child: string | any[]) =>
            (typeof child === "string" ? child : child[0])
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        ) {
          return null;
        }

        const isExpanded = expandedFolders.includes(fullPath);

        return (
          <Collapsible key={fullPath} open={isExpanded}>
            <CollapsibleTrigger
              className={cn(
                "flex items-center gap-2 py-1 px-2 text-sm w-full",
                hoverBg,
                "rounded group cursor-pointer"
              )}
              style={{ paddingLeft: `${level * 1.5}rem` }}
              onClick={() => {
                toggleFolder(fullPath);
                setSelectedDirectory(fullPath); // 更新 selectedDirectory
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", fullPath);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("bg-blue-200");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("bg-blue-200");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("bg-blue-200");
                const droppedPath = e.dataTransfer.getData("text/plain");
                if (droppedPath !== fullPath) {
                  // 实现移动逻辑
                  console.log(`Move ${droppedPath} to ${fullPath}`);
                  // 可在此处调用移动函数
                }
              }}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-zinc-400 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              />
              {customIcons[name] || (
                <Folder className="h-4 w-4 text-zinc-400" />
              )}
              <span>{name}</span>
              <FileContextMenu
                theme={theme}
                onRename={() => onRename(fullPath)}
                onDelete={() => onDelete(fullPath)}
                onCopyPath={() => onCopyPath(fullPath)}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Tree
                items={children}
                level={level + 1}
                searchTerm={searchTerm}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                theme={theme}
                onFileClick={onFileClick}
                customIcons={customIcons}
                onRename={onRename}
                onDelete={onDelete}
                onCopyPath={onCopyPath}
                setFilePreview={setFilePreview}
                setSelectedDirectory={setSelectedDirectory} // 传递下去
                parentPath={fullPath}
              />
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </AnimatePresence>
  );
}

interface FileContextMenuProps {
  theme: "light" | "dark";
  onRename: () => void;
  onDelete: () => void;
  onCopyPath: () => void;
}

function FileContextMenu({
  theme,
  onRename,
  onDelete,
  onCopyPath,
}: FileContextMenuProps) {
  const menuBg = theme === "dark" ? "bg-zinc-800" : "bg-white";
  const menuText = theme === "dark" ? "text-zinc-100" : "text-zinc-900";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${menuBg} ${menuText}`}>
        <DropdownMenuItem onClick={onRename}>
          <Edit2 className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyPath}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Path
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function deleteFile(
  structure: (string | any[])[],
  path: string
): (string | any[])[] | null {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return structure;

  const [current, ...rest] = parts;

  return structure
    .map((item) => {
      if (Array.isArray(item)) {
        const [name, children] = item;
        if (name === current) {
          if (rest.length === 0) {
            return null; // 删除整个文件夹
          }
          const updatedChildren = deleteFile(children, rest.join("/"));
          return updatedChildren ? [name, updatedChildren] : null;
        }
      } else {
        if (item === current && rest.length === 0) {
          return null; // 删除文件
        }
      }
      return item;
    })
    .filter(Boolean) as (string | any[])[];
}

function renameFile(
  structure: (string | any[])[],
  oldPath: string,
  newName: string
): (string | any[])[] | null {
  const parts = oldPath.split("/").filter(Boolean);
  if (parts.length === 0) return structure;

  const [current, ...rest] = parts;

  return structure.map((item) => {
    if (Array.isArray(item)) {
      const [name, children] = item;
      if (name === current) {
        if (rest.length === 0) {
          return [newName, children];
        }
        return [name, renameFile(children, rest.join("/"), newName)];
      }
    } else {
      if (item === current && rest.length === 0) {
        return newName;
      }
    }
    return item;
  });
}

function createFileOrFolder(
  structure: (string | any[])[],
  selectedDirectory: string,
  name: string,
  type: "file" | "folder"
): (string | any[])[] | null {
  const parts = selectedDirectory.split("/").filter(Boolean);

  function createInDirectory(
    items: (string | any[])[],
    remainingPath: string[]
  ): (string | any[])[] | null {
    if (remainingPath.length === 0) {
      // 检查是否已经存在同名文件或文件夹
      if (items.includes(name)) {
        toast({
          title: "Creation Failed",
          description: `${name} already exists.`,
        });
        return null;
      }
      if (items.some((item) => Array.isArray(item) && item[0] === name)) {
        toast({
          title: "Creation Failed",
          description: `${name} already exists.`,
        });
        return null;
      }
      if (type === "file") {
        return [...items, name];
      } else {
        return [...items, [name, []]];
      }
    }

    const [current, ...rest] = remainingPath;
    return items.map((item) => {
      if (Array.isArray(item) && item[0] === current) {
        return [item[0], createInDirectory(item[1], rest) || item[1]];
      }
      return item;
    });
  }

  return createInDirectory(structure, parts);
}

function getFileIcon(
  name: string,
  customIcons: Record<string, React.ReactNode>
) {
  if (customIcons[name]) {
    return customIcons[name];
  }

  const extension = name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
      return <File className="h-4 w-4 text-yellow-400" />;
    case "ts":
    case "tsx":
      return <File className="h-4 w-4 text-blue-400" />;
    case "css":
      return <File className="h-4 w-4 text-pink-400" />;
    case "json":
      return <File className="h-4 w-4 text-green-400" />;
    case "md":
      return <File className="h-4 w-4 text-gray-400" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <Image className="h-4 w-4 text-purple-400" />;
    case "pdf":
      return <Paperclip className="h-4 w-4 text-red-500" />;
    case "exe":
      return <Database className="h-4 w-4 text-orange-400" />;
    case "html":
    case "htm":
      return <Code className="h-4 w-4 text-indigo-400" />;
    // 添加更多文件类型
    default:
      return <File className="h-4 w-4 text-zinc-400" />;
  }
}
