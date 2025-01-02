"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Power,
  Compass,
  StopCircle,
  PlayCircle,
  Settings2,
} from "lucide-react";
import { DeviceSelector } from "./device-selector";
import { motion, AnimatePresence } from "framer-motion";
import { useFocuserStore } from "@/store/useFocuserStore";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMediaQuery } from "react-responsive";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FocuserPage() {
  const [inputPosition, setInputPosition] = useState("12500");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    targetPosition,
    temperatureCompensation,
    backflashCompensation,
    focuserInfo,
    isConnected,
    moveHistory,
    setTargetPosition,
    setTemperatureCompensation,
    setBackflashCompensation,
    moveFocuser,
    addMoveHistory,
    setConnected,
    fetchStatus,
  } = useFocuserStore();
  const [autoFocusing, setAutoFocusing] = useState(false);
  const [tempCompCurve, setTempCompCurve] = useState<[number, number][]>([]);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const handleError = (error: any) => {
    toast({
      variant: "destructive",
      title: "操作失败",
      description: error.message || "未知错误",
    });
  };

  const handleMove = async (steps: number) => {
    try {
      setIsLoading(true);
      moveFocuser(steps);
      toast({
        title: "移动聚焦器",
        description: `正在移动 ${steps} 步`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToPosition = async () => {
    const position = parseInt(inputPosition);
    try {
      setIsLoading(true);
      setTargetPosition(position);
      toast({
        title: "移动聚焦器",
        description: `正在移动到位置 ${position}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemperatureCompensation = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      setTemperatureCompensation(enabled);
      toast({
        title: "温度补偿",
        description: `温度补偿已${enabled ? "启用" : "禁用"}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackflashCompensation = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      setBackflashCompensation(enabled);
      toast({
        title: "反向间隙补偿",
        description: `反向间隙补偿已${enabled ? "启用" : "禁用"}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoFocus = async () => {
    try {
      setAutoFocusing(true);
      setIsLoading(true);
      // 实现自动对焦逻辑
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "自动对焦",
        description: "自动对焦完成",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setAutoFocusing(false);
      setIsLoading(false);
    }
  };

  const addTempCompPoint = async () => {
    try {
      setIsLoading(true);
      const newPoint: [number, number] = [
        focuserInfo.temperature,
        focuserInfo.position,
      ];
      setTempCompCurve([...tempCompCurve, newPoint]);
      toast({
        title: "温度补偿",
        description: "已添加温度补偿点",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);
      if (isConnected) {
        setConnected(false);
        toast({
          title: "断开连接",
          description: "设备已断开连接",
          variant: "default",
        });
      } else {
        await fetchStatus();
        setConnected(true);
        toast({
          title: "连接成功",
          description: "设备已连接",
          variant: "default",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen text-white p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <DeviceSelector
            deviceType="Focuser"
            onDeviceChange={handleDeviceChange}
          />

          {isDesktop ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 左侧面板 */}
              <Card className="lg:col-span-6 bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-6 w-6 animate-pulse" />
                    Focuser 信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>当前位置</Label>
                      <div className="text-sm">{focuserInfo.position} 步</div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>温度</Label>
                      <div className="text-sm">{focuserInfo.temperature}°C</div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>反向间隙</Label>
                      <div className="text-sm">{focuserInfo.backflash}</div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>步进大小</Label>
                      <div className="text-sm">{focuserInfo.stepSize}</div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>最大位置</Label>
                      <div className="text-sm">
                        {focuserInfo.maxPosition} 步
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>最小位置</Label>
                      <div className="text-sm">
                        {focuserInfo.minPosition} 步
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label>是否移动</Label>
                      <div className="text-sm">
                        {focuserInfo.isMoving ? "是" : "否"}
                      </div>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center space-x-2"
                    >
                      <Label htmlFor="temp-comp">温度补偿</Label>
                      <Switch
                        id="temp-comp"
                        checked={temperatureCompensation}
                        onCheckedChange={handleTemperatureCompensation}
                        disabled={!isConnected}
                      />
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center space-x-2"
                    >
                      <Label htmlFor="backflash-comp">反向间隙补偿</Label>
                      <Switch
                        id="backflash-comp"
                        checked={backflashCompensation}
                        onCheckedChange={handleBackflashCompensation}
                        disabled={!isConnected}
                      />
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>

              {/* 右侧面板 */}
              <Card className="lg:col-span-6 bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-6 w-6" />
                    Focuser 控制
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="control" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="control">控制</TabsTrigger>
                      <TabsTrigger value="settings">设置</TabsTrigger>
                      <TabsTrigger value="history">历史</TabsTrigger>
                      <TabsTrigger value="advanced">高级</TabsTrigger>
                    </TabsList>

                    <TabsContent value="control">
                      <div className="space-y-4">
                        {/* 移动到位置 */}
                        <motion.div
                          variants={itemVariants}
                          className="flex flex-col space-y-4"
                        >
                          <Label htmlFor="target-position">目标位置</Label>
                          <div className="flex space-x-4">
                            <Input
                              id="target-position"
                              type="number"
                              value={inputPosition}
                              onChange={(e) => setInputPosition(e.target.value)}
                              className="flex-1 bg-gray-700 text-white"
                              disabled={!isConnected}
                            />
                            <Button
                              onClick={handleMoveToPosition}
                              className="whitespace-nowrap"
                              disabled={!isConnected || isLoading}
                            >
                              移动到
                            </Button>
                          </div>
                        </motion.div>

                        {/* 方向控制 */}
                        <motion.div
                          variants={itemVariants}
                          className="flex justify-center gap-4"
                        >
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(-1000)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向左移动1000步"
                          >
                            <ChevronFirst className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(-100)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向左移动100步"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(100)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向右移动100步"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(1000)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向右移动1000步"
                          >
                            <ChevronLast className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings">
                      <div className="space-y-4">
                        {/* 温度补偿开关 */}
                        <motion.div
                          variants={itemVariants}
                          className="flex items-center justify-between"
                        >
                          <Label htmlFor="temp-comp-switch">温度补偿</Label>
                          <Switch
                            id="temp-comp-switch"
                            checked={temperatureCompensation}
                            onCheckedChange={handleTemperatureCompensation}
                            disabled={!isConnected}
                          />
                        </motion.div>

                        {/* 反向间隙补偿开关 */}
                        <motion.div
                          variants={itemVariants}
                          className="flex items-center justify-between"
                        >
                          <Label htmlFor="backflash-comp-switch">
                            反向间隙补偿
                          </Label>
                          <Switch
                            id="backflash-comp-switch"
                            checked={backflashCompensation}
                            onCheckedChange={handleBackflashCompensation}
                            disabled={!isConnected}
                          />
                        </motion.div>
                      </div>
                    </TabsContent>

                    <TabsContent value="history">
                      <div className="space-y-4">
                        {/* 移动历史记录 */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <Label>移动历史记录</Label>
                          <ScrollArea className="h-48 rounded-md border">
                            {moveHistory.length === 0 ? (
                              <div className="text-sm">暂无移动记录。</div>
                            ) : (
                              moveHistory.map((step, index) => (
                                <div key={index} className="text-sm">
                                  {step > 0 ? `+${step}` : step} 步
                                </div>
                              ))
                            )}
                          </ScrollArea>
                        </motion.div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced">
                      <div className="space-y-4"></div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 移动端布局 */}
              <Card className="bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-6 w-6 animate-bounce" />
                    Focuser 状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>连接状态</span>
                      <Badge variant={isConnected ? "default" : "destructive"}>
                        {isConnected ? "已连接" : "未连接"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>温度补偿</span>
                      <Badge
                        variant={
                          temperatureCompensation ? "default" : "secondary"
                        }
                      >
                        {temperatureCompensation ? "已启用" : "未启用"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>当前温度</span>
                      <span className="font-mono">
                        {focuserInfo.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>目标位置</span>
                      <span className="font-mono">{targetPosition} 步</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                      onClick={() => handleMoveToPosition()}
                      disabled={!isConnected || isLoading}
                    >
                      移动到目标位置
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-6 w-6" />
                    Focuser 控制
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="control" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="control">控制</TabsTrigger>
                      <TabsTrigger value="settings">设置</TabsTrigger>
                      <TabsTrigger value="history">历史</TabsTrigger>
                      <TabsTrigger value="advanced">高级</TabsTrigger>
                    </TabsList>

                    <TabsContent value="control">
                      <div className="space-y-4">
                        {/* 移动到位置 */}
                        <div className="flex flex-col space-y-4">
                          <Label htmlFor="target-position-mobile">
                            目标位置
                          </Label>
                          <div className="flex space-x-4">
                            <Input
                              id="target-position-mobile"
                              type="number"
                              value={inputPosition}
                              onChange={(e) => setInputPosition(e.target.value)}
                              className="flex-1 bg-gray-700 text-white"
                              disabled={!isConnected}
                            />
                            <Button
                              onClick={handleMoveToPosition}
                              className="whitespace-nowrap"
                              disabled={!isConnected || isLoading}
                            >
                              移动到
                            </Button>
                          </div>
                        </div>

                        {/* 方向控制 */}
                        <div className="flex justify-center gap-4">
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(-1000)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向左移动1000步"
                          >
                            <ChevronFirst className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(-100)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向左移动100步"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(100)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向右移动100步"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleMove(1000)}
                            className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                            disabled={!isConnected || isLoading}
                            aria-label="向右移动1000步"
                          >
                            <ChevronLast className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings">
                      <div className="space-y-4">
                        {/* 温度补偿开关 */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor="temp-comp-switch-mobile">
                            温度补偿
                          </Label>
                          <Switch
                            id="temp-comp-switch-mobile"
                            checked={temperatureCompensation}
                            onCheckedChange={handleTemperatureCompensation}
                            disabled={!isConnected}
                          />
                        </div>

                        {/* 反向间隙补偿开关 */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor="backflash-comp-switch-mobile">
                            反向间隙补偿
                          </Label>
                          <Switch
                            id="backflash-comp-switch-mobile"
                            checked={backflashCompensation}
                            onCheckedChange={handleBackflashCompensation}
                            disabled={!isConnected}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="history">
                      <div className="space-y-4">
                        {/* 移动历史记录 */}
                        <div className="space-y-2">
                          <Label>移动历史记录</Label>
                          <ScrollArea className="h-48 rounded-md border">
                            {moveHistory.length === 0 ? (
                              <div className="text-sm">暂无移动记录。</div>
                            ) : (
                              moveHistory.map((step, index) => (
                                <div key={index} className="text-sm">
                                  {step > 0 ? `+${step}` : step} 步
                                </div>
                              ))
                            )}
                          </ScrollArea>
                        </div>
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

          {/* 自动对焦和温度补偿 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 自动对焦 */}
            <Card className="bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>自动对焦</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <Button
                    onClick={startAutoFocus}
                    disabled={autoFocusing || isLoading || !isConnected}
                  >
                    {autoFocusing ? "对焦中..." : "开始自动对焦"}
                  </Button>

                  <div className="space-y-2">
                    <Label>温度补偿曲线</Label>
                    <Button
                      onClick={addTempCompPoint}
                      variant="outline"
                      disabled={!isConnected || isLoading}
                    >
                      添加当前点
                    </Button>
                    <ScrollArea className="h-32 rounded-md border">
                      {tempCompCurve.map((point, index) => (
                        <div key={index} className="text-sm">
                          {point[0].toFixed(1)}°C @ {point[1]}步
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* 移动历史记录 */}
            <Card className="bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>移动历史记录</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 rounded-md border">
                  {moveHistory.length === 0 ? (
                    <div className="text-sm">暂无移动记录。</div>
                  ) : (
                    moveHistory.map((step, index) => (
                      <div key={index} className="text-sm">
                        {step > 0 ? `+${step}` : step} 步
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 设备和温度信息 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 设备状态 */}
            <Card className="bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>设备状态</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <div className="flex items-center">
                    <Badge className="flex items-center p-2 bg-blue-600 rounded-full shadow-lg">
                      <Compass className="w-4 h-4 mr-1 animate-spin-slow" />
                      方向感应中
                    </Badge>
                  </div>
                  <div className="text-sm">
                    {isConnected
                      ? "设备已连接，正常运行。"
                      : "设备未连接，请连接设备。"}
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* 温度信息 */}
            <Card className="bg-background/95 backdrop-blur rounded-2xl shadow-xl border-white transition-transform duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>温度信息</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <div className="text-sm">
                    当前温度: {focuserInfo.temperature}°C
                  </div>
                  <div className="text-sm">
                    温度补偿: {temperatureCompensation ? "已启用" : "未启用"}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
