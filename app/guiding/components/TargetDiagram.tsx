"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding/guiding";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileJson } from "lucide-react";

interface TargetDiagramProps {
  radius: number;
  currentPosition: { x: number; y: number };
  colors: CustomColors;
  animationSpeed: number;
  circleCount?: number;
  crosshairColor?: string;
  pointSize?: number;
  canvasSize?: { width: number; height: number };
  showStats?: boolean;
  enableExport?: boolean;
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
  showStats = false,
  enableExport = false,
}: TargetDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({
    distance: 0,
    maxDeviation: 0,
    avgDeviation: 0,
  });
  const positionHistory = useRef<Array<{ x: number; y: number }>>([]);

  const calculateStats = () => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const distance = Math.sqrt(
      Math.pow(currentPosition.x, 2) + Math.pow(currentPosition.y, 2)
    );

    positionHistory.current.push(currentPosition);
    if (positionHistory.current.length > 100) {
      positionHistory.current.shift();
    }

    const deviations = positionHistory.current.map((pos) =>
      Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2))
    );

    setStats({
      distance: distance,
      maxDeviation: Math.max(...deviations),
      avgDeviation: deviations.reduce((a, b) => a + b, 0) / deviations.length,
    });
  };

  const handleExportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "target-diagram.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleExportData = () => {
    const data = {
      currentPosition,
      stats,
      history: positionHistory.current,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "target-data.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

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

      // Draw history trail
      if (positionHistory.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(
          centerX + positionHistory.current[0].x,
          centerY + positionHistory.current[0].y
        );
        for (let i = 1; i < positionHistory.current.length; i++) {
          ctx.lineTo(
            centerX + positionHistory.current[i].x,
            centerY + positionHistory.current[i].y
          );
        }
        ctx.strokeStyle = `${colors.accent}40`;
        ctx.stroke();
      }

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

      calculateStats();
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
      className="w-full space-y-4"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full rounded"
      />

      {showStats && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">距离</div>
                <div>{stats.distance.toFixed(2)}px</div>
              </div>
              <div>
                <div className="text-muted-foreground">最大偏差</div>
                <div>{stats.maxDeviation.toFixed(2)}px</div>
              </div>
              <div>
                <div className="text-muted-foreground">平均偏差</div>
                <div>{stats.avgDeviation.toFixed(2)}px</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {enableExport && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportImage}>
            <Download className="w-4 h-4 mr-2" />
            导出图像
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <FileJson className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
      )}
    </motion.div>
  );
}
