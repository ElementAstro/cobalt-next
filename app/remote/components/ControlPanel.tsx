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
}) => {
  return (
    <div
      className={cn(
        "flex gap-4",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "w-full"
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
            <Switch />
          </div>

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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ControlPanel;
