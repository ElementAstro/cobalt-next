"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding/guiding";

interface GuideViewProps {
  targetX: number;
  targetY: number;
  colors: CustomColors;
  animationSpeed: number;
  reticleStyle?: "cross" | "circle" | "diamond";
  showDistance?: boolean;
  showGuidelines?: boolean;
  pulseEffect?: boolean;
  size?: number;
  thickness?: number;
}

export function GuideView({
  targetX,
  targetY,
  colors,
  animationSpeed,
  reticleStyle = "cross",
  showDistance = true,
  showGuidelines = false,
  pulseEffect = true,
  size = 20,
  thickness = 2,
}: GuideViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scale, setScale] = useState(1);

  const drawReticle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      currentSize: number
    ) => {
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = thickness;

      switch (reticleStyle) {
        case "circle":
          ctx.beginPath();
          ctx.arc(x, y, currentSize, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case "diamond":
          ctx.beginPath();
          ctx.moveTo(x, y - currentSize);
          ctx.lineTo(x + currentSize, y);
          ctx.lineTo(x, y + currentSize);
          ctx.lineTo(x - currentSize, y);
          ctx.closePath();
          ctx.stroke();
          break;
        default:
          ctx.beginPath();
          ctx.moveTo(x - currentSize, y);
          ctx.lineTo(x + currentSize, y);
          ctx.moveTo(x, y - currentSize);
          ctx.lineTo(x, y + currentSize);
          ctx.stroke();
      }
    },
    [colors.accent, reticleStyle, thickness]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      // Clear canvas
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制辅助线
      if (showGuidelines) {
        ctx.strokeStyle = `${colors.accent}40`;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, targetY);
        ctx.lineTo(canvas.width, targetY);
        ctx.moveTo(targetX, 0);
        ctx.lineTo(targetX, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 计算动画大小
      const baseSize = size * scale;
      const animatedSize = pulseEffect
        ? baseSize + Math.sin(currentTime * 0.001 * animationSpeed) * 5
        : baseSize;

      // 绘制瞄准框
      drawReticle(ctx, targetX, targetY, animatedSize);

      // 显示距离
      if (showDistance) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distance = Math.sqrt(
          Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2)
        );

        ctx.font = "14px Arial";
        ctx.fillStyle = colors.text;
        ctx.fillText(
          `Distance: ${Math.round(distance)}px`,
          targetX + baseSize + 10,
          targetY
        );
      }

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    targetX,
    targetY,
    colors,
    animationSpeed,
    scale,
    showGuidelines,
    showDistance,
    pulseEffect,
    size,
    drawReticle,
  ]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.max(0.5, Math.min(2, prev + e.deltaY * -0.001)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onWheel={handleWheel}
        style={{ cursor: isHovered ? "crosshair" : "default" }}
      />
    </motion.div>
  );
}
