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
  StopCircle,
  PlayCircle,
  Settings2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "react-responsive";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    moveHistory,
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
        className={`min-h-screen`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto space-y-3">
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

          {isDesktop ? (
            <div className="grid grid-cols-2 gap-6">
              {/* 控制面板 */}
              <motion.div variants={itemVariants}>
                <Card className="border-white shadow-xl rounded-2xl p-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-6 w-6 animate-pulse" />
                      滤镜控制
                    </CardTitle>
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

                      {/* 连接/断开按钮 */}
                      <div className="flex items-center justify-between">
                        {isConnected ? (
                          <Button
                            onClick={handleDisconnect}
                            disabled={isLoading}
                            variant="destructive"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Power className="w-4 h-4 mr-2" />
                            )}
                            断开连接
                          </Button>
                        ) : (
                          <Button
                            onClick={handleConnect}
                            disabled={isLoading}
                            variant="default"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Power className="w-4 h-4 mr-2" />
                            )}
                            连接设备
                          </Button>
                        )}
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
                  <Card className="border-white shadow-xl rounded-2xl p-4">
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
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>名称</Label>
                          <div className="text-sm">{filterWheelInfo.name}</div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>驱动信息</Label>
                          <div className="text-sm">
                            {filterWheelInfo.driverInfo}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>驱动版本</Label>
                          <div className="text-sm">
                            {filterWheelInfo.driverVersion}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>当前滤镜</Label>
                          <div className="text-sm">
                            {filterWheelInfo.currentFilter}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>描述</Label>
                          <div className="text-sm">
                            {filterWheelInfo.description}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
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
                  <Card className="border-white shadow-xl rounded-2xl p-4">
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
                        {moveHistory.map((move, index) => (
                          <Badge key={index} variant="outline">
                            {move}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 设备状态 */}
                  <Card className="border-white shadow-xl rounded-2xl p-4">
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
            </div>
          ) : (
            <div className="space-y-3 text-white">
              {/* 移动端布局 */}
              <Card className="border-white shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-6 w-6 animate-pulse" />
                    滤镜控制
                  </CardTitle>
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

              {/* 滤镜轮信息 */}
              <Card className="border-white shadow-xl rounded-2xl p-4">
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

              <Card className="border-white shadow-xl rounded-2xl">
                <CardContent>
                  <Tabs defaultValue="control" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="settings">设置</TabsTrigger>
                      <TabsTrigger value="history">历史</TabsTrigger>
                      <TabsTrigger value="advanced">高级</TabsTrigger>
                    </TabsList>

                    <TabsContent value="settings">
                      <div className="space-y-4">
                        {/* 其他设置 */}
                        <div className="space-y-2">
                          <Label>其他设置</Label>
                          {/* 添加更多设置项 */}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="history">
                      <div className="space-y-4">
                        {/* 移动历史记录 */}
                        <Card className="bg-gray-700 border-gray-600 shadow-md rounded-md p-4">
                          <Label>移动历史记录</Label>
                          <div className="mt-2 space-y-2">
                            {filterWheelInfo.isMoving ? (
                              <Alert>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <AlertTitle>正在移动...</AlertTitle>
                                <AlertDescription>请稍候。</AlertDescription>
                              </Alert>
                            ) : moveHistory.length === 0 ? (
                              <div className="text-sm">暂无移动记录。</div>
                            ) : (
                              moveHistory.map((move, index) => (
                                <Badge key={index} variant="outline">
                                  {move}
                                </Badge>
                              ))
                            )}
                          </div>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced">
                      <div className="space-y-4"></div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
