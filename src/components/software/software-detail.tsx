import { X, Download, Share2, Heart, CheckCircle } from "lucide-react";
import { Software } from "@/types/software";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SoftwareDetailProps {
  software: Software | null;
  onClose: () => void;
  customLayout?: "compact" | "detailed" | "minimal";
}

export function SoftwareDetail({
  software,
  onClose,
  customLayout = "detailed",
}: SoftwareDetailProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();
    return () => window.removeEventListener("resize", handleOrientationChange);
  }, []);

  if (!software) return null;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleDownload = () => {
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleShare = () => {
    setShowShareOptions(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Show success feedback
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={!!software} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[700px] dark:bg-gray-800 p-6 rounded-lg shadow-lg ${
          isLandscape ? "w-full" : ""
        }`}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <motion.img
                    src={software.icon}
                    alt={software.name}
                    className="h-10 w-10 rounded-lg"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  {software.name}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleFavorite}
                        className="hover:bg-gray-700"
                      >
                        <motion.div
                          animate={{
                            scale: isFavorite ? [1, 1.2, 1] : 1,
                            transition: isFavorite
                              ? {
                                  duration: 0.5,
                                  ease: "easeInOut",
                                  times: [0, 0.5, 1],
                                }
                              : {},
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isFavorite
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400"
                            }`}
                            fill={isFavorite ? "currentColor" : "none"}
                          />
                          {isFavorite && (
                            <motion.span
                              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              1
                            </motion.span>
                          )}
                        </motion.div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>收藏</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="hover:bg-gray-700"
                      >
                        <Share2 className="h-5 w-5 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>分享</TooltipContent>
                  </Tooltip>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </Button>
                </div>
              </div>
              <DialogDescription className="text-gray-400">
                软件详细信息
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="details">详细信息</TabsTrigger>
                <TabsTrigger value="settings">设置</TabsTrigger>
                <TabsTrigger value="reviews">评价</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <motion.div
                  className="grid gap-6 py-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-6">
                    <motion.img
                      src={software.icon}
                      alt={software.name}
                      className="h-20 w-20 rounded-lg shadow-md"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div>
                      <p className="font-semibold text-white text-lg">
                        版本: {software.version}
                      </p>
                      <p className="text-sm text-gray-400">
                        作者: {software.author}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={handleDownload}
                        >
                          <Download className="h-4 w-4" />
                          下载
                        </Button>
                        {downloadProgress > 0 && downloadProgress < 100 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Progress
                              value={downloadProgress}
                              className="w-[120px] h-2 bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{
                                backgroundImage: `
                                  linear-gradient(
                                    -45deg,
                                    rgba(255,255,255,0.2) 25%,
                                    transparent 25%,
                                    transparent 50%,
                                    rgba(255,255,255,0.2) 50%,
                                    rgba(255,255,255,0.2) 75%,
                                    transparent 75%,
                                    transparent
                                  )`,
                                backgroundSize: "20px 20px",
                                animation: "progress-wave 1s linear infinite",
                              }}
                            />
                          </motion.div>
                        )}
                        {downloadProgress === 100 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm text-white">
                    <div className="space-y-2">
                      <p className="text-gray-400">安装日期：</p>
                      <p>{software.date}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">大小：</p>
                      <p>{software.size}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400">版本号：</p>
                      <p>{software.version}</p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="settings">
                <motion.div
                  className="space-y-6 py-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="advanced-settings"
                      checked={showAdvanced}
                      onCheckedChange={setShowAdvanced}
                    />
                    <Label htmlFor="advanced-settings">显示高级设置</Label>
                  </div>

                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="update-frequency">更新频率</Label>
                        <select
                          id="update-frequency"
                          className="bg-gray-700 text-white p-2 rounded w-full"
                        >
                          <option>自动</option>
                          <option>每日</option>
                          <option>每周</option>
                          <option>手动</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="log-level">日志级别</Label>
                        <select
                          id="log-level"
                          className="bg-gray-700 text-white p-2 rounded w-full"
                        >
                          <option>调试</option>
                          <option>信息</option>
                          <option>警告</option>
                          <option>错误</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="theme-selection">主题选择</Label>
                        <select
                          id="theme-selection"
                          className="bg-gray-700 text-white p-2 rounded w-full"
                        >
                          <option>暗色</option>
                          <option>亮色</option>
                          <option>系统默认</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                onClick={onClose}
                className="dark:bg-gray-700 dark:text-white flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                关闭
              </Button>
            </DialogFooter>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
