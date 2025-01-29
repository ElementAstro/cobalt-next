"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Camera,
  Eye,
  Focus,
  Maximize2,
  Minimize2,
  PlusCircle,
  MinusCircle,
  Crosshair,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
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
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGuidingStore } from "@/store/useGuidingStore";

export default function PreviewMode() {
  const { toast } = useToast();
  const [isLive, setIsLive] = useState(false);
  const [exposure, setExposure] = useState(1000); // ms
  const [gain, setGain] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [focusPosition, setFocusPosition] = useState(0);
  const [focusMode, setFocusMode] = useState<"manual" | "auto">("manual");
  const [selectedStar, setSelectedStar] = useState<{x: number, y: number} | null>(null);
  const [histogram, setHistogram] = useState<number[]>([]);
  const [imageStats, setImageStats] = useState({
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    noise: 0,
  });

  // 模拟实时图像更新
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      // 模拟图像更新和数据计算
      setHistogram(Array(256).fill(0).map(() => Math.random() * 100));
      setImageStats({
        brightness: Math.random() * 100,
        contrast: Math.random() * 100,
        sharpness: Math.random() * 100,
        noise: Math.random() * 100,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLiveView = () => {
    setIsLive(!isLive);
    toast({
      title: isLive ? "已停止实时预览" : "已开启实时预览",
      description: isLive ? "相机已停止采集" : "相机开始采集图像",
    });
  };

  const handleAutoFocus = async () => {
    if (!selectedStar) {
      toast({
        variant: "destructive",
        title: "未选择对焦星",
        description: "请先选择一颗合适的对焦星",
      });
      return;
    }

    setFocusMode("auto");
    // 模拟自动对焦过程
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFocusPosition(prev => prev + (Math.random() - 0.5) * 1000);
    }
    setFocusMode("manual");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2">
      {/* 主预览区域 */}
      <div className="lg:col-span-2">
        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="w-4 h-4" />
                实时预览
              </CardTitle>
              <Badge variant={isLive ? "default" : "secondary"}>
                {isLive ? "采集中" : "已停止"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16/9} className="bg-gray-900 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {!isLive && <Eye className="w-8 h-8 text-gray-500" />}
              </div>
              {selectedStar && (
                <motion.div
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute"
                  style={{ 
                    left: `${selectedStar.x}%`, 
                    top: `${selectedStar.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Crosshair className="w-6 h-6 text-yellow-500" />
                </motion.div>
              )}
            </AspectRatio>
          </CardContent>
          <CardFooter className="flex justify-between">
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isLive ? "destructive" : "default"}
                      size="sm"
                      onClick={toggleLiveView}
                    >
                      {isLive ? "停止" : "开始"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLive ? "停止预览" : "开始预览"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setZoom(100)}
                    >
                      <ZoomIn className="w-4 h-4 mr-1" />
                      重置缩放
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>重置图像缩放</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleAutoFocus()}
                      disabled={!selectedStar || focusMode === "auto"}
                    >
                      {focusMode === "auto" ? (
                        <RotateCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Focus className="w-4 h-4 mr-1" />
                      )}
                      自动对焦
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>开始自动对焦</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>

      {/* 控制面板 */}
      <div className="space-y-4">
        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm">图像控制</CardTitle>
            <CardDescription className="text-xs">
              调整曝光和增益参数
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="exposure">曝光时间 (ms)</Label>
                <span className="text-sm">{exposure}</span>
              </div>
              <Slider
                id="exposure"
                min={100}
                max={10000}
                step={100}
                value={[exposure]}
                onValueChange={([value]) => setExposure(value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gain">增益</Label>
                <span className="text-sm">{gain}</span>
              </div>
              <Slider
                id="gain"
                min={0}
                max={500}
                step={1}
                value={[gain]}
                onValueChange={([value]) => setGain(value)}
              />
            </div>

            <div className="pt-2">
              <Select
                value={focusMode}
                onValueChange={(value: "manual" | "auto") => setFocusMode(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择对焦模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">手动对焦</SelectItem>
                  <SelectItem value="auto">自动对焦</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="focus">对焦位置</Label>
                <span className="text-sm">{focusPosition.toFixed(0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFocusPosition(p => p - 100)}
                >
                  <MinusCircle className="w-4 h-4" />
                </Button>
                <Slider
                  id="focus"
                  min={0}
                  max={10000}
                  step={1}
                  value={[focusPosition]}
                  onValueChange={([value]) => setFocusPosition(value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFocusPosition(p => p + 100)}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 图像统计信息 */}
        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm">图像统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">亮度</div>
                <div className="text-lg font-semibold">
                  {imageStats.brightness.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">对比度</div>
                <div className="text-lg font-semibold">
                  {imageStats.contrast.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">锐度</div>
                <div className="text-lg font-semibold">
                  {imageStats.sharpness.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">噪点</div>
                <div className="text-lg font-semibold">
                  {imageStats.noise.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* 简单直方图显示 */}
            <div className="mt-4 h-24 flex items-end gap-px">
              {histogram.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gray-600"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
