"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/store/useGuidingStore";

export default function CalibrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const {
    showGrid,
    lineLength,
    showAnimation,
    setLineLength,
    autoRotate,
    rotationSpeed,
    zoomLevel,
  } = useGuidingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rotation = 0;
    let animationFrameId: number;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.save();

      // 应用缩放和平移
      ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
      ctx.scale(zoomLevel, zoomLevel);

      // 应用旋转
      if (autoRotate) {
        rotation += rotationSpeed * 0.01;
      }
      ctx.rotate(rotation);

      // 清除画布
      ctx.clearRect(
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      // 渐变背景
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#1f2937");
      gradient.addColorStop(1, "#111827");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制坐标系
      ctx.strokeStyle = "#4b5563";
      ctx.lineWidth = 1;

      // 轴线
      ctx.beginPath();
      ctx.moveTo(0, 150);
      ctx.lineTo(300, 150);
      ctx.moveTo(150, 0);
      ctx.lineTo(150, 300);
      ctx.stroke();

      // 网格线
      if (showGrid) {
        ctx.strokeStyle = "#374151";
        for (let i = 30; i < 300; i += 30) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 300);
          ctx.moveTo(0, i);
          ctx.lineTo(300, i);
          ctx.stroke();
        }
      }

      // 校准线
      // RA线（红色）
      ctx.strokeStyle = "#f87171";
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(150 + lineLength, 150 - lineLength / 2);
      ctx.stroke();

      // DEC线（蓝色）
      ctx.strokeStyle = "#60a5fa";
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(150 - lineLength / 2, 150 + lineLength);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    showGrid,
    lineLength,
    showAnimation,
    autoRotate,
    rotationSpeed,
    zoomLevel,
    offset,
  ]);

  // 添加拖拽事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full aspect-square bg-gray-900 border border-gray-700 shadow-inner rounded-lg cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
