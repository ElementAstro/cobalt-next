"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  ChevronDown,
  FileDown,
  RefreshCw,
  Moon,
  Sun,
  Settings,
  HardDrive,
  Wifi,
  Power,
  Activity,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { WifiList } from "@/components/setting/wifi-list";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showVersionDetails, setShowVersionDetails] = useState(false);
  const [cameraStates, setCameraStates] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [cameraResolutions, setCameraResolutions] = useState([
    "1080p",
    "1080p",
    "1080p",
    "1080p",
  ]);
  const [defaultStorage, setDefaultStorage] = useState("internal");
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 100 });
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("camera");
  const { toast } = useToast();

  const tabs = [
    {
      value: "camera",
      label: "相机设置",
      icon: <Camera className="h-4 w-4" />,
    },
    {
      value: "storage",
      label: "存储设置",
      icon: <HardDrive className="h-4 w-4" />,
    },
    { value: "network", label: "网络设置", icon: <Wifi className="h-4 w-4" /> },
    {
      value: "system",
      label: "系统管理",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    // Simulate fetching storage usage
    setStorageUsage({ used: 75, total: 128 });
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd update the class on the root element here
  };

  const toggleCamera = (index: number) => {
    const newStates = [...cameraStates];
    newStates[index] = !newStates[index];
    setCameraStates(newStates);
    toast({
      title: `相机 ${index + 1} ${newStates[index] ? "已启用" : "已禁用"}`,
      description: "设置已更新",
    });
  };

  const handleCameraResolutionChange = (index: number, resolution: string) => {
    const newResolutions = [...cameraResolutions];
    newResolutions[index] = resolution;
    setCameraResolutions(newResolutions);
    toast({
      title: `相机 ${index + 1} 分辨率已更改`,
      description: `新的分辨率设置为: ${resolution}`,
    });
  };

  const handleStorageChange = (value: string) => {
    setDefaultStorage(value);
    toast({
      title: "默认存储已更改",
      description: `新的默认存储设置为: ${
        value === "internal" ? "内置存储" : "SD卡"
      }`,
    });
  };

  const handleNetworkReset = () => {
    // Simulating network reset
    toast({
      title: "网络设置已重置",
      description: "请重新配置您的网络连接",
    });
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    // Simulating update process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsUpdating(false);
    toast({
      title: "更新完成",
      description: "您的 AstroStation 已更新到最新版本",
    });
  };

  const handleRestart = () => {
    toast({
      title: "重启中",
      description: "AstroStation 正在重新启动，请稍候...",
    });
  };

  const handleShutdown = () => {
    toast({
      title: "关机中",
      description: "AstroStation 正在安全关闭，请稍候...",
    });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`border-b ${
          isDarkMode
            ? "border-gray-800 bg-gray-800"
            : "border-gray-200 bg-white"
        } p-4 flex justify-between items-center`}
      >
        <h1 className="text-xl font-semibold">AstroStation 设置</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <AnimatePresence mode="wait">
            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {activeTab === "camera" && (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">相机设置</h2>
                        <div className="grid grid-cols-1 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center">
                                  <Camera className="h-4 w-4 mr-2" />
                                  相机 {i}
                                </span>
                                <Switch
                                  checked={cameraStates[i - 1]}
                                  onCheckedChange={() => toggleCamera(i - 1)}
                                />
                              </div>
                              <Select
                                disabled={!cameraStates[i - 1]}
                                value={cameraResolutions[i - 1]}
                                onValueChange={(value) =>
                                  handleCameraResolutionChange(i - 1, value)
                                }
                              >
                                <SelectTrigger
                                  className={`w-full ${
                                    isDarkMode
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-gray-100 border-gray-300"
                                  }`}
                                >
                                  <SelectValue placeholder="选择分辨率" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="720p">720p</SelectItem>
                                  <SelectItem value="1080p">1080p</SelectItem>
                                  <SelectItem value="4K">4K</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select disabled={!cameraStates[i - 1]}>
                                <SelectTrigger
                                  className={`w-full ${
                                    isDarkMode
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-gray-100 border-gray-300"
                                  }`}
                                >
                                  <SelectValue placeholder="选择模式" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="photo">
                                    拍照模式
                                  </SelectItem>
                                  <SelectItem value="video">
                                    视频模式
                                  </SelectItem>
                                  <SelectItem value="timelapse">
                                    延时摄影
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
                {activeTab === "storage" && (
                  <motion.div
                    key="storage"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">存储设置</h2>
                        <div className="space-y-4">
                          <div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } mb-2`}
                            >
                              默认存储
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                className={`flex-1 ${
                                  defaultStorage === "internal"
                                    ? isDarkMode
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : "bg-blue-500 hover:bg-blue-600"
                                    : isDarkMode
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                                onClick={() => handleStorageChange("internal")}
                              >
                                内置存储
                              </Button>
                              <Button
                                className={`flex-1 ${
                                  defaultStorage === "sd"
                                    ? isDarkMode
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : "bg-blue-500 hover:bg-blue-600"
                                    : isDarkMode
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                                onClick={() => handleStorageChange("sd")}
                              >
                                SD卡
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } mb-2`}
                            >
                              存储空间使用情况
                            </div>
                            <Progress
                              value={
                                (storageUsage.used / storageUsage.total) * 100
                              }
                              className="w-full"
                            />
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } mt-2`}
                            >
                              已使用 {storageUsage.used}GB / 总共{" "}
                              {storageUsage.total}GB
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
                {activeTab === "network" && (
                  <motion.div
                    key="network"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">网络设置</h2>
                        <div className="space-y-4">
                          <div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } mb-2`}
                            >
                              网络管理
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                className={`flex-1 ${
                                  isDarkMode
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                              >
                                修改
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className={`flex-1 ${
                                      isDarkMode
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                                  >
                                    重置
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className={
                                    isDarkMode
                                      ? "bg-gray-800 text-white"
                                      : "bg-white text-black"
                                  }
                                >
                                  <DialogHeader>
                                    <DialogTitle>确认重置网络设置</DialogTitle>
                                    <DialogDescription>
                                      此操作将重置所有网络设置。您确定要继续吗？
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {}}
                                    >
                                      取消
                                    </Button>
                                    <Button
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={handleNetworkReset}
                                    >
                                      确认重置
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } mb-2`}
                            >
                              Wi-Fi 网络
                            </div>
                            <WifiList isDarkMode={isDarkMode} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
                {activeTab === "system" && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="space-y-4 p-4">
                        <h2 className="text-lg font-semibold">
                          AstroStation 管理
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } mb-2`}
                            >
                              系统操作
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className={`flex-1 ${
                                      isDarkMode
                                        ? "bg-yellow-600 hover:bg-yellow-700"
                                        : "bg-yellow-500 hover:bg-yellow-600"
                                    }`}
                                  >
                                    重启
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className={
                                    isDarkMode
                                      ? "bg-gray-800 text-white"
                                      : "bg-white text-black"
                                  }
                                >
                                  <DialogHeader>
                                    <DialogTitle>
                                      确认重启 AstroStation
                                    </DialogTitle>
                                    <DialogDescription>
                                      此操作将重启
                                      AstroStation。所有未保存的数据可能会丢失。您确定要继续吗？
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {}}
                                    >
                                      取消
                                    </Button>
                                    <Button
                                      className="bg-yellow-600 hover:bg-yellow-700"
                                      onClick={handleRestart}
                                    >
                                      确认重启
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className={`flex-1 ${
                                      isDarkMode
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                                  >
                                    关机
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className={
                                    isDarkMode
                                      ? "bg-gray-800 text-white"
                                      : "bg-white text-black"
                                  }
                                >
                                  <DialogHeader>
                                    <DialogTitle>
                                      确认关闭 AstroStation
                                    </DialogTitle>
                                    <DialogDescription>
                                      此操作将关闭
                                      AstroStation。所有未保存的数据可能会丢失。您确定要继续吗？
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {}}
                                    >
                                      取消
                                    </Button>
                                    <Button
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={handleShutdown}
                                    >
                                      确认关机
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            } mb-2`}
                          >
                            AstroStation 版本
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>App</span>
                              <span>v1.0.2.20240816</span>
                            </div>
                            <motion.div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() =>
                                setShowVersionDetails(!showVersionDetails)
                              }
                            >
                              <span>Core</span>
                              <ChevronDown
                                className={`h-4 w-4 transform transition-transform ${
                                  showVersionDetails ? "rotate-180" : ""
                                }`}
                              />
                            </motion.div>
                            <AnimatePresence>
                              {showVersionDetails && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="pl-4 space-y-1"
                                >
                                  <div>Core Version: 2.1.0</div>
                                  <div>Build Date: 2024-08-15</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <div className="flex justify-between items-center">
                              <span>SDK</span>
                              <span>v3.0.1</span>
                            </div>
                            <Button
                              className={`w-full ${
                                isDarkMode
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-blue-500 hover:bg-blue-600"
                              } mt-2`}
                              onClick={handleUpdate}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  更新中...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  检查更新
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            } mb-2`}
                          >
                            AstroStation 日志
                          </div>
                          <Button
                            className={`w-full ${
                              isDarkMode
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            <FileDown className="mr-2 h-4 w-4" />
                            下载日志
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}
