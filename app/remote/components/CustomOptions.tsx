"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CustomOptionsProps {
  keyboardShortcuts: boolean;
  handleKeyboardShortcuts: (checked: boolean) => void;
  theme: string;
  setTheme: (value: "light" | "dark") => void;
  scaleViewport: boolean;
  setScaleViewport: (checked: boolean) => void;
  clipViewport: boolean;
  setClipViewport: (checked: boolean) => void;
  dragViewport: boolean;
  setDragViewport: (checked: boolean) => void;
  resizeSession: boolean;
  setResizeSession: (checked: boolean) => void;
  showDotCursor: boolean;
  setShowDotCursor: (checked: boolean) => void;
  qualityLevel: number;
  setQualityLevel: (value: number) => void;
  compressionLevel: number;
  setCompressionLevel: (value: number) => void;
  background: string;
  setBackground: (value: string) => void;
  mobileMode?: boolean;
  touchScrolling?: boolean;
  setTouchScrolling?: (checked: boolean) => void;
  performanceMode?: "quality" | "balanced" | "speed";
  setPerformanceMode?: (value: "quality" | "balanced" | "speed") => void;
}

const CustomOptions: React.FC<CustomOptionsProps> = ({
  keyboardShortcuts,
  handleKeyboardShortcuts,
  theme,
  setTheme,
  scaleViewport,
  setScaleViewport,
  clipViewport,
  setClipViewport,
  dragViewport,
  setDragViewport,
  resizeSession,
  setResizeSession,
  showDotCursor,
  setShowDotCursor,
  qualityLevel,
  setQualityLevel,
  compressionLevel,
  setCompressionLevel,
  background,
  setBackground,
  touchScrolling,
  setTouchScrolling,
  performanceMode,
  setPerformanceMode,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Tabs defaultValue="display" className="w-full">
      <TabsList
        className={`grid w-full ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}
      >
        <TabsTrigger value="display">显示</TabsTrigger>
        <TabsTrigger value="performance">性能</TabsTrigger>
        <TabsTrigger value="controls">控制</TabsTrigger>
        <TabsTrigger value="advanced">高级</TabsTrigger>
      </TabsList>

      <TabsContent value="display" className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>缩放以适应窗口</Label>
          <Switch checked={scaleViewport} onCheckedChange={setScaleViewport} />
        </div>
        <div className="flex justify-between items-center">
          <Label>裁剪视口</Label>
          <Switch checked={clipViewport} onCheckedChange={setClipViewport} />
        </div>
        {clipViewport && (
          <div className="flex justify-between items-center">
            <Label>拖动视口</Label>
            <Switch checked={dragViewport} onCheckedChange={setDragViewport} />
          </div>
        )}
        <Select onValueChange={setBackground} value={background}>
          <SelectTrigger>
            <SelectValue placeholder="背景样式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rgb(40, 40, 40)">深灰色</SelectItem>
            <SelectItem value="rgb(70, 70, 70)">中灰色</SelectItem>
            <SelectItem value="rgb(110, 110, 110)">浅灰色</SelectItem>
          </SelectContent>
        </Select>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="space-y-2">
          <Label>图像质量 ({qualityLevel})</Label>
          <Slider
            min={0}
            max={9}
            step={1}
            value={[qualityLevel]}
            onValueChange={([value]) => setQualityLevel(value)}
          />
        </div>
        <div className="space-y-2">
          <Label>压缩等级 ({compressionLevel})</Label>
          <Slider
            min={0}
            max={9}
            step={1}
            value={[compressionLevel]}
            onValueChange={([value]) => setCompressionLevel(value)}
          />
        </div>
      </TabsContent>

      <TabsContent value="controls" className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>触摸滚动</Label>
          <Switch
            checked={touchScrolling}
            onCheckedChange={setTouchScrolling}
          />
        </div>

        <Select value={performanceMode} onValueChange={setPerformanceMode}>
          <SelectTrigger>
            <SelectValue placeholder="性能模式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quality">高质量</SelectItem>
            <SelectItem value="balanced">平衡</SelectItem>
            <SelectItem value="speed">高速</SelectItem>
          </SelectContent>
        </Select>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>自动调整远程分辨率</Label>
          <Switch checked={resizeSession} onCheckedChange={setResizeSession} />
        </div>
        <div className="flex justify-between items-center">
          <Label>显示点状光标</Label>
          <Switch checked={showDotCursor} onCheckedChange={setShowDotCursor} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">键盘快捷键</span>
          <Switch
            checked={keyboardShortcuts}
            onCheckedChange={handleKeyboardShortcuts}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-sm">主题</span>
          <Select
            onValueChange={(value) => setTheme(value as "light" | "dark")}
            value={theme}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择主题" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">亮色</SelectItem>
              <SelectItem value="dark">暗色</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CustomOptions;
