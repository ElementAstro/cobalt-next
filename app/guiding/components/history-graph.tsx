"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { GuidePoint } from "@/types/guiding/guiding";
import { CustomColors } from "@/types/guiding/guiding";

interface HistoryGraphProps {
  points: GuidePoint[];
  showTrendLine: boolean;
  colors: CustomColors;
  animationSpeed: number;
  gridSpacing?: number;
  showStats?: boolean;
  enableZoom?: boolean;
  showAxisLabels?: boolean;
  pointRadius?: number;
  lineThickness?: number;
}

export function HistoryGraph({
  points,
  showTrendLine,
  colors,
  animationSpeed,
  gridSpacing = 50,
  showStats = true,
  enableZoom = true,
  showAxisLabels = true,
  pointRadius = 3,
  lineThickness = 2,
}: HistoryGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<GuidePoint | null>(null);

  const calculateStats = useCallback(() => {
    if (!points.length) return null;
    const yValues = points.map((p) => p.y);
    return {
      min: Math.min(...yValues),
      max: Math.max(...yValues),
      avg: yValues.reduce((a, b) => a + b) / yValues.length,
    };
  }, [points]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!enableZoom) return;
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setScale((s) => Math.max(0.1, Math.min(5, s + delta)));
    },
    [enableZoom]
  );

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const canvas = ctx.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Transform context
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      // Draw grid
      ctx.strokeStyle = `${colors.secondary}40`;
      ctx.lineWidth = 0.5;

      for (let i = 0; i <= canvas.width; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i <= canvas.height; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw points and lines
      points.forEach((point, index) => {
        const animatedY = point.y + Math.sin(time + index * 0.1) * 2;

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, animatedY, pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = hoveredPoint === point ? colors.accent : colors.primary;
        ctx.fill();

        // Draw connecting line
        if (showTrendLine && index < points.length - 1) {
          const nextPoint = points[index + 1];
          const nextAnimatedY =
            nextPoint.y + Math.sin(time + (index + 1) * 0.1) * 2;

          ctx.beginPath();
          ctx.moveTo(point.x, animatedY);
          ctx.lineTo(nextPoint.x, nextAnimatedY);
          ctx.strokeStyle = colors.accent;
          ctx.lineWidth = lineThickness;
          ctx.stroke();
        }
      });

      // Draw stats
      if (showStats) {
        const stats = calculateStats();
        if (stats) {
          ctx.font = "12px Arial";
          ctx.fillStyle = colors.text;
          ctx.fillText(`Max: ${stats.max.toFixed(2)}`, 10, 20);
          ctx.fillText(`Min: ${stats.min.toFixed(2)}`, 10, 40);
          ctx.fillText(`Avg: ${stats.avg.toFixed(2)}`, 10, 60);
        }
      }

      // Draw axis labels
      if (showAxisLabels) {
        ctx.font = "12px Arial";
        ctx.fillStyle = colors.text;
        ctx.fillText("Time →", canvas.width - 40, canvas.height - 10);
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Value →", -canvas.height + 20, 15);
        ctx.restore();
      }

      ctx.restore();
    },
    [
      points,
      showTrendLine,
      colors,
      scale,
      offset,
      hoveredPoint,
      showStats,
      showAxisLabels,
      pointRadius,
      lineThickness,
      gridSpacing,
    ]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    const animate = () => {
      const time = Date.now() * 0.001 * animationSpeed;
      drawFrame(ctx, time);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [drawFrame, animationSpeed, handleWheel]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale - offset.x;
      const y = (e.clientY - rect.top) / scale - offset.y;

      const hoveredPoint = points.find((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < pointRadius * 2;
      });

      setHoveredPoint(hoveredPoint || null);
    },
    [points, scale, offset, pointRadius]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full border rounded cursor-move"
        style={{ borderColor: colors.primary }}
        onMouseMove={handleMouseMove}
      />
    </motion.div>
  );
}
