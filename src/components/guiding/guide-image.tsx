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

interface Shape {
  type: "circle" | "square";
  position: { x: number; y: number };
  radius?: number; // 仅适用于圆形
  size?: number; // 仅适用于方形
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
  shapes?: Shape[]; // 新增
  showCrosshair?: boolean; // 新增
  height?: string | number; // 新增
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [filter, setFilter] = useState("none");

  // 新增用于缩放的状态
  const [isPinching, setIsPinching] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [lastScale, setLastScale] = useState(1);

  const drawImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    ctx.save();

    // 清除画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 应用变换
    ctx.translate(
      offset.x + ctx.canvas.width / 2,
      offset.y + ctx.canvas.height / 2
    );
    ctx.scale(
      scale * (flip.horizontal ? -1 : 1),
      scale * (flip.vertical ? -1 : 1)
    );
    ctx.rotate((rotation * Math.PI) / 180);

    // 应用亮度和对比度
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${filter}`;

    // 绘制图像
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // 绘制网格
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

    // 绘制形状
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

    // 绘制十字准星
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        drawImage(ctx, img);
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
    setScale((prevScale) => Math.max(0.1, Math.min(10, prevScale + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 修改触摸支持，添加双指缩放
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
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (isPinching && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance / initialPinchDistance;
      setScale(Math.max(0.1, Math.min(10, lastScale * delta)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setFilter("none");
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "guide-image.png";
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex items-center justify-center h-full"
      style={{ height }}
    >
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
