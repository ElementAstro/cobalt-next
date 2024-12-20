"use client";

import React, { useEffect, useState } from "react";
import { useCameraStore } from "@/lib/store/device/camera";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera as CameraIcon,
  Power,
  Thermometer,
  Timer,
  Save,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Settings2,
  ImagePlus,
  Activity,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import TemperatureLineChart from "@/components/chart/TemperatureLineChart";
import HistogramChart from "@/components/chart/HistogramChart";
import { DeviceSelector } from "./DeviceSelector";
import { cameraApi } from "@/services/device/camera";

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

export function CameraPage() {
  const camera = useCameraStore();
  const [histogramData, setHistogramData] = useState<
    { x: number; y: number }[]
  >([]);
  const [previewOn, setPreviewOn] = useState(false);

  // 模拟温度和温度历史
  useEffect(() => {
    const intervalId = setInterval(() => {
      // 模拟温度波动
      const newTemp = camera.temperature + (Math.random() - 0.5);
      camera.setTemperature(newTemp);
      camera.addTemperatureHistory({
        time: new Date().toLocaleTimeString(),
        temperature: newTemp,
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, [camera]);

  // 模拟直方图数据
  useEffect(() => {
    const data = Array(256)
      .fill(0)
      .map((_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 1000),
      }));
    setHistogramData(data);
  }, []);

  useEffect(() => {
    // 组件加载时获取状态
    camera.fetchStatus();
  }, []);

  const handleConnect = async () => {
    if (!camera.isConnected) {
      await cameraApi.connect();
      camera.setConnected(true);
    } else {
      await cameraApi.disconnect();
      camera.setConnected(false);
    }
  };

  const handleCoolerToggle = async (checked: boolean) => {
    await cameraApi.toggleCooler();
    camera.toggleCooler();
  };

  const handleExposureStart = async () => {
    if (!camera.isConnected) return;
    if (!camera.isRecording) {
      await cameraApi.startExposure(
        camera.exposure,
        camera.gain,
        camera.binning
      );
      camera.toggleRecording();
    } else {
      await cameraApi.abortExposure();
      camera.toggleRecording();
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
          deviceType="Camera"
          onDeviceChange={(device) => console.log(`Selected camera: ${device}`)}
        />

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <ScrollArea className="h-screen w-full bg-gray-900 text-white">
              <motion.div
                className="grid grid-cols-12 gap-4 p-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* 状态栏 */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-12 flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={camera.isConnected ? "default" : "destructive"}
                    >
                      {camera.isConnected ? "已连接" : "未连接"}
                    </Badge>
                    <Badge variant={camera.coolerOn ? "default" : "secondary"}>
                      {camera.coolerOn ? "制冷中" : "制冷关闭"}
                    </Badge>
                    <Badge
                      variant={camera.isRecording ? "default" : "secondary"}
                    >
                      {camera.isRecording ? "曝光中" : "待机"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant={camera.isConnected ? "destructive" : "default"}
                      onClick={handleConnect}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {camera.isConnected ? "断开连接" : "连接相机"}
                    </Button>
                  </div>
                </motion.div>

                {/* 主控制区 */}
                <motion.div variants={itemVariants} className="col-span-8">
                  <Tabs defaultValue="exposure" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="exposure">
                        <Timer className="w-4 h-4 mr-2" />
                        曝光控制
                      </TabsTrigger>
                      <TabsTrigger value="cooling">
                        <Thermometer className="w-4 h-4 mr-2" />
                        温度控制
                      </TabsTrigger>
                      <TabsTrigger value="image">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        图像设置
                      </TabsTrigger>
                      <TabsTrigger value="advanced">
                        <Settings2 className="w-4 h-4 mr-2" />
                        高级选项
                      </TabsTrigger>
                    </TabsList>

                    {/* 曝光控制 */}
                    <TabsContent value="exposure">
                      <Card>
                        <CardContent className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>曝光时间 (秒)</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[camera.exposure]}
                                  onValueChange={([v]) => camera.setExposure(v)}
                                  min={0.001}
                                  max={3600}
                                  step={0.001}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={camera.exposure}
                                  onChange={(e) =>
                                    camera.setExposure(
                                      parseFloat(e.target.value)
                                    )
                                  }
                                  className="w-24 bg-gray-700"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>增益</Label>
                              <div className="flex items-center gap-2">
                                <Slider
                                  value={[camera.gain]}
                                  onValueChange={([v]) => camera.setGain(v)}
                                  min={0}
                                  max={100}
                                  className="flex-1"
                                />
                                <Input
                                  type="number"
                                  value={camera.gain}
                                  onChange={(e) =>
                                    camera.setGain(parseInt(e.target.value))
                                  }
                                  className="w-24 bg-gray-700"
                                />
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <Button
                              variant="default"
                              onClick={handleExposureStart}
                              disabled={!camera.isConnected}
                            >
                              {camera.isRecording ? (
                                <>
                                  <StopCircle className="w-4 h-4 mr-2" />
                                  停止曝光
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-4 h-4 mr-2" />
                                  开始曝光
                                </>
                              )}
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={previewOn ? "default" : "outline"}
                                    onClick={() => setPreviewOn(!previewOn)}
                                    disabled={!camera.isConnected}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {previewOn ? "关闭预览" : "实时预览"}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>打开实时预览窗口</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* 温度控制 */}
                    <TabsContent value="cooling">
                      <Card>
                        <CardContent className="space-y-4 pt-4">
                          <div className="flex items-center justify-between">
                            <Label>制冷器控制</Label>
                            <Switch
                              checked={camera.coolerOn}
                              onCheckedChange={handleCoolerToggle}
                              disabled={!camera.isConnected}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>目标温度 (°C)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[camera.targetTemperature]}
                                onValueChange={([v]) =>
                                  camera.setTargetTemperature(v)
                                }
                                min={-30}
                                max={30}
                                className="flex-1"
                              />
                              <Input
                                type="number"
                                value={camera.targetTemperature}
                                onChange={(e) =>
                                  camera.setTargetTemperature(
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-24 bg-gray-700"
                              />
                            </div>
                          </div>
                          <div className="h-48 bg-gray-800 rounded-lg overflow-hidden">
                            <TemperatureLineChart
                              data={camera.temperatureHistory.map((point) => ({
                                time: point.time,
                                temperature: point.temperature,
                              }))}
                              showGrid={true}
                              showLegend={false}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* 图像设置 */}
                    <TabsContent value="image">
                      <Card>
                        <CardContent className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>文件格式</Label>
                              <Select defaultValue="FITS">
                                <SelectTrigger className="bg-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="FITS">FITS</SelectItem>
                                  <SelectItem value="TIFF">TIFF</SelectItem>
                                  <SelectItem value="RAW">RAW</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              {/*
                                <Label>直方图</Label>
                              <div className="h-32 bg-gray-800 rounded overflow-hidden">
                                <HistogramChart data={histogramData} />
                              </div>
                                */}
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <Button
                              variant="default"
                              disabled={!camera.isConnected}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              保存图像
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={previewOn ? "default" : "outline"}
                                    onClick={() => setPreviewOn(!previewOn)}
                                    disabled={!camera.isConnected}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {previewOn ? "关闭预览" : "实时预览"}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>打开实时预览窗口</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* 高级选项 */}
                    <TabsContent value="advanced">
                      <Card>
                        <CardContent className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>ISO</Label>
                              <Input
                                type="number"
                                value={camera.iso}
                                onChange={(e) =>
                                  camera.setISO(parseInt(e.target.value))
                                }
                                className="bg-gray-700"
                                disabled={!camera.isConnected}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>偏置(Offset)</Label>
                              <Input
                                type="number"
                                value={camera.offset}
                                onChange={(e) =>
                                  camera.setOffset(parseInt(e.target.value))
                                }
                                className="bg-gray-700"
                                disabled={!camera.isConnected}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Bin 倍率</Label>
                              <Input
                                type="number"
                                value={camera.binning}
                                onChange={(e) =>
                                  camera.setBinning(parseInt(e.target.value))
                                }
                                className="bg-gray-700"
                                disabled={!camera.isConnected}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>当前功率</Label>
                              <Input
                                type="number"
                                value={camera.power}
                                onChange={(e) =>
                                  camera.setCurrentCoolingPower(
                                    parseInt(e.target.value)
                                  )
                                }
                                className="bg-gray-700"
                                disabled={!camera.isConnected}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>

                {/* 侧边栏 */}
                <motion.div
                  variants={itemVariants}
                  className="col-span-4 space-y-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CameraIcon className="w-5 h-5" />
                        相机选择
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue="Canon EOS Ra">
                        <SelectTrigger className="w-full bg-gray-600 text-white">
                          <SelectValue placeholder="选择相机型号" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Canon EOS Ra">
                            Canon EOS Ra
                          </SelectItem>
                          <SelectItem value="Nikon D850">Nikon D850</SelectItem>
                          <SelectItem value="Sony A7R IV">
                            Sony A7R IV
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>相机信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>传感器类型</Label>
                          <div className="text-sm">背照式CMOS</div>
                        </div>
                        <div className="space-y-2">
                          <Label>传感器尺寸</Label>
                          <div className="text-sm">35.9mm x 24mm</div>
                        </div>
                        <div className="space-y-2">
                          <Label>像素尺寸</Label>
                          <div className="text-sm">3.76μm</div>
                        </div>
                        <div className="space-y-2">
                          <Label>当前温度</Label>
                          <div className="text-sm">{`${camera.temperature.toFixed(
                            1
                          )}°C`}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>附加信息</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>连接状态</Label>
                          <Badge variant="default">
                            {camera.isConnected ? "已连接" : "未连接"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label>缓冲率</Label>
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-2" />
                            <span>85%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>温度</Label>
                          <div className="flex items-center">
                            <Thermometer className="w-4 h-4 mr-2" />
                            <span>{camera.temperature.toFixed(1)}°C</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>曝光</Label>
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-2" />
                            <span>{`${camera.exposure.toFixed(3)}s`}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </ScrollArea>
          </motion.div>

          {/* Side Panel */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* ...existing side panel code... */}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
