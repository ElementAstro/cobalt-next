"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brush,
  Save,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Shape {
  type: "circle" | "square";
  position: { x: number; y: number };
  radius?: number;
  size?: number;
  color: string;
}

interface GuideImageProps {
  imageUrl: string | null;
  colors: CustomColors;
  crosshairSize?: number;
  crosshairThickness?: number;
  showGrid?: boolean;
  gridSize?: number;
  brightness?: number;
  contrast?: number;
  shapes?: Shape[];
  showCrosshair?: boolean;
  height?: string | number;
}

export function GuideImage({
  imageUrl,
  colors,
  crosshairSize = 10,
  crosshairThickness = 2,
  showGrid = false,
  gridSize = 50,
  brightness = 100,
  contrast = 100,
  shapes = [],
  showCrosshair = true,
  height = "300px",
}: GuideImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [lastScale, setLastScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [filter, setFilter] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationHistory, setOperationHistory] = useState<
    Array<{
      scale: number;
      offset: { x: number; y: number };
      rotation: number;
      flip: { horizontal: boolean; vertical: boolean };
    }>
  >([]);

  const drawImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    try {
      ctx.save();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.translate(
        offset.x + ctx.canvas.width / 2,
        offset.y + ctx.canvas.height / 2
      );
      ctx.scale(
        scale * (flip.horizontal ? -1 : 1),
        scale * (flip.vertical ? -1 : 1)
      );
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${filter}`;
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      if (showGrid) {
        ctx.strokeStyle = `${colors.accent}40`;
        ctx.lineWidth = 0.5;
        for (let x = 0; x < ctx.canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, ctx.canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < ctx.canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(ctx.canvas.width, y);
          ctx.stroke();
        }
      }

      shapes.forEach((shape) => {
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1;
        if (shape.type === "circle" && shape.radius) {
          ctx.beginPath();
          ctx.arc(
            shape.position.x,
            shape.position.y,
            shape.radius,
            0,
            2 * Math.PI
          );
          ctx.fill();
        } else if (shape.type === "square" && shape.size) {
          ctx.fillRect(
            shape.position.x - shape.size / 2,
            shape.position.y - shape.size / 2,
            shape.size,
            shape.size
          );
        }
      });

      if (showCrosshair) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = crosshairThickness;
        ctx.beginPath();
        ctx.moveTo(centerX - crosshairSize, centerY);
        ctx.lineTo(centerX + crosshairSize, centerY);
        ctx.moveTo(centerX, centerY - crosshairSize);
        ctx.lineTo(centerX, centerY + crosshairSize);
        ctx.stroke();
      }
    } catch (err) {
      setError("绘制图像时出错");
      console.error("绘制错误:", err);
    }
  };

  const validateImage = (url: string): boolean => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".tiff", ".fits"];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
      setError("不支持的图像格式");
      return false;
    }

    // 实际大小检查需要在加载时进行
    return true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (imageUrl) {
      if (!validateImage(imageUrl)) return;

      setIsLoading(true);
      setError(null);

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = () => {
        if (img.width * img.height > 10000 * 10000) {
          setError("图像分辨率过高");
          setIsLoading(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        drawImage(ctx, img);
        setIsLoading(false);
      };

      img.onerror = () => {
        setError("加载图像失败");
        setIsLoading(false);
      };
    }
  }, [
    imageUrl,
    colors,
    scale,
    offset,
    showGrid,
    gridSize,
    brightness,
    contrast,
    crosshairSize,
    crosshairThickness,
    rotation,
    flip,
    filter,
    shapes,
    showCrosshair,
  ]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(0.1, Math.min(10, scale + delta));
    setScale(newScale);
    addToHistory();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setOffset(newOffset);
      addToHistory();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    } else if (e.touches.length === 2) {
      setIsPinching(true);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
      setLastScale(scale);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && !isPinching) {
      const newOffset = {
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      };
      setOffset(newOffset);
      addToHistory();
    } else if (isPinching && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance / initialPinchDistance;
      const newScale = Math.max(0.1, Math.min(10, lastScale * delta));
      setScale(newScale);
      addToHistory();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
  };

  const addToHistory = () => {
    setOperationHistory((prev) => [
      ...prev.slice(-9), // 保留最后10个操作
      {
        scale,
        offset,
        rotation,
        flip,
      },
    ]);
  };

  const undoLastOperation = () => {
    if (operationHistory.length > 0) {
      const lastState = operationHistory[operationHistory.length - 1];
      setScale(lastState.scale);
      setOffset(lastState.offset);
      setRotation(lastState.rotation);
      setFlip(lastState.flip);
      setOperationHistory((prev) => prev.slice(0, -1));
    } else {
      toast({
        title: "没有可撤销的操作",
        variant: "destructive",
      });
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast({
        title: "保存失败",
        description: "无法获取画布",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "guide-image.png";
      link.click();
      toast({
        title: "保存成功",
        description: "图像已保存为PNG格式",
      });
    } catch (err) {
      toast({
        title: "保存失败",
        description: "保存图像时出错",
        variant: "destructive",
      });
      console.error("保存错误:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex items-center justify-center h-full"
      style={{ height }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-destructive p-4 rounded">
            <p className="text-destructive-foreground">{error}</p>
          </div>
        </div>
      )}

      {imageUrl ? (
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full border rounded cursor-move"
          style={{ borderColor: colors.primary }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src="/placeholder.png"
            alt="占位图像"
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
        </div>
      )}
    </motion.div>
  );
}
