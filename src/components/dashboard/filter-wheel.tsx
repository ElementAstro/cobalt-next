"use client";

import React from "react";
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
  Filter,
  RotateCw,
  Settings,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  CircleDot,
  MinusCircle,
  PlusCircle,
  History,
  Disc,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "react-responsive";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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

  const getFilterPositionProgress = () => {
    const { position, maxPosition, minPosition } = filterWheelInfo;
    return ((position - minPosition) / (maxPosition - minPosition)) * 100;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="container mx-auto h-[calc(100vh-4rem)] flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex-none p-4">
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
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div
            className={`grid ${
              isDesktop ? "grid-cols-2" : "grid-cols-1"
            } gap-6`}
          >
            {/* 左侧控制面板 */}
            <Card className="bg-background/95 supports-[backdrop-filter]:bg-background/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-6 w-6" />
                    滤镜控制
                  </div>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {isConnected ? "已连接" : "未连接"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Filter Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CircleDot className="h-4 w-4" />
                      当前滤镜位置
                    </Label>
                    <Progress value={getFilterPositionProgress()} />
                    <div className="flex justify-between text-sm">
                      <span>{filterWheelInfo.minPosition}</span>
                      <span>{filterWheelInfo.position}</span>
                      <span>{filterWheelInfo.maxPosition}</span>
                    </div>
                  </div>

                  {/* Filter Controls */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      滤镜选择
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={
                          !isConnected ||
                          filterWheelInfo.position <=
                            filterWheelInfo.minPosition
                        }
                        onClick={() =>
                          changeFilter(filterWheelInfo.position - 1)
                        }
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Select
                        value={selectedFilter}
                        onValueChange={setSelectedFilter}
                        disabled={!isConnected || isLoading}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="选择滤镜" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterWheelInfo.filters.map((filter, index) => (
                            <SelectItem
                              key={index}
                              value={(index + 1).toString()}
                            >
                              <div className="flex items-center gap-2">
                                <Disc className="h-4 w-4" />
                                {filter}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={
                          !isConnected ||
                          filterWheelInfo.position >=
                            filterWheelInfo.maxPosition
                        }
                        onClick={() =>
                          changeFilter(filterWheelInfo.position + 1)
                        }
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Moving Status */}
                  {filterWheelInfo.isMoving && (
                    <Alert>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <AlertTitle>滤镜移动中</AlertTitle>
                      <AlertDescription>
                        正在移动至位置 {selectedFilter}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Movement History */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      移动历史
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {moveHistory.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          暂无移动记录
                        </div>
                      ) : (
                        moveHistory.map((position, index) => (
                          <Badge key={index} variant="secondary">
                            {filterWheelInfo.filters[position - 1]}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Connect/Disconnect Button */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant={isConnected ? "destructive" : "default"}
                      onClick={isConnected ? handleDisconnect : handleConnect}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Power className="w-4 h-4 mr-2" />
                      )}
                      {isConnected ? "断开连接" : "连接设备"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fetchStatus()}
                      disabled={!isConnected}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 右侧信息面板 */}
            <div className="space-y-4">
              {/* Device Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    设备信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">基本信息</TabsTrigger>
                      <TabsTrigger value="advanced">详细参数</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic">
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        variants={containerVariants}
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
                    </TabsContent>
                    <TabsContent value="advanced">
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        variants={containerVariants}
                      >
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>连接状态</Label>
                          <div className="text-sm">
                            {isConnected ? "已连接" : "未连接"}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>移动状态</Label>
                          <div className="text-sm">
                            {filterWheelInfo.isMoving ? "移动中" : "静止"}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>可用滤镜列表</Label>
                          <div className="flex flex-wrap gap-2">
                            {filterWheelInfo.filters.map((filter, index) => (
                              <Badge key={index} variant="outline">
                                {filter}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>位置范围</Label>
                          <div className="text-sm">
                            最小: {filterWheelInfo.minPosition} / 最大:{" "}
                            {filterWheelInfo.maxPosition}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>移动历史记录</Label>
                          <div className="flex flex-wrap gap-2">
                            {moveHistory.map((position, index) => (
                              <Badge key={index} variant="secondary">
                                位置 {position}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>当前选中滤镜</Label>
                          <div className="text-sm">{selectedFilter}</div>
                        </motion.div>
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* 实时状态监控 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCw className="h-5 w-5" />
                    实时状态监控
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>当前位置进度</Label>
                      <Progress
                        value={getFilterPositionProgress()}
                        className="w-2/3"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>移动状态</Label>
                      <Badge
                        variant={
                          filterWheelInfo.isMoving ? "default" : "secondary"
                        }
                      >
                        {filterWheelInfo.isMoving ? (
                          <RotateCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <StopCircle className="w-4 h-4 mr-1" />
                        )}
                        {filterWheelInfo.isMoving ? "移动中" : "静止"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>当前滤镜</Label>
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-4 h-4" />
                        {filterWheelInfo.currentFilter}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>位置信息</Label>
                      <div className="text-sm">
                        {filterWheelInfo.position} /{" "}
                        {filterWheelInfo.maxPosition}
                      </div>
                    </div>
                  </div>
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

              {/* 滤镜设置 */}
              <ContextMenu>
                <ContextMenuTrigger className="block">
                  <Card>
                    <CardHeader>
                      <CardTitle>滤镜设置</CardTitle>
                    </CardHeader>
                    <CardContent>{/* 现有内容 */}</CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Save className="mr-2 h-4 w-4" />
                    保存设置
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <RotateCw className="mr-2 h-4 w-4" />
                    重置设置
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {/* 重要操作 */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    重要操作
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认操作</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作将重置所有滤镜设置，确认继续吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction>确认</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
