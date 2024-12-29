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
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useViewerStore } from "@/store/useDashboardStore";
import domtoimage from "dom-to-image";

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
  } = useViewerStore();

  const viewfinderRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

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

      const img = new Image();
      try {
        img.src = await domtoimage.toPng(viewfinderRef.current, {
          quality: 0.95,
          bgcolor: isDarkMode ? "#000000" : "#ffffff",
          style: {
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            filter: `
              brightness(${brightness}%)
              contrast(${contrast}%)
              saturate(${saturation}%)
            `,
          },
        });

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        ctx.drawImage(img, 0, 0);

        const link = document.createElement("a");
        link.download = `capture_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png", 0.9);
        link.click();
      } catch (error) {
        console.error("Capture failed:", error);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`relative h-full ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
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
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

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
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          {/* Capture Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className="rounded-full w-16 h-16"
                onClick={handleStartCapture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Take Photo</TooltipContent>
          </Tooltip>

          {/* Settings Controls */}
          <div className="flex items-center gap-2">
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
              <TooltipContent>Toggle Grid</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleRotate}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate 90°</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brightness</label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[brightness]}
              onValueChange={([value]) => setBrightness(value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contrast</label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[contrast]}
              onValueChange={([value]) => setContrast(value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Saturation</label>
            <Slider
              min={0}
              max={200}
              step={1}
              value={[saturation]}
              onValueChange={([value]) => setSaturation(value)}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
