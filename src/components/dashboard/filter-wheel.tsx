"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useFilterWheelStore } from "@/store/useFilterwheelStore";
import { DeviceSelector } from "./device-selector";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Power,
  Loader2,
  Compass,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "react-responsive";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FilterWheelPage() {
  const { toast } = useToast();
  const {
    filterWheelInfo,
    selectedFilter,
    setSelectedFilter,
    isConnected,
    setConnected,
    changeFilter,
    addMoveHistory,
    fetchStatus,
  } = useFilterWheelStore();
  const [isLoading, setIsLoading] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await fetchStatus(); // 假设 fetchStatus 处理连接逻辑
      toast({
        title: "成功",
        description: "设备连接成功",
        variant: "default",
      });
      setConnected(true);
    } catch (error) {
      toast({
        title: "错误",
        description: "设备连接失败",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      // 假设有 disconnect 函数处理断开逻辑
      await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟异步操作
      toast({
        title: "成功",
        description: "设备已断开连接",
        variant: "default",
      });
      setConnected(false);
    } catch (error) {
      toast({
        title: "错误",
        description: "设备断开失败",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNightMode = () => {
    setNightMode(!nightMode);
    toast({
      title: nightMode ? "已切换到日间模式" : "已切换到夜间模式",
      description: nightMode ? "界面已切换到日间模式" : "界面已切换到夜间模式",
      variant: "default",
    });
  };

  const handleFilterChange = async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "请先连接设备",
      });
      return;
    }

    setIsLoading(true);
    try {
      await changeFilter(parseInt(selectedFilter));
      toast({
        title: "更换滤镜",
        description: `已切换至滤镜 ${
          filterWheelInfo.filters[parseInt(selectedFilter) - 1]
        }`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "更换滤镜失败",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`min-h-screen ${
          nightMode
            ? "bg-gradient-to-br from-gray-900 to-gray-950 text-white"
            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
        } p-4`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <DeviceSelector
            deviceType="FilterWheel"
            onDeviceChange={(device) =>
              toast({
                title: "设备更换",
                description: `已选择滤镜轮设备: ${device}`,
                variant: "default",
              })
            }
          />

          <motion.div
            className={`grid ${
              isDesktop ? "grid-cols-2 gap-6" : "grid-cols-1 gap-4"
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 控制面板 */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl p-4">
                <CardHeader>
                  <CardTitle>滤镜控制</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    {/* 选择滤镜 */}
                    <div>
                      <Label htmlFor="filter-select">选择滤镜</Label>
                      <div className="flex gap-4 mt-2">
                        <Select
                          value={selectedFilter}
                          onValueChange={setSelectedFilter}
                          disabled={!isConnected || isLoading}
                        >
                          <SelectTrigger id="filter-select">
                            <SelectValue placeholder="请选择滤镜" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterWheelInfo.filters.map((filter, index) => (
                              <SelectItem
                                key={index}
                                value={(index + 1).toString()}
                              >
                                {filter}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleFilterChange}
                          disabled={!isConnected || isLoading}
                          className="min-w-[120px]"
                        >
                          {isLoading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          更换滤镜
                        </Button>
                      </div>
                    </div>

                    {/* 夜间模式开关 */}
                    <div className="flex items-center justify-between">
                      <Label>夜间模式</Label>
                      <Switch
                        checked={nightMode}
                        onCheckedChange={handleToggleNightMode}
                      />
                    </div>
                  </div>

                  {/* 移动进度条 */}
                  {filterWheelInfo.isMoving && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6"
                    >
                      <Progress value={50} className="h-2" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* 信息面板 */}
            <motion.div variants={itemVariants}>
              <div className="space-y-6">
                {/* 滤镜轮信息 */}
                <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl p-4">
                  <CardHeader>
                    <CardTitle>滤镜轮信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label>名称</Label>
                        <div className="text-sm">{filterWheelInfo.name}</div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label>驱动信息</Label>
                        <div className="text-sm">
                          {filterWheelInfo.driverInfo}
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label>驱动版本</Label>
                        <div className="text-sm">
                          {filterWheelInfo.driverVersion}
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label>当前滤镜</Label>
                        <div className="text-sm">
                          {filterWheelInfo.currentFilter}
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label>描述</Label>
                        <div className="text-sm">
                          {filterWheelInfo.description}
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label>当前位置</Label>
                        <div className="text-sm">
                          {filterWheelInfo.position} /{" "}
                          {filterWheelInfo.maxPosition}
                        </div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>

                {/* 移动历史记录 */}
                <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl p-4">
                  <CardHeader>
                    <CardTitle>移动历史记录</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filterWheelInfo.isMoving ? (
                        <Alert>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <AlertTitle>正在移动...</AlertTitle>
                          <AlertDescription>请稍候。</AlertDescription>
                        </Alert>
                      ) : (
                        <div className="text-sm">暂无移动记录。</div>
                      )}
                      {filterWheelInfo.filters.map((filter, index) => (
                        <Badge key={index} variant="outline">
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 设备状态 */}
                <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl p-4">
                  <CardHeader>
                    <CardTitle>设备状态</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Badge className="flex items-center p-2 bg-blue-600 rounded-full shadow-lg">
                        <Compass className="w-4 h-4 mr-1 animate-spin-slow" />
                        方向感应中
                      </Badge>
                      <div className="text-sm">
                        {isConnected
                          ? "设备已连接，正常运行。"
                          : "设备未连接，请连接设备。"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>

          {/* 额外动画和增强 */}
          <motion.div
            className="fixed bottom-4 right-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Badge className="flex items-center p-2 bg-blue-600 rounded-full shadow-lg">
              <Compass className="w-4 h-4 mr-1 animate-spin-slow" />
              方向感应中
            </Badge>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
