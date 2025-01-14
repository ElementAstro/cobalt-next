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
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
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
      <div className="flex flex-col space-y-4 min-w-[200px] bg-background/50 backdrop-blur-md rounded-lg p-4 border">
        <div className="flex flex-col space-y-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {!isConnected ? (
              <Button
                onClick={connectToVNC}
                className="w-full hover:shadow-lg transition-shadow"
              >
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  连接
                </motion.span>
              </Button>
            ) : (
              <Button
                onClick={disconnectFromVNC}
                variant="destructive"
                className="w-full hover:shadow-lg transition-shadow"
              >
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  断开连接
                </motion.span>
              </Button>
            )}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={toggleFullscreen}
              className="w-full hover:shadow-lg transition-shadow"
            >
              <Expand className="h-4 w-4 mr-2" />
              {isConnected ? "退出全屏" : "全屏"}
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Separator
          className={cn(
            orientation === "horizontal" ? "h-auto" : "w-auto",
            "my-4"
          )}
        />
      </motion.div>

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

          <motion.div
            className="flex justify-between items-center p-2 rounded-lg bg-background/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">性能监控</span>
            </div>
            <Switch
              checked={showPerformanceStats}
              onCheckedChange={onTogglePerformanceStats}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>

          <motion.div
            initial={false}
            animate={{ height: showPerformanceStats ? "auto" : 0 }}
            className="overflow-hidden"
          >
            {/* 性能监控图表组件 */}
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="outline" size="sm">
              <Command className="h-4 w-4 mr-2" />
              Ctrl+Alt+Del
            </Button>
            <Button variant="outline" size="sm">
              <Keyboard className="h-4 w-4 mr-2" />
              发送组合键
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
          </motion.div>

          <motion.div
            className="flex items-center space-x-2 p-2 rounded-lg bg-background/20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Network className="h-4 w-4" />
            <span className="text-sm">
              连接质量:
              <span
                className={cn(
                  "ml-1 font-medium",
                  connectionQuality === "good"
                    ? "text-green-500"
                    : connectionQuality === "fair"
                    ? "text-yellow-500"
                    : "text-red-500"
                )}
              >
                {connectionQuality === "good"
                  ? "良好"
                  : connectionQuality === "fair"
                  ? "一般"
                  : "差"}
              </span>
            </span>
          </motion.div>

          <motion.div
            variants={statsVariants}
            initial="hidden"
            animate={showPerformanceStats ? "visible" : "hidden"}
            className="performance-stats bg-background/20 p-4 rounded-lg"
          >
            <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="stat-item p-3 rounded-lg bg-background/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label className="text-sm font-medium">延迟</Label>
                <p
                  className={cn(
                    "stat-value text-lg font-semibold mt-1",
                    latency > 100 ? "text-red-500" : "text-green-500"
                  )}
                >
                  {latency}ms
                </p>
              </motion.div>
              <motion.div
                className="stat-item p-3 rounded-lg bg-background/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label className="text-sm font-medium">帧率</Label>
                <p className="stat-value text-lg font-semibold mt-1">
                  {frameRate} FPS
                </p>
              </motion.div>
              <motion.div
                className="stat-item p-3 rounded-lg bg-background/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Label className="text-sm font-medium">带宽</Label>
                <p className="stat-value text-lg font-semibold mt-1">
                  {(bandwidth / 1024 / 1024).toFixed(2)} Mbps
                </p>
              </motion.div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default ControlPanel;
