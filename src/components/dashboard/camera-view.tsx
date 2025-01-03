"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Grid3X3,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useViewerStore } from "@/store/useDashboardStore";
import domtoimage from "dom-to-image";
import { LightBox } from "@/components/custom/lightbox";

interface CameraViewfinderProps {
  isShooting: boolean;
}

export default function CameraViewfinder({
  isShooting,
}: CameraViewfinderProps) {
  const {
    zoom,
    brightness,
    contrast,
    saturation,
    rotation,
    focusPoint,
    setZoom,
    setBrightness,
    setContrast,
    setSaturation,
    setRotation,
    setFocusPoint,
    images,
  } = useViewerStore();

  const viewfinderRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

  const handleZoomIn = useCallback(
    () => setZoom(Math.min(zoom + 0.1, 3)),
    [zoom, setZoom]
  );

  const handleZoomOut = useCallback(
    () => setZoom(Math.max(zoom - 0.1, 0.5)),
    [zoom, setZoom]
  );

  const handleRotate = useCallback(
    () => setRotation((rotation + 90) % 360),
    [rotation, setRotation]
  );

  const handleViewfinderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (viewfinderRef.current) {
        const rect = viewfinderRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setFocusPoint({ x, y });
      }
    },
    [setFocusPoint]
  );

  const handleStartCapture = async () => {
    try {
      setIsCapturing(true);

      if (!viewfinderRef.current) {
        throw new Error("Viewfinder not found");
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      canvas.width = viewfinderRef.current.clientWidth;
      canvas.height = viewfinderRef.current.clientHeight;

      const imgSrc = await domtoimage.toPng(viewfinderRef.current, {
        quality: 0.95,
        bgcolor: "#000000",
        style: {
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          filter: `
            brightness(${brightness}%)
            contrast(${contrast}%)
            saturate(${saturation}%)
          `,
        },
      });

      const img = new window.Image();
      img.src = imgSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `capture_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 0.9);
      link.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      settingsRef.current &&
      !settingsRef.current.contains(e.target as Node)
    ) {
      setShowSettings(false);
    }
  };

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  const openLightBox = () => {
    setIsLightBoxOpen(true);
  };

  const closeLightBox = () => {
    setIsLightBoxOpen(false);
  };

  return (
    <div className={`relative h-full`}>
      {/* Viewfinder Area */}
      <div
        ref={viewfinderRef}
        className="relative w-full h-[calc(100%-64px)] cursor-crosshair"
        onClick={handleViewfinderClick}
        style={{
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
        }}
      >
        {/* Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        )}

        {/* Focus Point Indicator */}
        <div
          className="absolute w-4 h-4 border-2 border-red-500 rounded-full"
          style={{
            left: `${focusPoint.x}%`,
            top: `${focusPoint.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Controls Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-4 p-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>缩小</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>放大</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Settings Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>切换网格</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleRotate}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>旋转90°</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Save Image Button */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleStartCapture}
                  disabled={isCapturing}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>保存图像</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* LightBox Button */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={openLightBox}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>查看相册</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Settings Panel */}
      <Collapsible open={showSettings} onOpenChange={setShowSettings}>
        <div ref={settingsRef}>
          <CollapsibleTrigger className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm p-2">
            设置
          </CollapsibleTrigger>
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm p-4 space-y-4"
              >
                <CollapsibleContent>
                  <div className="space-y-2">
                    <Label
                      htmlFor="brightness"
                      className="text-sm font-medium text-white"
                    >
                      亮度
                    </Label>
                    <Slider
                      id="brightness"
                      min={0}
                      max={200}
                      step={1}
                      value={[brightness]}
                      onValueChange={([value]) => setBrightness(value)}
                      className="w-48"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contrast"
                      className="text-sm font-medium text-white"
                    >
                      对比度
                    </Label>
                    <Slider
                      id="contrast"
                      min={0}
                      max={200}
                      step={1}
                      value={[contrast]}
                      onValueChange={([value]) => setContrast(value)}
                      className="w-48"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="saturation"
                      className="text-sm font-medium text-white"
                    >
                      饱和度
                    </Label>
                    <Slider
                      id="saturation"
                      min={0}
                      max={200}
                      step={1}
                      value={[saturation]}
                      onValueChange={([value]) => setSaturation(value)}
                      className="w-48"
                    />
                  </div>
                </CollapsibleContent>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Collapsible>

      {/* LightBox Component */}
      <AnimatePresence>
        {isLightBoxOpen && (
          <LightBox
            images={images.map((src) => ({
              src,
              alt: "Captured image",
              width: 800,
              height: 600,
            }))}
            initialIndex={0}
            onClose={closeLightBox}
            showThumbnails={true}
            enableZoom={true}
            enableSwipe={true}
            backgroundColor="rgba(0, 0, 0, 0.9)"
            closeOnClickOutside={true}
            autoPlayInterval={0}
            enableFullscreen={true}
            enableDownload={true}
            enableSharing={true}
            showLoadingIndicator={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
