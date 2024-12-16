"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding/guiding";

interface TargetDiagramProps {
  radius: number;
  currentPosition: { x: number; y: number };
  colors: CustomColors;
  animationSpeed: number;
  circleCount?: number;
  crosshairColor?: string;
  pointSize?: number;
  canvasSize?: { width: number; height: number };
}

export function TargetDiagram({
  radius,
  currentPosition,
  colors,
  animationSpeed,
  circleCount = 3,
  crosshairColor = colors.secondary,
  pointSize = 4,
  canvasSize = { width: 200, height: 200 },
}: TargetDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const drawFrame = () => {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw animated concentric circles
      const time = Date.now() * 0.001 * animationSpeed;
      for (let i = 1; i <= circleCount; i++) {
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          (radius * i * canvas.width) / (2 * circleCount) +
            Math.sin(time + i) * 2,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = colors.primary;
        ctx.stroke();
      }

      // Draw crosshair
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.strokeStyle = crosshairColor;
      ctx.stroke();

      // Draw animated current position
      ctx.beginPath();
      ctx.arc(
        centerX + currentPosition.x + Math.sin(time * 2) * 2,
        centerY + currentPosition.y + Math.cos(time * 2) * 2,
        pointSize,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = colors.accent;
      ctx.fill();

      animationFrame = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => cancelAnimationFrame(animationFrame);
  }, [
    radius,
    currentPosition,
    colors,
    animationSpeed,
    circleCount,
    crosshairColor,
    pointSize,
    canvasSize,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full rounded"
      />
    </motion.div>
  );
}
