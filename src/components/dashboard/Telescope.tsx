"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  Home,
  Power,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Settings2,
  Activity,
  Timer,
  Target,
  StopCircle,
  ParkingSquare,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react";
import { useTelescopeStore } from "@/store/useTelescopeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DeviceSelector } from "./device-selector";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
      mass: 0.5,
      duration: 0.4,
      delay: 0.1,
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

export function TelescopePage() {
  const {
    parkSwitch,
    homeSwitch,
    trackSwitch,
    speedNum,
    speedTotalNum,
    isIdle,
    isConnected,
    nightMode,
    currentRA,
    currentDec,
    currentAz,
    currentAlt,
    setCurrentRA,
    setCurrentDec,
    setCurrentAz,
    setCurrentAlt,
    toggleParkSwitch,
    toggleHomeSwitch,
    toggleTrackSwitch,
    incrementSpeed,
    decrementSpeed,
    setSpeedNum,
    setSpeedTotalNum,
    setIsIdle,
    setIsConnected,
    toggleNightMode,
    setTrackingMode,
    fetchStatus,
  } = useTelescopeStore();

  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  interface TrackingPoint {
    time: string;
    ra: number;
    dec: number;
  }

  const [trackingData, setTrackingData] = useState<TrackingPoint[]>([]);
  const [autoGuideStatus, setAutoGuideStatus] = useState(false);
  const [guidingStats, setGuidingStats] = useState({
    rms: 0,
    peak: 0,
    corrections: 0,
  });

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = async () => {
    try {
      await fetchStatus();
      toast({
        title: "成功",
        description: "设备连接成功",
        variant: "default",
      });
      setIsConnected(true);
    } catch (error) {
      toast({
        title: "错误",
        description: "设备连接失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "成功",
        description: "设备已断开连接",
        variant: "default",
      });
      setIsConnected(false);
      setIsIdle(true);
    } catch (error) {
      toast({
        title: "错误",
        description: "设备断开失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleToggleNightMode = () => {
    toggleNightMode();
    toast({
      title: nightMode ? "已切换到日间模式" : "已切换到夜间模式",
      description: nightMode ? "界面已切换到日间模式" : "界面已切换到夜间模式",
      variant: "default",
    });
  };

  const handleManualMove = async (direction: string) => {
    try {
      let newAz = currentAz;
      let newAlt = currentAlt;
      const step = speedTotalNum[speedNum] || 1;

      switch (direction) {
        case "up":
          newAlt = Math.min(currentAlt + step, 90);
          setCurrentAlt(newAlt);
          break;
        case "down":
          newAlt = Math.max(currentAlt - step, 0);
          setCurrentAlt(newAlt);
          break;
        case "left":
          newAz = (currentAz - step + 360) % 360;
          setCurrentAz(newAz);
          break;
        case "right":
          newAz = (currentAz + step) % 360;
          setCurrentAz(newAz);
          break;
        case "stop":
          break;
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "移动操作失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleIncrementSpeed = () => {
    incrementSpeed();
  };

  const handleDecrementSpeed = () => {
    decrementSpeed();
  };

  const handleToggleIdle = () => {
    setIsIdle(!isIdle);
  };

  const handleCalibration = async () => {
    setShowCalibration(true);
    setCalibrationProgress(0);

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCalibrationProgress(i);
      }

      toast({
        title: "校准完成",
        description: "望远镜参数已成功校准",
      });
    } catch (error) {
      toast({
        title: "校准失败",
        description: "请检查望远镜连接并重试",
        variant: "destructive",
      });
    } finally {
      setShowCalibration(false);
    }
  };

  const toggleAutoGuide = () => {
    setAutoGuideStatus(!autoGuideStatus);
    toast({
      title: autoGuideStatus ? "自动导星已停止" : "自动导星已启动",
      description: autoGuideStatus
        ? "已关闭自动导星功能"
        : "系统将自动进行导星校正",
    });
  };

  useEffect(() => {
    if (autoGuideStatus) {
      const interval = setInterval(() => {
        const newPoint = {
          time: new Date().toISOString(),
          ra: Math.random() * 2 - 1,
          dec: Math.random() * 2 - 1,
        };
        setTrackingData((prev) => [...prev.slice(-30), newPoint]);

        setGuidingStats({
          rms: Math.random() * 0.5,
          peak: Math.random() * 1.2,
          corrections: Math.floor(Math.random() * 100),
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [autoGuideStatus]);

  return (
    <AnimatePresence>
      <motion.div
        className="h-screen flex flex-col text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="flex-none p-2">
          <DeviceSelector
            deviceType="Telescope"
            onDeviceChange={(device) =>
              console.log(`Selected telescope: ${device}`)
            }
          />
        </div>
        <motion.div
          className={`flex-1 grid ${
            isDesktop
              ? "grid-cols-[1fr_1.2fr] gap-4 p-2"
              : "grid-cols-1 gap-2 p-1"
          }`}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {/* Control Panels */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br border-white shadow-xl backdrop-blur-md h-full flex flex-col">
              <CardHeader>
                <CardTitle>移动控制</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Direction Controls */}
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    onMouseDown={() => handleManualMove("left")}
                    onMouseUp={() => handleManualMove("stop")}
                    disabled={!isConnected}
                    aria-label="向左移动"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      onMouseDown={() => handleManualMove("up")}
                      onMouseUp={() => handleManualMove("stop")}
                      disabled={!isConnected}
                      aria-label="向上移动"
                    >
                      <ChevronUp className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="outline"
                      onMouseDown={() => handleManualMove("down")}
                      onMouseUp={() => handleManualMove("stop")}
                      disabled={!isConnected}
                      aria-label="向下移动"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onMouseDown={() => handleManualMove("right")}
                    onMouseUp={() => handleManualMove("stop")}
                    disabled={!isConnected}
                    aria-label="向右移动"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>

                {/* Speed Controls */}
                <div className="mb-4">
                  <Label>移动速度</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[speedNum]}
                      onValueChange={([v]) => setSpeedNum(v)}
                      max={speedTotalNum.length - 1}
                      step={1}
                      className="flex-1"
                      aria-label="移动速度滑块"
                    />
                    <div className="w-20 text-center">
                      {speedTotalNum[speedNum]}x
                    </div>
                  </div>
                  {/* Increment and Decrement Speed */}
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="secondary"
                      onClick={handleDecrementSpeed}
                      disabled={!isConnected || speedNum === 0}
                      aria-label="降低速度"
                    >
                      -
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleIncrementSpeed}
                      disabled={
                        !isConnected || speedNum === speedTotalNum.length - 1
                      }
                      aria-label="提高速度"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Park & Home Controls */}
                <div className="flex justify-between space-x-2">
                  <Button
                    variant="outline"
                    onClick={toggleParkSwitch}
                    disabled={!isConnected}
                    aria-label={parkSwitch ? "取消停靠" : "停靠"}
                  >
                    <ParkingSquare className="w-4 h-4 mr-2" />
                    {parkSwitch ? "取消停靠" : "停靠"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleHomeSwitch}
                    disabled={!isConnected}
                    aria-label={homeSwitch ? "取消归位" : "归位"}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {homeSwitch ? "取消归位" : "归位"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Settings */}
            <Card className="bg-gradient-to-br border-white shadow-xl backdrop-blur-md mt-6">
              <CardHeader>
                <CardTitle>追踪设置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>天体追踪</Label>
                    <Switch
                      checked={trackSwitch}
                      onCheckedChange={toggleTrackSwitch}
                      disabled={!isConnected}
                      aria-label="切换追踪"
                    />
                  </div>
                  <Select
                    defaultValue="sidereal"
                    onValueChange={(value) => setTrackingMode(value)}
                    disabled={!trackSwitch || !isConnected}
                    aria-label="选择追踪速率"
                  >
                    <SelectTrigger className="w-full bg-gray-600">
                      <SelectValue placeholder="选择追踪速率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sidereal">恒星时</SelectItem>
                      <SelectItem value="solar">太阳时</SelectItem>
                      <SelectItem value="lunar">月球时</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card className="bg-gradient-to-br border-white shadow-xl backdrop-blur-md mt-6">
              <CardHeader>
                <CardTitle>高级选项</CardTitle>
              </CardHeader>
              <CardContent>
                <Label>高级参数</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    checked={!isIdle}
                    onCheckedChange={handleToggleIdle}
                    disabled={!isConnected}
                    aria-label="切换空闲状态"
                  />
                  <span>{isIdle ? "空闲" : "忙碌"}</span>
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  这里可以进行更深入的设置，如精调电机、偏心检测等。
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Panels */}
          <motion.div variants={itemVariants}>
            {/* Current Position */}
            <Card className="bg-gradient-to-br border-white shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle>当前位置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>赤经 (RA)</Label>
                    <div className="text-sm">{currentRA.toFixed(2)}°</div>
                  </div>
                  <div className="space-y-2">
                    <Label>赤纬 (DEC)</Label>
                    <div className="text-sm">{currentDec.toFixed(2)}°</div>
                  </div>
                  <div className="space-y-2">
                    <Label>方位角 (AZ)</Label>
                    <div className="text-sm">{currentAz.toFixed(2)}°</div>
                  </div>
                  <div className="space-y-2">
                    <Label>高度角 (ALT)</Label>
                    <div className="text-sm">{currentAlt.toFixed(2)}°</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Telescope Info */}
            <Card className="bg-gradient-to-br border-white shadow-xl backdrop-blur-md mt-6">
              <CardHeader>
                <CardTitle>望远镜信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>厂商</Label>
                    <div className="text-sm">Celestron</div>
                  </div>
                  <div className="space-y-2">
                    <Label>型号</Label>
                    <div className="text-sm">NexStar 8SE</div>
                  </div>
                  <div className="space-y-2">
                    <Label>口径 (mm)</Label>
                    <div className="text-sm">203</div>
                  </div>
                  <div className="space-y-2">
                    <Label>焦距 (mm)</Label>
                    <div className="text-sm">2032</div>
                  </div>
                  <div className="space-y-2">
                    <Label>F比</Label>
                    <div className="text-sm">f/10</div>
                  </div>
                  <div className="space-y-2">
                    <Label>类型</Label>
                    <div className="text-sm">施密特-卡塞格林</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card className="bg-gradient-to-br border-white shadow-xl backdrop-blur-md mt-6">
              <CardHeader>
                <CardTitle>状态信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 flex items-center">
                    <Label>连接状态</Label>
                    <Badge
                      variant={isConnected ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {isConnected ? "已连接" : "未连接"}
                    </Badge>
                  </div>
                  <div className="space-y-2 flex items-center">
                    <Label>移动速度</Label>
                    <div className="flex items-center ml-2">
                      <Activity className="w-4 h-4 mr-1" />
                      <span>{speedTotalNum[speedNum]}x</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex items-center">
                    <Label>追踪状态</Label>
                    <div className="flex items-center ml-2">
                      <Timer className="w-4 h-4 mr-1" />
                      <span>{trackSwitch ? "追踪中" : "未追踪"}</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex items-center">
                    <Label>空闲状态</Label>
                    <Badge
                      variant={isIdle ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {isIdle ? "空闲" : "忙碌"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
