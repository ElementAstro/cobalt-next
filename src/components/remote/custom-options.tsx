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
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";

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
  inputMode: "touch" | "trackpad" | "mouse";
  setInputMode: (mode: "touch" | "trackpad" | "mouse") => void;
  gestureEnabled: boolean;
  setGestureEnabled: (enabled: boolean) => void;
  touchSensitivity: number;
  setTouchSensitivity: (value: number) => void;
  autoReconnect: boolean;
  setAutoReconnect: (enabled: boolean) => void;
  reconnectDelay: number;
  setReconnectDelay: (value: number) => void;
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
  inputMode,
  setInputMode,
  gestureEnabled,
  setGestureEnabled,
  touchSensitivity,
  setTouchSensitivity,
  autoReconnect,
  setAutoReconnect,
  reconnectDelay,
  setReconnectDelay,
}) => {
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const tabsAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
  };

  return (
    <motion.div
      className={`w-full ${isLandscape ? "landscape-mode" : ""}`}
      {...tabsAnimation}
    >
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
            <Switch
              checked={scaleViewport}
              onCheckedChange={setScaleViewport}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>裁剪视口</Label>
            <Switch checked={clipViewport} onCheckedChange={setClipViewport} />
          </div>
          {clipViewport && (
            <div className="flex justify-between items-center">
              <Label>拖动视口</Label>
              <Switch
                checked={dragViewport}
                onCheckedChange={setDragViewport}
              />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mt-4"
          >
            <Select onValueChange={setInputMode} value={inputMode}>
              <SelectTrigger>
                <SelectValue placeholder="输入模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="touch">触摸</SelectItem>
                <SelectItem value="trackpad">触控板</SelectItem>
                <SelectItem value="mouse">鼠标</SelectItem>
              </SelectContent>
            </Select>

            {inputMode === "touch" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>启用手势</Label>
                  <Switch
                    checked={gestureEnabled}
                    onCheckedChange={setGestureEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>触摸灵敏度 ({touchSensitivity})</Label>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[touchSensitivity]}
                    onValueChange={([value]) => setTouchSensitivity(value)}
                  />
                </div>
              </div>
            )}
          </motion.div>
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
            <Switch
              checked={resizeSession}
              onCheckedChange={setResizeSession}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label>显示点状光标</Label>
            <Switch
              checked={showDotCursor}
              onCheckedChange={setShowDotCursor}
            />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mt-4"
          >
            <div className="flex justify-between items-center">
              <Label>自动重连</Label>
              <Switch
                checked={autoReconnect}
                onCheckedChange={setAutoReconnect}
              />
            </div>
            {autoReconnect && (
              <div className="space-y-2">
                <Label>重连延迟 (秒)</Label>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={[reconnectDelay]}
                  onValueChange={([value]) => setReconnectDelay(value)}
                />
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CustomOptions;
