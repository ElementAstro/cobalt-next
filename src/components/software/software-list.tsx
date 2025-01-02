import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Info,
  Download,
  Upload,
  RefreshCw,
  Check,
  Star,
  Settings,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import { useSoftwareStore } from "@/store/useSoftwareStore";
import { SoftwareState } from "@/store/useSoftwareStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "react-responsive";
import { Software } from "@/types/software";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.98,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export function SoftwareList() {
  const software = useSoftwareStore((state: SoftwareState) => state.software);
  const view = useSoftwareStore((state: SoftwareState) => state.view);
  const [sortedSoftware, setSortedSoftware] = useState<Software[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const sortSoftware = () => {
      let sorted = [...software];
      // 示例排序逻辑，可以根据需要调整
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      setSortedSoftware(sorted);
    };

    sortSoftware();
  }, [software, view]);

  const handleAction = (software: Software, action: string) => {
    switch (action) {
      case "install":
        // 处理安装逻辑
        break;
      case "uninstall":
        // 处理卸载逻辑
        break;
      case "update":
        // 处理更新逻辑
        break;
      case "favorite":
        // 处理收藏逻辑
        break;
      case "settings":
        setSelectedSoftware(software);
        setIsDialogOpen(true);
        break;
      case "share":
        // 处理分享逻辑
        break;
      case "delete":
        // 处理删除逻辑
        break;
      default:
        break;
    }
  };

  const getViewClass = () => {
    switch (view) {
      case "grid":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "detail":
        return "flex flex-col space-y-4";
      default:
        return "flex flex-col space-y-2";
    }
  };

  const getThemeClass = () => {
    return "dark:bg-gray-800";
  };

  return (
    <>
      <motion.div
        className={cn(
          `${getViewClass()} p-4 rounded-lg ${getThemeClass()} transition-all duration-300`,
          isMobile ? "space-y-4" : ""
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {sortedSoftware.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={variants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={cn(
                "relative group",
                "bg-gray-800/50 backdrop-blur-sm",
                "border border-gray-700",
                "rounded-xl p-4",
                "transition-colors duration-300",
                hoveredId === item.id && "bg-gray-700/70"
              )}
            >
              <div className="relative group">
                <motion.img
                  src={item.icon}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200" />
                {item.isInstalled && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between w-full">
                  <h3 className="font-semibold truncate text-white">
                    {item.name}
                  </h3>
                  {item.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex flex-col text-sm text-gray-400 mt-1">
                  <span>版本: {item.version}</span>
                  <span>作者: {item.author}</span>
                  {view !== "list" && (
                    <>
                      <span>日期: {item.date}</span>
                      <span>大小: {item.size} MB</span>
                    </>
                  )}
                </div>
                {item.isUpdating && (
                  <div className="mt-2">
                    <Progress value={50} className="h-2" />
                  </div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: hoveredId === item.id ? 1 : 0,
                  scale: hoveredId === item.id ? 1 : 0.9,
                }}
                className="absolute right-2 top-2 flex gap-2"
              >
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(item, "settings")}
                      className="dark:bg-gray-700 dark:text-white hover:bg-gray-600"
                      aria-label="设置"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>设置</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="dark:bg-gray-700 dark:text-white hover:bg-gray-600"
                      aria-label="更多操作"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="dark:bg-gray-700 dark:text-white"
                  >
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        handleAction(
                          item,
                          item.isInstalled ? "uninstall" : "install"
                        )
                      }
                    >
                      {item.isInstalled ? (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>卸载</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>安装</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    {item.hasUpdate && (
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleAction(item, "update")}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>更新</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleAction(item, "favorite")}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          item.isFavorite ? "text-yellow-400" : "text-gray-400"
                        }`}
                      />
                      <span>{item.isFavorite ? "取消收藏" : "收藏"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleAction(item, "share")}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>分享</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer text-red-500"
                      onClick={() => handleAction(item, "delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>删除</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 设置对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dark:bg-gray-800 p-6 rounded-lg">
          {selectedSoftware && (
            <>
              <DialogHeader>
                <DialogTitle>设置 - {selectedSoftware.name}</DialogTitle>
                <DialogDescription>
                  配置 {selectedSoftware.name} 的相关设置。
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>收藏此软件</span>
                  <Switch
                    checked={selectedSoftware.isFavorite}
                    onCheckedChange={() =>
                      handleAction(selectedSoftware, "favorite")
                    }
                    aria-label="收藏此软件"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span>自动更新</span>
                  <Switch
                    checked={selectedSoftware.autoUpdate}
                    onCheckedChange={() => {
                      // 处理自动更新切换逻辑
                    }}
                    aria-label="自动更新"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gray-400" />
                  <span>分享此软件</span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // 处理分享逻辑
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    分享
                  </Button>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="dark:bg-gray-700 dark:text-white"
                >
                  关闭
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
