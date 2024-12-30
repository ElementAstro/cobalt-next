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
import { DeviceSelector } from "./DeviceSelector";

export function CameraPage() {
  const camera = useCameraStore();
  const [histogramData, setHistogramData] = useState<
    { x: number; y: number }[]
  >([]);

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <DeviceSelector
        deviceType="Camera"
        onDeviceChange={(device) => console.log(`Selected camera: ${device}`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <Card className="lg:col-span-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CameraIcon className="h-6 w-6" />
              相机状态
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
              <Span>连接状态</Span>
              <Badge variant={camera.isConnected ? "default" : "destructive"}>
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
              <Span className="font-mono">{camera.targetTemperature}°C</Span>
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
              className="w-full"
              variant="outline"
              onClick={() => camera.toggleRecording()}
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
            </div>
            </CardContent>
        </Card>

        {/* Middle Panel */}
        <Card className="lg:col-span-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader>
            <CardTitle>相机控制</CardTitle>
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
                        onValueChange={([v]) => camera.setTargetTemperature(v)}
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
