"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGuidingStore } from "@/store/useGuidingStore";
import { Gauge, Move, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CalibrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dpr, setDpr] = useState(1);
  const [frameTime, setFrameTime] = useState(0);
  const [showLabels, setShowLabels] = useState(true);

  const {
    showGrid,
    lineLength,
    showAnimation,
    setLineLength,
    autoRotate,
    rotationSpeed,
    zoomLevel,
  } = useGuidingStore().calibration;

  // 初始化设备像素比
  useEffect(() => {
    setDpr(window.devicePixelRatio || 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // 创建离屏canvas用于双缓冲
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return;

    let rotation = 0;
    let animationFrameId: number;
    let lastTime = performance.now();

    const draw = () => {
      const startTime = performance.now();

      // 设置离屏canvas尺寸
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      offscreenCanvas.width = width * dpr;
      offscreenCanvas.height = height * dpr;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // 缩放离屏上下文
      offscreenCtx.scale(dpr, dpr);
      offscreenCtx.clearRect(0, 0, width, height);

      // 应用变换
      offscreenCtx.save();
      offscreenCtx.translate(width / 2 + offset.x, height / 2 + offset.y);
      offscreenCtx.scale(zoomLevel, zoomLevel);

      // 应用旋转
      if (autoRotate) {
        rotation += rotationSpeed * 0.01;
      }
      offscreenCtx.rotate(rotation);

      // 绘制背景
      const gradient = offscreenCtx.createRadialGradient(
        0, 0, 50,
        0, 0, Math.max(width, height)
      );
      gradient.addColorStop(0, "#1f2937");
      gradient.addColorStop(1, "#111827");
      offscreenCtx.fillStyle = gradient;
      offscreenCtx.fillRect(-width / 2, -height / 2, width, height);

      // 绘制坐标系
      offscreenCtx.strokeStyle = "#4b5563";
      offscreenCtx.lineWidth = 1;
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(-width / 2, 0);
      offscreenCtx.lineTo(width / 2, 0);
      offscreenCtx.moveTo(0, -height / 2);
      offscreenCtx.lineTo(0, height / 2);
      offscreenCtx.stroke();

      // 绘制坐标轴标签
      if (showLabels) {
        offscreenCtx.fillStyle = "#6b7280";
        offscreenCtx.font = "10px Arial";
        offscreenCtx.textAlign = "center";
        offscreenCtx.textBaseline = "middle";
        
        // X轴
        offscreenCtx.fillText("RA", width / 2 - 30, 10);
        offscreenCtx.fillText("+", width / 2 - 40, 10);
        
        // Y轴
        offscreenCtx.save();
        offscreenCtx.rotate(-Math.PI / 2);
        offscreenCtx.fillText("DEC", -height / 2 + 30, 10);
        offscreenCtx.fillText("+", -height / 2 + 40, 10);
        offscreenCtx.restore();
      }

      // 绘制网格
      if (showGrid) {
        offscreenCtx.strokeStyle = "#374151";
        const gridSize = 30;
        for (let i = -width / 2; i < width / 2; i += gridSize) {
          offscreenCtx.beginPath();
          offscreenCtx.moveTo(i, -height / 2);
          offscreenCtx.lineTo(i, height / 2);
          offscreenCtx.stroke();
        }
        for (let i = -height / 2; i < height / 2; i += gridSize) {
          offscreenCtx.beginPath();
          offscreenCtx.moveTo(-width / 2, i);
          offscreenCtx.lineTo(width / 2, i);
          offscreenCtx.stroke();
        }
      }

      // 绘制校准线
      offscreenCtx.strokeStyle = "#f87171";
      offscreenCtx.lineWidth = 2;
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(0, 0);
      offscreenCtx.lineTo(lineLength, -lineLength / 2);
      offscreenCtx.stroke();

      offscreenCtx.strokeStyle = "#60a5fa";
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(0, 0);
      offscreenCtx.lineTo(-lineLength / 2, lineLength);
      offscreenCtx.stroke();

      offscreenCtx.restore();

      // 将离屏内容绘制到主canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0);

      // 计算帧时间
      const currentTime = performance.now();
      setFrameTime(currentTime - lastTime);
      lastTime = currentTime;

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
    dpr,
    showLabels,
  ]);

  // 处理指针事件
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.isPrimary) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !e.isPrimary) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.isPrimary) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="relative w-full aspect-square">
      <motion.canvas
        ref={canvasRef}
        className="w-full h-full bg-gray-900 border border-gray-700 shadow-inner rounded-lg cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          touchAction: "none",
          imageRendering: "crisp-edges",
        }}
      />
      
      <TooltipProvider>
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
            FPS: {frameTime > 0 ? Math.round(1000 / frameTime) : 0}
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setOffset({ x: 0, y: 0 })}
              >
                <Move className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>重置位置</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
