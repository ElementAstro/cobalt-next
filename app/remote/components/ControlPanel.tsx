"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Clipboard, KeyRound } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
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
          <Switch checked={viewOnly} onCheckedChange={handleViewOnlyChange} />
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
    </div>
  );
};

export default ControlPanel;
