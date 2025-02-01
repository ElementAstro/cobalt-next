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
  Focus,
  ZoomIn,
  ZoomOut,
  Thermometer,
  Gauge,
  RotateCw,
  Target,
  Settings,
  History,
  Save,
  Eye,
  EyeOff,
  ArrowUpDown,
  Maximize2,
  Minimize2,
  ThermometerSnowflake,
  RefreshCw,
  AlertCircle,
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

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
  const [showCommands, setShowCommands] = useState(false);

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
        className="container mx-auto h-[calc(100vh-4rem)] flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex-none p-4">
          <DeviceSelector
            deviceType="Focuser"
            onDeviceChange={handleDeviceChange}
          />
          {isConnected && (
            <Badge
              variant={focuserInfo.isMoving ? "outline" : "secondary"}
              className="ml-2"
            >
              {focuserInfo.isMoving ? (
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Target className="mr-1 h-3 w-3" />
              )}
              {focuserInfo.isMoving ? "移动中" : "就绪"}
            </Badge>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div
            className={`grid ${
              isDesktop ? "grid-cols-2" : "grid-cols-1"
            } gap-6`}
          >
            <Card className="bg-background/95 supports-[backdrop-filter]:bg-background/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="h-6 w-6" />
                    Focuser 状态
                  </div>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    <Power className="mr-1 h-3 w-3" />
                    {isConnected ? "已连接" : "未连接"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {/* 核心状态 */}
                  <motion.div
                    variants={itemVariants}
                    className="col-span-2 flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    <div className="flex-1 space-y-1">
                      <Label>目标位置</Label>
                      <div className="text-sm font-medium">
                        {targetPosition} 步{" "}
                        {focuserInfo.isMoving && "(移动中...)"}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <Focus className="h-4 w-4" />
                    <div className="space-y-1">
                      <Label>当前位置</Label>
                      <div className="text-sm font-medium">
                        {focuserInfo.position} 步
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <Thermometer className="h-4 w-4" />
                    <div className="space-y-1">
                      <Label>当前温度</Label>
                      <div className="text-sm font-medium">
                        {focuserInfo.temperature}°C
                      </div>
                    </div>
                  </motion.div>

                  {/* 补偿设置 */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <ThermometerSnowflake className="h-4 w-4" />
                    <div className="space-y-1">
                      <Label>温度补偿</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={temperatureCompensation}
                          onCheckedChange={handleTemperatureCompensation}
                          disabled={!isConnected}
                        />
                        <span className="text-sm">
                          {focuserInfo.temperatureCompensation
                            ? "已启用"
                            : "已禁用"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <RotateCw className="h-4 w-4" />
                    <div className="space-y-1">
                      <Label>反向间隙补偿</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={backflashCompensation}
                          onCheckedChange={handleBackflashCompensation}
                          disabled={!isConnected}
                        />
                        <span className="text-sm">
                          {backflashCompensation ? "已启用" : "已禁用"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* 位置限制 */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <Maximize2 className="h-4 w-4" />
                    <div className="space-y-1">
                      <Label>最大/最小位置</Label>
                      <div className="text-sm font-medium">
                        {focuserInfo.maxPosition} / {focuserInfo.minPosition} 步
                      </div>
                    </div>
                  </motion.div>

                  {/* 步进设置 */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <div className="space-y-1">
                      <Label>步进参数</Label>
                      <div className="text-sm font-medium">
                        步长: {focuserInfo.stepSize} / 间隙:{" "}
                        {focuserInfo.backflash} 步
                      </div>
                    </div>
                  </motion.div>

                  {/* 移动历史 */}
                  <motion.div variants={itemVariants} className="col-span-2">
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 w-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            <span>最近移动历史</span>
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ScrollArea className="h-24 w-full rounded-md border mt-2">
                          <div className="p-4">
                            {moveHistory.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                暂无移动记录
                              </div>
                            ) : (
                              moveHistory.map((step, index) => (
                                <div
                                  key={index}
                                  className="text-sm flex items-center gap-2"
                                >
                                  <ArrowUpDown className="h-3 w-3" />
                                  <span>{step > 0 ? `+${step}` : step} 步</span>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-background/95 supports-[backdrop-filter]:bg-background/60 shadow-xl">
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
                      <div className="space-y-4">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between"
                            >
                              <span>高级设置</span>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2"></CollapsibleContent>
                        </Collapsible>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {focuserInfo.isMoving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4"
          >
            <Button
              variant="destructive"
              onClick={() => moveFocuser(0)}
              className="flex items-center gap-2"
            >
              <StopCircle className="h-4 w-4" />
              停止移动
            </Button>
          </motion.div>
        )}
      </motion.div>
      <CommandDialog open={showCommands} onOpenChange={setShowCommands}>
        <CommandInput placeholder="输入命令..." />
        <CommandList>
          <CommandEmpty>未找到相关命令</CommandEmpty>
          <CommandGroup heading="常用操作">
            <CommandItem>
              <Focus className="mr-2 h-4 w-4" />
              <span>自动对焦</span>
            </CommandItem>
            <CommandItem>
              <Thermometer className="mr-2 h-4 w-4" />
              <span>温度补偿</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </AnimatePresence>
  );
}
