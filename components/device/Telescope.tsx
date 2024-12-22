import React from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { mountApi } from "@/services/device/telescope";
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
} from "lucide-react";
import { useMountStore } from "@/lib/store/device/telescope";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { DeviceSelector } from "./DeviceSelector";

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
  } = useMountStore();

  useEffect(() => {
    if (speedTotalNum.length === 0) {
      setSpeedTotalNum([1, 2, 5, 10, 20, 30]);
    }
  }, [speedTotalNum.length, setSpeedTotalNum]);

  const handleConnect = async () => {
    try {
      await mountApi.connect();
      toast({
        title: "成功",
        description: "设备连接成功",
        variant: "default",
      });
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
      await mountApi.disconnect();
      toast({
        title: "成功",
        description: "设备已断开连接",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "设备断开失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleTogglePark = async () => {
    try {
      await mountApi.togglePark();
      toast({
        title: "成功",
        description: parkSwitch ? "停靠已启动" : "停靠已取消",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "停靠操作失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleToggleHome = async () => {
    try {
      await mountApi.toggleHome();
      toast({
        title: "成功",
        description: homeSwitch ? "归位已启动" : "归位已取消",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "归位操作失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleToggleTrack = async () => {
    try {
      await mountApi.toggleTrack();
      toast({
        title: "成功",
        description: trackSwitch ? "追踪已启动" : "追踪已停止",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "追踪切换失败",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleManualMove = async (direction: string) => {
    try {
      let newAz = currentAz;
      let newAlt = currentAlt;
      const step = speedTotalNum[speedNum] || 1;

      switch (direction) {
        case "up":
          newAlt = Math.min(currentAlt + step, 90);
          await mountApi.setCurrentAlt(newAlt);
          break;
        case "down":
          newAlt = Math.max(currentAlt - step, 0);
          await mountApi.setCurrentAlt(newAlt);
          break;
        case "left":
          newAz = (currentAz - step + 360) % 360;
          await mountApi.setCurrentAz(newAz);
          break;
        case "right":
          newAz = (currentAz + step) % 360;
          await mountApi.setCurrentAz(newAz);
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <DeviceSelector
          deviceType="Telescope"
          onDeviceChange={(device) =>
            console.log(`Selected telescope: ${device}`)
          }
        />

        <motion.div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Main Control Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-4rem)] rounded-xl border border-gray-800">
              <div className="grid grid-cols-12 gap-2 mt-2">
                {/* Main Controls */}
                <motion.div variants={itemVariants} className="col-span-6">
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>移动控制</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Direction Controls */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("up-left")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronLeft className="w-4 h-4 rotate-45" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("up")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("up-right")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronRight className="w-4 h-4 -rotate-45" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("left")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <StopCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("right")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("down-left")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronLeft className="w-4 h-4 -rotate-45" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("down")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onMouseDown={() => handleManualMove("down-right")}
                          onMouseUp={() => handleManualMove("stop")}
                          disabled={!isConnected}
                        >
                          <ChevronRight className="w-4 h-4 rotate-45" />
                        </Button>
                      </div>

                      {/* Speed Controls */}
                      <div className="space-y-2">
                        <Label>移动速度</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[speedNum]}
                            onValueChange={([v]) => setSpeedNum(v)}
                            max={speedTotalNum.length - 1}
                            step={1}
                            className="flex-1"
                          />
                          <div className="w-20 text-center">
                            {speedTotalNum[speedNum]}x
                          </div>
                        </div>
                      </div>

                      {/* Park & Home Controls */}
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handleTogglePark}
                          disabled={!isConnected}
                        >
                          <ParkingSquare className="w-4 h-4 mr-2" />
                          {parkSwitch ? "取消停靠" : "停靠"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleToggleHome}
                          disabled={!isConnected}
                        >
                          <Home className="w-4 h-4 mr-2" />
                          {homeSwitch ? "取消归位" : "归位"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md mt-6">
                    <CardHeader>
                      <CardTitle>追踪设置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>天体追踪</Label>
                          <Switch
                            checked={trackSwitch}
                            onCheckedChange={handleToggleTrack}
                            disabled={!isConnected}
                          />
                        </div>
                        <Select defaultValue="sidereal">
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

                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md mt-6">
                    <CardHeader>
                      <CardTitle>高级选项</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Label>高级参数 （暂未设置）</Label>
                      <p className="text-sm text-gray-300">
                        这里可以进行更深入的设置，如精调电机、偏心检测等。
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Side Info */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-6 space-y-4"
                >
                  {/* Current Position */}
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md">
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
                          <div className="text-sm">
                            {currentDec.toFixed(2)}°
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>方位角 (AZ)</Label>
                          <div className="text-sm">{currentAz.toFixed(2)}°</div>
                        </div>
                        <div className="space-y-2">
                          <Label>高度角 (ALT)</Label>
                          <div className="text-sm">
                            {currentAlt.toFixed(2)}°
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Telescope Info */}
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md">
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
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>状态信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>连接状态</Label>
                          <Badge variant="default">
                            {isConnected ? "已连接" : "未连接"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label>移动速度</Label>
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-2" />
                            <span>{speedTotalNum[speedNum]}x</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>追踪状态</Label>
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-2" />
                            <span>{trackSwitch ? "追踪中" : "未追踪"}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
