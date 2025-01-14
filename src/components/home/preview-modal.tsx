"use client";

import React, { useEffect, useState, useRef } from "react";
import { Site } from "@/types/home";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  useAnimation,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomIframe } from "./iframe";
import {
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  X,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  MonitorCheck,
  Camera,
  RotateCw,
  RotateCcw,
  Wifi,
  WifiOff,
  Gauge,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site | null;
  sizePreset?: "sm" | "md" | "lg" | "xl" | "full";
  animationPreset?: "slide-up" | "fade" | "scale" | "rotate";
  showControls?: boolean;
  enableKeyboard?: boolean;
  loadingProgress?: number;
  defaultDevice?: "mobile" | "tablet" | "desktop";
  defaultOrientation?: "portrait" | "landscape";
  enableScreenshot?: boolean;
  enableNetworkThrottle?: boolean;
}

export default function PreviewModal({
  isOpen,
  onClose,
  site,
  sizePreset = "md",
  animationPreset = "slide-up",
  showControls = true,
  enableKeyboard = true,
  loadingProgress,
  defaultDevice = "desktop",
  defaultOrientation = "landscape",
  enableScreenshot = true,
  enableNetworkThrottle = false,
}: PreviewModalProps) {
  if (!isOpen || !site) return null;

  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    defaultDevice
  );
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    defaultOrientation
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState(10);
  const [networkThrottle, setNetworkThrottle] = useState<
    "none" | "slow-3g" | "fast-3g" | "4g"
  >("none");
  const [isRotating, setIsRotating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0.3, 1, 0.3]);
  const springY = useSpring(y, {
    stiffness: 300,
    damping: 30,
  });

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.y) > 100) {
      await controls.start({
        y: info.offset.y > 0 ? 200 : -200,
        opacity: 0,
        transition: { duration: 0.2 },
      });
      onClose();
    } else {
      controls.start({ y: 0, opacity: 1 });
    }
  };

  const captureScreenshot = async () => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.width = iframe.offsetWidth;
      canvas.height = iframe.offsetHeight;

      // Create temporary image element to draw iframe content
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = iframe.src;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${site.name}-preview.png`;
      link.href = image;
      link.click();

      toast({
        title: "截图保存成功",
        description: `已保存为 ${site.name}-preview.png`,
      });
    } catch (error) {
      toast({
        title: "截图失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const simulateNetwork = (type: "none" | "slow-3g" | "fast-3g" | "4g") => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const connection = iframe.contentWindow?.navigator as any;

    if (connection?.connection) {
      switch (type) {
        case "slow-3g":
          connection.downlink = 0.5;
          connection.rtt = 2000;
          break;
        case "fast-3g":
          connection.downlink = 1.5;
          connection.rtt = 1000;
          break;
        case "4g":
          connection.downlink = 4;
          connection.rtt = 150;
          break;
        default:
          connection.downlink = 10;
          connection.rtt = 50;
      }
    }

    setNetworkThrottle(type);
  };

  const rotateDevice = () => {
    setIsRotating(true);
    setOrientation((prev) => (prev === "portrait" ? "landscape" : "portrait"));
    setTimeout(() => setIsRotating(false), 500);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      await controls.start({
        scale: 1.05,
        transition: { type: "spring", stiffness: 300 },
      });
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      const newZoom = direction === "in" ? prev + 0.1 : prev - 0.1;
      const clampedZoom = Math.min(Math.max(newZoom, 0.5), 2);

      controls.start({
        scale: clampedZoom,
        transition: { type: "spring", stiffness: 300 },
      });

      return clampedZoom;
    });
  };

  const handleRefresh = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.src = iframe.src;
      controls.start({
        rotate: [0, 10, -10, 0],
        transition: { duration: 0.3 },
      });
    }
  };

  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "f") toggleFullscreen();
      if (e.key === "+") handleZoom("in");
      if (e.key === "-") handleZoom("out");
      if (e.key === "r") handleRefresh();
      if (e.key === "s" && enableScreenshot) captureScreenshot();
      if (e.key === "t" && enableNetworkThrottle) simulateNetwork("slow-3g");
      if (e.key === "o") rotateDevice();
      if (e.key === "b") setBlurIntensity((prev) => Math.min(prev + 5, 50));
      if (e.key === "n") setBlurIntensity((prev) => Math.max(prev - 5, 0));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, onClose, enableScreenshot, enableNetworkThrottle]);

  const deviceDimensions = {
    mobile: {
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 },
    },
    tablet: {
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1024, height: 768 },
    },
    desktop: {
      portrait: { width: "100%", height: "100%" },
      landscape: { width: "100%", height: "100%" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${blurIntensity / 100})`,
        backdropFilter: `blur(${blurIntensity}px)`,
      }}
    >
      <motion.div
        className="fixed inset-0"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y: springY, opacity }}
      />
      <motion.div
        initial={{
          scale: animationPreset === "scale" ? 0.9 : 1,
          opacity: 0,
          y: animationPreset === "slide-up" ? 50 : 0,
          rotate: animationPreset === "rotate" ? 90 : 0,
        }}
        animate={controls}
        exit={{
          scale: animationPreset === "scale" ? 0.9 : 1,
          opacity: 0,
          y: animationPreset === "slide-up" ? 50 : 0,
          rotate: animationPreset === "rotate" ? 90 : 0,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          rotate: animationPreset === "rotate" ? { duration: 0.5 } : undefined,
        }}
        className={cn(
          "bg-indigo-900/90 dark:bg-gray-900/90 rounded-lg shadow-2xl overflow-hidden relative",
          {
            "w-11/12 md:w-1/2 max-h-[70vh]":
              sizePreset === "sm" && deviceType === "desktop",
            "w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh]":
              sizePreset === "md" && deviceType === "desktop",
            "w-11/12 md:w-5/6 lg:w-4/5 max-h-[90vh]":
              sizePreset === "lg" && deviceType === "desktop",
            "w-11/12 md:w-[90%] max-h-[95vh]":
              sizePreset === "xl" && deviceType === "desktop",
            "w-screen h-screen": sizePreset === "full" || isFullscreen,
            "w-[375px] h-[667px]":
              deviceType === "mobile" && orientation === "portrait",
            "w-[667px] h-[375px]":
              deviceType === "mobile" && orientation === "landscape",
            "w-[768px] h-[1024px]":
              deviceType === "tablet" && orientation === "portrait",
            "w-[1024px] h-[768px]":
              deviceType === "tablet" && orientation === "landscape",
          }
        )}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">
            {site.name} 预览
          </h2>
          <div className="flex items-center gap-2">
            {showControls && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-gray-100 hover:bg-gray-800/50"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleZoom("in")}
                  className="text-gray-100 hover:bg-gray-800/50"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleZoom("out")}
                  className="text-gray-100 hover:bg-gray-800/50"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="text-gray-100 hover:bg-gray-800/50"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-100 hover:bg-gray-800/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {loadingProgress !== undefined && (
          <div className="px-4">
            <Progress value={loadingProgress} className="h-2" />
          </div>
        )}
        <div
          className="p-4 h-[calc(90vh-8rem)] overflow-hidden"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
          }}
        >
          <CustomIframe
            src={site.url}
            title={`${site.name} 预览`}
            className="w-full h-full rounded-md border border-indigo-600/30"
            allowFullScreen={true}
            height="100%"
            loadingComponent={
              <div className="flex items-center justify-center space-x-2 h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>加载中...</span>
              </div>
            }
            errorComponent={
              <div className="flex items-center justify-center text-red-500 h-full">
                加载失败，请检查网址是否正确或稍后重试
              </div>
            }
            allowScripts={true}
            timeout={15000}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
