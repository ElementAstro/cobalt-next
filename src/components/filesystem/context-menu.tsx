// FILE: context-menu.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileOperation } from "@/types/filesystem";
import {
  FileIcon,
  FolderIcon,
  Eye,
  Download,
  Edit,
  Trash2,
  Copy,
  Scissors,
  Clipboard,
  Share2,
  Info,
  Star,
  Archive,
  Lock,
  Unlock,
  RefreshCw,
  Plus,
  Minus,
  Search,
  Code,
  Compass,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuPortal,
} from "@/components/ui/context-menu";
import { useFilesystemStore } from "@/store/useFilesystemStore";

export const CustomContextMenu: React.FC = () => {
  const {
    isVisible,
    x,
    y,
    operations,
    theme,
    closeContextMenu,
    handleOperation,
  } = useFilesystemStore();

  const menuItems = [
    {
      operation: "open",
      icon: <FolderIcon className="w-4 h-4" />,
      label: "Open",
    },
    {
      operation: "preview",
      icon: <Eye className="w-4 h-4" />,
      label: "Preview",
    },
    {
      operation: "download",
      icon: <Download className="w-4 h-4" />,
      label: "Download",
    },
    {
      operation: "rename",
      icon: <Edit className="w-4 h-4" />,
      label: "Rename",
    },
    {
      operation: "delete",
      icon: <Trash2 className="w-4 h-4" />,
      label: "Delete",
    },
    { operation: "copy", icon: <Copy className="w-4 h-4" />, label: "Copy" },
    { operation: "cut", icon: <Scissors className="w-4 h-4" />, label: "Cut" },
    {
      operation: "paste",
      icon: <Clipboard className="w-4 h-4" />,
      label: "Paste",
    },
    {
      operation: "share",
      icon: <Share2 className="w-4 h-4" />,
      label: "Share",
    },
    {
      operation: "favorite",
      icon: <Star className="w-4 h-4" />,
      label: "Add to Favorites",
    },
    {
      operation: "compress",
      icon: <Archive className="w-4 h-4" />,
      label: "Compress",
    },
    {
      operation: "lock",
      icon: <Lock className="w-4 h-4" />,
      label: "Lock",
    },
    {
      operation: "unlock",
      icon: <Unlock className="w-4 h-4" />,
      label: "Unlock",
    },
    {
      operation: "refresh",
      icon: <RefreshCw className="w-4 h-4" />,
      label: "Refresh",
    },
    {
      operation: "new",
      icon: <Plus className="w-4 h-4" />,
      label: "New",
    },
    {
      operation: "remove",
      icon: <Minus className="w-4 h-4" />,
      label: "Remove",
    },
    {
      operation: "search",
      icon: <Search className="w-4 h-4" />,
      label: "Search",
    },
    {
      operation: "properties",
      icon: <Info className="w-4 h-4" />,
      label: "Properties",
    },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <ContextMenu>
        <ContextMenuTrigger>
          <div style={{ position: "absolute", top: y, left: x }} />
        </ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuContent
            className={`fixed z-50 ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            } rounded-lg shadow-lg`}
            style={{ top: y, left: x }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1],
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
            >
              <ContextMenuLabel className="px-4 py-2 font-semibold">
                Actions
              </ContextMenuLabel>
              <ContextMenuSeparator />
              <ul className="py-2">
                {menuItems
                  .filter((item) =>
                    operations.includes(item.operation as FileOperation)
                  )
                  .map((item) => (
                    <ContextMenuItem
                      key={item.operation}
                      className={`px-4 py-2 flex items-center space-x-2 cursor-pointer ${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        handleOperation(item.operation as FileOperation)
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </ContextMenuItem>
                  ))}
              </ul>
            </motion.div>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenu>
    </AnimatePresence>
  );
};
