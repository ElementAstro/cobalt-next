import React, { useCallback, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileOperation } from "@/types/filesystem";
import {
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

interface MenuPosition extends CSSProperties {
  position: 'fixed';
}

const menuItems = [
  {
    operation: "open",
    icon: <FolderIcon className="w-4 h-4" />,
    label: "打开",
    shortcut: "Enter"
  },
  {
    operation: "preview", 
    icon: <Eye className="w-4 h-4" />,
    label: "预览",
    shortcut: "Space"
  },
  {
    operation: "download",
    icon: <Download className="w-4 h-4" />,
    label: "下载",
    shortcut: "⌘D"
  },
  {
    operation: "copy",
    icon: <Copy className="w-4 h-4" />,
    label: "复制",
    shortcut: "⌘C" 
  },
  {
    operation: "cut",
    icon: <Scissors className="w-4 h-4" />,
    label: "剪切", 
    shortcut: "⌘X"
  },
  {
    operation: "paste",
    icon: <Clipboard className="w-4 h-4" />,
    label: "粘贴",
    shortcut: "⌘V"
  },
  {
    operation: "rename",
    icon: <Edit className="w-4 h-4" />,
    label: "重命名",
    shortcut: "F2"
  },
  {
    operation: "share",
    icon: <Share2 className="w-4 h-4" />,
    label: "分享",
    shortcut: "⌘S"
  },
  {
    operation: "favorite",
    icon: <Star className="w-4 h-4" />,
    label: "收藏",
    shortcut: "⌘B" 
  },
  {
    operation: "compress",
    icon: <Archive className="w-4 h-4" />,
    label: "压缩",
    shortcut: "⌘J"
  },
  {
    operation: "encrypt",
    icon: <Lock className="w-4 h-4" />,
    label: "加密",
    shortcut: "⌘L"
  },
  {
    operation: "delete",
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    label: "删除",
    shortcut: "Delete",
    className: "text-red-500 hover:bg-red-500/10"
  }
];

export const CustomContextMenu: React.FC = () => {
  const {
    isVisible,
    x,
    y,
    operations,
    theme,
    handleOperation,
  } = useFilesystemStore();

  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  const getMobileMenuPosition = (): MenuPosition => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '75vh',
  });

  const getDesktopMenuPosition = (x: number, y: number): MenuPosition => ({
    position: 'fixed',
    top: y,
    left: x,
  });

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            style={isMobile() ? getMobileMenuPosition() : getDesktopMenuPosition(x, y)} 
          />
        </ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuContent
            className={`
              fixed z-50 rounded-lg shadow-lg backdrop-blur-md
              ${theme === "dark" 
                ? "bg-gray-800/90 text-white border border-gray-700" 
                : "bg-white/90 text-black border border-gray-200"
              } 
              ${isMobile() && "w-full rounded-b-none"}
              divide-y divide-gray-700/50
            `}
            style={isMobile() ? getMobileMenuPosition() : getDesktopMenuPosition(x, y)}
          >
            <motion.div
              initial={isMobile() ? { y: 100 } : { opacity: 0, y: -10, scale: 0.95 }}
              animate={isMobile() ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile() ? { y: 100 } : { opacity: 0, y: 10, scale: 0.95 }}
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
              <div className="px-2 py-1.5 text-sm opacity-50 select-none">
                {operations.length} 个可用操作
              </div>

              <div className="py-1">
                {menuItems
                  .filter(item => operations.includes(item.operation as FileOperation))
                  .map((item, index) => (
                    <ContextMenuItem
                      key={item.operation}
                      className={`
                        group px-2 py-1.5 text-sm cursor-pointer flex items-center 
                        justify-between rounded-sm outline-none select-none
                        ${theme === "dark" 
                          ? "hover:bg-gray-700/50 focus:bg-gray-700/50" 
                          : "hover:bg-gray-100/50 focus:bg-gray-100/50"
                        }
                        ${item.className || ''}
                      `}
                      onClick={() => handleOperation(item.operation as FileOperation)}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      <kbd className="ml-auto text-xs text-gray-500">
                        {item.shortcut}
                      </kbd>
                    </ContextMenuItem>
                  ))}
              </div>

              {/* 额外操作组 */}
              <div className="py-1 border-t border-gray-700/50">
                <ContextMenuItem
                  className={`
                    px-2 py-1.5 text-sm cursor-pointer flex items-center gap-2
                    ${theme === "dark" 
                      ? "hover:bg-gray-700/50" 
                      : "hover:bg-gray-100/50"
                    }
                  `}
                  onClick={() => handleOperation('properties')}
                >
                  <Info className="w-4 h-4" />
                  <span>属性</span>
                  <kbd className="ml-auto text-xs text-gray-500">Alt+Enter</kbd>
                </ContextMenuItem>
              </div>
            </motion.div>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenu>
    </AnimatePresence>
  );
};
