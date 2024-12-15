"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding/guiding";
import { Button } from "@/components/ui/button";

interface GuideImageProps {
  imageUrl: string | null;
  colors: CustomColors;
  crosshairSize?: number;
  crosshairThickness?: number;
  showGrid?: boolean;
  gridSize?: number;
  brightness?: number;
  contrast?: number;
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
}: GuideImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    ctx.save();

    // 清除画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 应用变换
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // 应用亮度和对比度
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // 绘制图像
    ctx.drawImage(img, 0, 0);
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

    // 绘制十字准星
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        drawImage(ctx, img);
      };
    } else {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colors.text;
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "No guide image available",
        canvas.width / 2,
        canvas.height / 2
      );
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

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="max-w-full max-h-full border rounded cursor-move"
        style={{ borderColor: colors.primary }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <Button
        onClick={resetView}
        className="absolute bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded"
        style={{ backgroundColor: colors.primary }}
      >
        Reset View
      </Button>
    </motion.div>
  );
}
