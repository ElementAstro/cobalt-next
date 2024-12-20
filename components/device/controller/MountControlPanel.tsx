"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  StopCircle,
  Home,
  RefreshCw,
  Settings2,
  Power,
} from "lucide-react";
import { useMountControl } from "@/hooks/use-mount-control";
import { useMountStore } from "@/lib/store/device/telescope";

interface MountControlPanelProps {
  isLandscape: boolean;
}

export const MountControlPanel: React.FC<MountControlPanelProps> = ({
  isLandscape,
}) => {
  const [size, setSize] = useState({ width: 150, height: 240 });
  const [showSettings, setShowSettings] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const speedContentRef = useRef<HTMLButtonElement>(null);

  const {
    parkSwitch,
    trackSwitch,
    speedNum,
    handleMouseDownRA,
    handleMouseDownDEC,
    stop,
    mountPark,
    mountTrack,
    mountHome,
    mountSync,
    solveSync,
    mountSlewRateSwitch,
  } = useMountControl();

  const { isIdle, isConnected, nightMode } = useMountStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "mount-control-panel",
  });

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  useEffect(() => {
    // 根据横屏状态调整面板大小和位置
    if (isLandscape) {
      setSize({ width: 180, height: 320 });
      // 调整面板位置到右侧
      if (transform) {
        transform.x = window.innerWidth - size.width - 20;
        transform.y = 80;
      }
    } else {
      setSize({ width: 150, height: 240 });
    }
  }, [isLandscape]);

  return (
    <motion.div
      ref={setNodeRef}
      className={`
        fixed z-50 p-4 rounded-lg shadow-lg
        bg-background/80 dark:bg-slate-900/80 backdrop-blur
        border border-border
        ${isLandscape ? "right-4 top-20" : "bottom-20 right-4"}
      `}
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      drag
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 200,
        bottom: window.innerHeight - 300,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="aspect-square"
            onTouchStart={() => handleMouseDownRA("plus")}
            onTouchEnd={stop}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="aspect-square"
            onTouchStart={() => handleMouseDownDEC("plus")}
            onTouchEnd={stop}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="aspect-square"
            onTouchStart={() => handleMouseDownRA("minus")}
            onTouchEnd={stop}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={stop}
        >
          <StopCircle className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="aspect-square"
          onClick={mountSlewRateSwitch}
          ref={speedContentRef}
        >
          {speedNum}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="aspect-square"
          onClick={mountPark}
        >
          <img src="/images/Park.svg" height="25" alt="Park" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square"
          onClick={mountTrack}
        >
          <span>跟踪</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square"
          onClick={mountHome}
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square"
          onClick={mountSync}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square"
          onClick={solveSync}
        >
          <img src="/images/Solve.svg" height="20" alt="Solve" />
        </Button>

        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-xs ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "已连接" : "已断开"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
