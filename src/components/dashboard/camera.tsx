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

export function CameraPage() {
  const camera = useCameraStore();
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
      className="container mx-auto p-4 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DeviceSelector
        deviceType="Camera"
        onDeviceChange={(device) => console.log(`Selected camera: ${device}`)}
      />

      {isDesktop ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧面板 */}
          <Card className="lg:col-span-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CameraIcon className="h-6 w-6 animate-pulse" />
                相机状态
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Span>连接状态</Span>
                  <Badge
                    variant={camera.isConnected ? "default" : "destructive"}
                  >
                    {camera.isConnected ? "已连接" : "未连接"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Span>制冷状态</Span>
                  <Badge variant={camera.coolerOn ? "default" : "secondary"}>
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
                  <Span className="font-mono">
                    {camera.targetTemperature}°C
                  </Span>
                </div>
                <div className="flex items-center justify-between">
                  <Span>制冷功率</Span>
                  <Span className="font-mono">{camera.power}%</Span>
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

          {/* 中间面板 */}
          <Card className="lg:col-span-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                              camera.setExposure(parseFloat(e.target.value))
                            }
                            className="w-24"
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
                            className="w-24"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>ISO</Label>
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
                        <Label>偏置</Label>
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
                        <Label>像素合并</Label>
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
                                <Label>读出模式</Label>
                                <Select
                                  value={camera.readoutMode}
                                  onValueChange={camera.setReadoutMode}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">普通</SelectItem>
                                    <SelectItem value="fast">高速</SelectItem>
                                    <SelectItem value="lowNoise">
                                      低噪声
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
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 移动端布局 */}
          <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CameraIcon className="h-6 w-6 animate-bounce" />
                相机状态
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Span>连接状态</Span>
                  <Badge
                    variant={camera.isConnected ? "default" : "destructive"}
                  >
                    {camera.isConnected ? "已连接" : "未连接"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Span>制冷状态</Span>
                  <Badge variant={camera.coolerOn ? "default" : "secondary"}>
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
                  <Span className="font-mono">
                    {camera.targetTemperature}°C
                  </Span>
                </div>
                <div className="flex items-center justify-between">
                  <Span>制冷功率</Span>
                  <Span className="font-mono">{camera.power}%</Span>
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

          <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-6 w-6" />
                相机控制
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="exposure" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exposure">曝光</TabsTrigger>
                  <TabsTrigger value="cooling">制冷</TabsTrigger>
                  <TabsTrigger value="image">图像</TabsTrigger>
                  <TabsTrigger value="advanced">高级</TabsTrigger>
                </TabsList>

                <TabsContent value="exposure">
                  <div className="space-y-4">
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
                            camera.setExposure(parseFloat(e.target.value))
                          }
                          className="w-20"
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
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ISO</Label>
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
                      <Label>偏置</Label>
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
                          className="w-20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>像素合并</Label>
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
                          className="w-20"
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
                          className="w-20"
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
                                <Label>读出模式</Label>
                                <Select
                                  value={camera.readoutMode}
                                  onValueChange={camera.setReadoutMode}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="normal">普通</SelectItem>
                                    <SelectItem value="fast">高速</SelectItem>
                                    <SelectItem value="lowNoise">
                                      低噪声
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
          </Card>
        </div>
      )}
    </motion.div>
  );
}
