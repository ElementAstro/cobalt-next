"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Clipboard,
  KeyRound,
  Power,
  PowerOff,
  RefreshCw,
  Activity,
  Command,
  Keyboard,
  Monitor,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Zap,
  Settings,
  Maximize,
  Minimize,
  RotateCcw,
  Network,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

interface ControlPanelProps {
  isConnected: boolean;
  toggleFullscreen: () => void;
  connectToVNC: () => void;
  disconnectFromVNC: () => void;
  clipboardSync: boolean;
  handleClipboardSync: (checked: boolean) => void;
  viewOnly: boolean;
  handleViewOnlyChange: (checked: boolean) => void;
  colorDepth: string;
  handleColorDepthChange: (value: string) => void;
  hasPowerCapability: boolean;
  onShutdown: () => void;
  onReboot: () => void;
  onReset: () => void;
  orientation?: "horizontal" | "vertical";
  enableAnimation: boolean;
  showPerformanceStats: boolean;
  onTogglePerformanceStats: (checked: boolean) => void;
  customKeys: { label: string; keys: string[] }[];
  onSendCustomKeys: (keys: string[]) => void;
  layout: "compact" | "full";
  latency: number;
  frameRate: number;
  bandwidth: number;
  connectionQuality: "good" | "fair" | "poor";
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isConnected,
  toggleFullscreen,
  connectToVNC,
  disconnectFromVNC,
  clipboardSync,
  handleClipboardSync,
  viewOnly,
  handleViewOnlyChange,
  colorDepth,
  handleColorDepthChange,
  hasPowerCapability,
  onShutdown,
  onReboot,
  onReset,
  orientation = "vertical",
  enableAnimation = true,
  showPerformanceStats,
  onTogglePerformanceStats,
  customKeys = [],
  onSendCustomKeys,
  layout = "full",
  latency,
  frameRate,
  bandwidth,
  connectionQuality,
}) => {
  const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });

  const panelAnimation = enableAnimation
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
      }
    : {};

  const statsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <motion.div
      {...panelAnimation}
      className={cn(
        "control-panel",
        isLandscape ? "landscape" : "portrait",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "w-full",
        layout === "compact" ? "p-2" : "p-4"
      )}
    >
      <div className="flex flex-col space-y-4 min-w-[200px]">
        <div className="flex flex-col space-y-2">
          {!isConnected ? (
            <Button onClick={connectToVNC} className="w-full">
              连接
            </Button>
          ) : (
            <Button
              onClick={disconnectFromVNC}
              variant="destructive"
              className="w-full"
            >
              断开连接
            </Button>
          )}
          <Button onClick={toggleFullscreen} className="w-full">
            <Expand className="h-4 w-4 mr-2" />
            {isConnected ? "退出全屏" : "全屏"}
          </Button>
        </div>
      </div>

      <Separator
        className={orientation === "horizontal" ? "h-auto" : "w-auto"}
      />

      <Collapsible defaultOpen className="flex-1">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label>高级控制</Label>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {hasPowerCapability && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Power className="h-4 w-4 mr-2" />
                  电源控制
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem onClick={onShutdown}>
                  <PowerOff className="h-4 w-4 mr-2" />
                  关机
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onReboot}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重启
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onReset}>
                  <Power className="h-4 w-4 mr-2" />
                  强制重置
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clipboard className="h-4 w-4" />
                <span className="text-sm">剪贴板</span>
              </div>
              <Switch
                checked={clipboardSync}
                onCheckedChange={handleClipboardSync}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-4 w-4" />
                <span className="text-sm">只读</span>
              </div>
              <Switch
                checked={viewOnly}
                onCheckedChange={handleViewOnlyChange}
              />
            </div>
            <Select onValueChange={handleColorDepthChange} value={colorDepth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="颜色深度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24-bit</SelectItem>
                <SelectItem value="16">16-bit</SelectItem>
                <SelectItem value="8">8-bit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">性能监控</span>
            </div>
            <Switch
              checked={showPerformanceStats}
              onCheckedChange={onTogglePerformanceStats}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {customKeys.map((key, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSendCustomKeys(key.keys)}
              >
                <Keyboard className="h-4 w-4 mr-2" />
                {key.label}
              </Button>
            ))}
          </div>

          <motion.div
            initial={false}
            animate={{ height: showPerformanceStats ? "auto" : 0 }}
            className="overflow-hidden"
          >
            {/* 性能监控图表组件 */}
          </motion.div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Command className="h-4 w-4 mr-2" />
              Ctrl+Alt+Del
            </Button>
            <Button variant="outline" size="sm">
              <Keyboard className="h-4 w-4 mr-2" />
              发送组合键
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendCustomKeys(["Ctrl", "Alt", "Del"])}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重启系统
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendCustomKeys(["Alt", "F4"])}
            >
              <Power className="h-4 w-4 mr-2" />
              关闭程序
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span className="text-sm">
              连接质量: {connectionQuality === "good" ? "良好" : connectionQuality === "fair" ? "一般" : "差"}
            </span>
          </div>

          <motion.div
            variants={statsVariants}
            initial="hidden"
            animate={showPerformanceStats ? "visible" : "hidden"}
            className="performance-stats"
          >
            <div className="stats-grid">
              <div className="stat-item">
                <Label>延迟</Label>
                <p
                  className={cn(
                    "stat-value",
                    latency > 100 ? "text-red-500" : "text-green-500"
                  )}
                >
                  {latency}ms
                </p>
              </div>
              <div className="stat-item">
                <Label>帧率</Label>
                <p className="stat-value">{frameRate} FPS</p>
              </div>
              <div className="stat-item">
                <Label>带宽</Label>
                <p className="stat-value">
                  {(bandwidth / 1024 / 1024).toFixed(2)} Mbps
                </p>
              </div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default ControlPanel;
