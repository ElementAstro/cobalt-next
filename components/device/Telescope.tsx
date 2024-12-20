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

export default function TelescopePage() {
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
      className="min-h-screen bg-gray-900 text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <DeviceSelector
          deviceType="Telescope"
          onDeviceChange={(device) =>
            console.log(`Selected telescope: ${device}`)
          }
        />

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <ScrollArea className="h-screen w-full bg-gray-900 text-white">
              <motion.div className="grid grid-cols-12 gap-4 p-4">
                {/* Status Bar */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-12 flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={isConnected ? "default" : "destructive"}>
                      {isConnected ? "已连接" : "未连接"}
                    </Badge>
                    <Badge variant={parkSwitch ? "default" : "secondary"}>
                      {parkSwitch ? "已停靠" : "未停靠"}
                    </Badge>
                    <Badge variant={trackSwitch ? "default" : "secondary"}>
                      {trackSwitch ? "追踪中" : "未追踪"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant={isConnected ? "destructive" : "default"}
                      onClick={handleConnect}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {isConnected ? "断开连接" : "连接望远镜"}
                    </Button>
                  </div>
                </motion.div>

                {/* Main Controls */}
                <motion.div variants={itemVariants} className="col-span-8">
                  <Tabs defaultValue="movement" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="movement">
                        <Compass className="w-4 h-4 mr-2" />
                        移动控制
                      </TabsTrigger>
                      <TabsTrigger value="tracking">
                        <Target className="w-4 h-4 mr-2" />
                        追踪设置
                      </TabsTrigger>
                      <TabsTrigger value="advanced">
                        <Settings2 className="w-4 h-4 mr-2" />
                        高级选项
                      </TabsTrigger>
                    </TabsList>

                    {/* Movement Controls */}
                    <TabsContent value="movement">
                      <Card>
                        <CardContent className="space-y-4 pt-4">
                          {/* Direction Controls */}
                          <div className="flex flex-col items-center space-y-4">
                            {/* ...existing direction control buttons... */}
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
                    </TabsContent>

                    {/* Tracking Settings */}
                    <TabsContent value="tracking">
                      <Card>
                        <CardContent className="space-y-4 pt-4">
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
                    </TabsContent>

                    {/* Advanced Settings */}
                    <TabsContent value="advanced">
                      {/* ...existing advanced settings... */}
                    </TabsContent>
                  </Tabs>
                </motion.div>

                {/* Side Info */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-4 space-y-4"
                >
                  {/* Current Position */}
                  <Card>
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

                  {/* Status Info */}
                  <Card>
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
              </motion.div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
