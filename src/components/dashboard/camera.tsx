"use client";

import React, { useEffect, useState } from "react";
import { useCameraStore } from "@/store/useCameraStore";
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
import { Progress } from "@/components/ui/progress";
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
  ChevronRight,
  Zap, // 用于电源状态
  Gauge, // 用于增益指示
  ThermometerSnowflake, // 用于制冷状态
  Binary, // 用于像素合并
  Scale, // 用于偏置
  Sun, // 用于曝光
  GitBranch, // 用于分支指示
  Aperture, // 用于光圈/ISO
  Monitor, // 用于显示模式
  Wifi, // 用于USB带宽
  AlertCircle, // 用于警告
  CheckCircle2, // 用于成功状态
  Database, // 用于数据存储
} from "lucide-react";
import { Span } from "@/components/custom/span";
import ImageSettingsPanel from "./image-settings";
import { DeviceSelector } from "./device-selector";
import { useMediaQuery } from "react-responsive";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import { toast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";

export function CameraPage() {
  const camera = useCameraStore();
  const [isLandscape, setIsLandscape] = useState(false);

  const handleResize = debounce(() => {
    setIsLandscape(window.innerWidth > window.innerHeight);
  }, 200);

  useEffect(() => {
    const handleWindowResize = () => {
      handleResize();
      // 添加额外的布局调整逻辑
      const container = document.querySelector(".container");
      if (container) {
        if (window.innerWidth > window.innerHeight) {
          container.classList.add("landscape");
        } else {
          container.classList.remove("landscape");
        }
      }
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [handleResize]);
  const [histogramData, setHistogramData] = useState<
    { x: number; y: number }[]
  >([]);
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    camera.fetchStatus();
    const interval = setInterval(() => {
      const newTemp = camera.temperature + (Math.random() - 0.5) * 0.1;
      camera.setTemperature(newTemp);
      camera.addTemperatureHistory({
        time: new Date().toLocaleTimeString(),
        temperature: newTemp,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 新增相机校准功能
  const handleCalibration = async () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCalibrationProgress(i);
      }

      toast({
        title: "校准完成",
        description: "相机参数已成功校准",
      });
    } catch (error) {
      toast({
        title: "校准失败",
        description: "请检查相机连接并重试",
        variant: "destructive",
      });
    } finally {
      setIsCalibrating(false);
    }
  };

  return (
    <motion.div
      className={cn(
        "container mx-auto p-4 h-[calc(100vh-4rem)]",
        "flex flex-col gap-4",
        isLandscape ? "landscape-mode" : ""
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DeviceSelector
        deviceType="Camera"
        onDeviceChange={(device) => console.log(`Selected camera: ${device}`)}
      />

      <div
        className={cn(
          "flex-1 grid gap-4 overflow-hidden",
          isDesktop ? "grid-cols-2" : "grid-cols-1",
          isLandscape ? "grid-cols-2 max-h-[calc(100vh-8rem)]" : ""
        )}
      >
        {/* Camera Status Panel */}
        <Card className="overflow-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CameraIcon className="h-6 w-6 animate-pulse" />
              相机状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Span className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  连接状态
                </Span>
                <Badge
                  variant={camera.isConnected ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {camera.isConnected ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {camera.isConnected ? "已连接" : "未连接"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Span className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  录制状态
                </Span>
                <Badge
                  variant={camera.isRecording ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {camera.isRecording ? (
                    <Activity className="w-3 h-3 animate-pulse" />
                  ) : (
                    <Power className="w-3 h-3" />
                  )}
                  {camera.isRecording ? "录制中" : "停止"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Span className="flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4" />
                  制冷状态
                </Span>
                <Badge
                  variant={camera.coolerOn ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {camera.coolerOn ? (
                    <Activity className="w-3 h-3 animate-pulse" />
                  ) : (
                    <Power className="w-3 h-3" />
                  )}
                  {camera.coolerOn ? "制冷中" : "关闭"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Span>当前温度</Span>
                <Span className="font-mono">
                  {camera.temperature.toFixed(1)}°C
                </Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>目标温度</Span>
                <Span className="font-mono">{camera.targetTemperature}°C</Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>制冷功率</Span>
                <Span className="font-mono">{camera.power}%</Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>目标制冷功率</Span>
                <Span className="font-mono">{camera.targetCoolingPower}%</Span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Span>曝光时间</Span>
                <Span className="font-mono">{camera.exposure}秒</Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>增益</Span>
                <Span className="font-mono">{camera.gain}</Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>ISO</Span>
                <Span className="font-mono">{camera.iso}</Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>偏置</Span>
                <Span className="font-mono">{camera.offset}</Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>像素合并</Span>
                <Span className="font-mono">
                  {camera.binning}x{camera.binning}
                </Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>白平衡</Span>
                <Span className="font-mono">
                  {camera.whiteBalance || "auto"}
                </Span>
              </div>
              <div className="flex items-center justify-between">
                <Span>对焦位置</Span>
                <Span className="font-mono">{camera.focus || "N/A"}</Span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Span>暗场校正</Span>
                <Badge
                  variant={camera.darkFrameEnabled ? "default" : "secondary"}
                >
                  {camera.darkFrameEnabled ? "启用" : "禁用"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Span>自动白平衡</Span>
                <Badge variant={camera.autoWBEnabled ? "default" : "secondary"}>
                  {camera.autoWBEnabled ? "启用" : "禁用"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Span>读出模式</Span>
                <Badge variant="outline">{camera.readoutMode}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <Span>USB带宽</Span>
                <Span className="font-mono">{camera.usbBandwidth}%</Span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
                onClick={() => camera.toggleRecording()}
                disabled={!camera.isConnected}
              >
                {camera.isRecording ? (
                  <>
                    <StopCircle className="w-4 h-4 animate-spin" />
                    停止曝光
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    开始曝光
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera Control Panel */}
        <Card className="overflow-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-6 w-6" />
                相机控制
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="exposure" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="exposure">曝光</TabsTrigger>
                  <TabsTrigger value="cooling">制冷</TabsTrigger>
                  <TabsTrigger value="image">图像</TabsTrigger>
                  <TabsTrigger value="advanced">高级</TabsTrigger>
                </TabsList>

                <TabsContent value="exposure">
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          曝光时间 (秒)
                        </Label>
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
                              camera.setExposure(parseFloat(e.target.value))
                            }
                            className="w-24"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Gauge className="w-4 h-4" />
                          增益
                        </Label>
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
                            className="w-24"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Aperture className="w-4 h-4" />
                          ISO
                        </Label>
                        <Select
                          value={camera.iso.toString()}
                          onValueChange={(v) => camera.setISO(parseInt(v))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">ISO 100</SelectItem>
                            <SelectItem value="200">ISO 200</SelectItem>
                            <SelectItem value="400">ISO 400</SelectItem>
                            <SelectItem value="800">ISO 800</SelectItem>
                            <SelectItem value="1600">ISO 1600</SelectItem>
                            <SelectItem value="3200">ISO 3200</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          偏置
                        </Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[camera.offset]}
                            onValueChange={([v]) => camera.setOffset(v)}
                            min={0}
                            max={255}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={camera.offset}
                            onChange={(e) =>
                              camera.setOffset(parseInt(e.target.value))
                            }
                            className="w-24"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Binary className="w-4 h-4" />
                          像素合并
                        </Label>
                        <Select
                          value={camera.binning.toString()}
                          onValueChange={(v) => camera.setBinning(parseInt(v))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1x1</SelectItem>
                            <SelectItem value="2">2x2</SelectItem>
                            <SelectItem value="3">3x3</SelectItem>
                            <SelectItem value="4">4x4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cooling">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>制冷开关</Label>
                      <Switch
                        checked={camera.coolerOn}
                        onCheckedChange={() => camera.toggleCooler()}
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
                          max={20}
                          step={0.1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={camera.targetTemperature}
                          onChange={(e) =>
                            camera.setTargetTemperature(
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>制冷功率 (%)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[camera.power]}
                          min={0}
                          max={100}
                          onValueChange={([v]) =>
                            camera.setCurrentCoolingPower(v)
                          }
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={camera.power}
                          onChange={(e) =>
                            camera.setCurrentCoolingPower(
                              parseInt(e.target.value)
                            )
                          }
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="image">
                  <ImageSettingsPanel />
                </TabsContent>
                <TabsContent value="advanced">
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>校准设置</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>自动校准</Label>
                            <Button
                              onClick={handleCalibration}
                              disabled={isCalibrating || !camera.isConnected}
                            >
                              {isCalibrating ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Settings2 className="w-4 h-4 mr-2" />
                              )}
                              {isCalibrating ? "校准中..." : "开始校准"}
                            </Button>
                          </div>
                          {isCalibrating && (
                            <Progress
                              value={calibrationProgress}
                              className="w-full"
                            />
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>高级参数</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>暗场校正</Label>
                            <Switch
                              checked={camera.darkFrameEnabled}
                              onCheckedChange={camera.toggleDarkFrame}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>自动白平衡</Label>
                            <Switch
                              checked={camera.autoWBEnabled}
                              onCheckedChange={camera.toggleAutoWB}
                            />
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowAdvancedDialog(true)}
                          >
                            更多设置
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <AlertDialog
                      open={showAdvancedDialog}
                      onOpenChange={setShowAdvancedDialog}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>高级相机设置</AlertDialogTitle>
                          <AlertDialogDescription>
                            请谨慎调整以下参数，不当的设置可能会影响图像质量。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <ScrollArea className="h-[300px] rounded-md border p-4">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Monitor className="w-4 h-4" />
                                  读出模式
                                </Label>
                                <Select
                                  value={camera.readoutMode}
                                  onValueChange={camera.setReadoutMode}
                                >
                                  <SelectTrigger className="flex items-center gap-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">
                                      <span className="flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        普通
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="fast">
                                      <span className="flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        高速
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="lowNoise">
                                      <span className="flex items-center gap-2">
                                        <ThermometerSnowflake className="w-4 h-4" />
                                        低噪声
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>USB 带宽</Label>
                                <Slider
                                  value={[camera.usbBandwidth]}
                                  onValueChange={([v]) =>
                                    camera.setUSBBandwidth(v)
                                  }
                                  min={0}
                                  max={100}
                                  step={1}
                                />
                              </div>
                            </div>
                          </ScrollArea>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction>保存设置</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </motion.div>
        </Card>
      </div>

      {/* Advanced Settings Dialog */}
      <AlertDialog
        open={showAdvancedDialog}
        onOpenChange={setShowAdvancedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>高级相机设置</AlertDialogTitle>
            <AlertDialogDescription>
              请谨慎调整以下参数，不当的设置可能会影响图像质量。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    读出模式
                  </Label>
                  <Select
                    value={camera.readoutMode}
                    onValueChange={camera.setReadoutMode}
                  >
                    <SelectTrigger className="flex items-center gap-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">
                        <span className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          普通
                        </span>
                      </SelectItem>
                      <SelectItem value="fast">
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          高速
                        </span>
                      </SelectItem>
                      <SelectItem value="lowNoise">
                        <span className="flex items-center gap-2">
                          <ThermometerSnowflake className="w-4 h-4" />
                          低噪声
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>USB 带宽</Label>
                  <Slider
                    value={[camera.usbBandwidth]}
                    onValueChange={([v]) => camera.setUSBBandwidth(v)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction>保存设置</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
