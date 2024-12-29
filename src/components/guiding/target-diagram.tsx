"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileJson, RefreshCw, Info } from "lucide-react";
import { PeakChart } from "./peak-chart";

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
  showInfo?: boolean;
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
  showInfo = false,
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
      avgDeviation:
        deviations.reduce((a, b) => a + b, 0) / deviations.length || 0,
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

  const handleReset = () => {
    positionHistory.current = [];
    setStats({
      distance: 0,
      maxDeviation: 0,
      avgDeviation: 0,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support high resolution
    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * ratio;
    canvas.height = canvasSize.height * ratio;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    context.scale(ratio, ratio);

    let animationFrame: number;

    const drawFrame = () => {
      context.fillStyle = colors.background;
      context.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio);

      const centerX = canvas.width / (2 * ratio);
      const centerY = canvas.height / (2 * ratio);

      // Draw historical trajectory
      if (positionHistory.current.length > 1) {
        context.beginPath();
        context.moveTo(
          centerX + positionHistory.current[0].x,
          centerY + positionHistory.current[0].y
        );
        for (let i = 1; i < positionHistory.current.length; i++) {
          context.lineTo(
            centerX + positionHistory.current[i].x,
            centerY + positionHistory.current[i].y
          );
        }
        context.strokeStyle = `${colors.accent}40`;
        context.lineWidth = 1;
        context.stroke();
      }

      // Calculate dynamic scale based on currentPosition
      const maxOffset = Math.max(
        Math.abs(currentPosition.x),
        Math.abs(currentPosition.y)
      );
      const dynamicRadius = Math.max(radius, maxOffset / (canvas.width / 4));

      // Draw dynamic concentric circles with reticle marks
      const time = Date.now() * 0.001 * animationSpeed;
      for (let i = 1; i <= circleCount; i++) {
        const currentRadius =
          (dynamicRadius * i * canvas.width) / (2 * circleCount) +
          Math.sin(time + i) * 2;

        // Draw circle
        context.beginPath();
        context.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        context.strokeStyle = "#FFFFFF40";
        context.lineWidth = 1;
        context.stroke();

        // Draw reticle marks on circles
        for (let angle = 0; angle < 360; angle += 45) {
          const radian = (angle * Math.PI) / 180;
          const markLength = angle % 90 === 0 ? 10 : 5;

          context.beginPath();
          context.moveTo(
            centerX + currentRadius * Math.cos(radian),
            centerY + currentRadius * Math.sin(radian)
          );
          context.lineTo(
            centerX + (currentRadius - markLength) * Math.cos(radian),
            centerY + (currentRadius - markLength) * Math.sin(radian)
          );
          context.strokeStyle = "#FFFFFF80";
          context.lineWidth = 1;
          context.stroke();
        }
      }

      // Draw calibrated crosshair
      const drawCalibratedLine = (
        start: number,
        end: number,
        isVertical: boolean
      ) => {
        const step = 10;
        const majorTickInterval = 50;

        for (let pos = start; pos <= end; pos += step) {
          const isMajorTick = pos % majorTickInterval === 0;
          const tickLength = isMajorTick ? 8 : 4;

          context.beginPath();
          if (isVertical) {
            context.moveTo(centerX - tickLength, pos);
            context.lineTo(centerX + tickLength, pos);
            if (isMajorTick && pos !== centerY) {
              context.fillStyle = "#FFFFFF80";
              context.textAlign = "left";
              context.fillText(
                `${Math.abs(pos - centerY)}`,
                centerX + tickLength + 2,
                pos + 4
              );
            }
          } else {
            context.moveTo(pos, centerY - tickLength);
            context.lineTo(pos, centerY + tickLength);
            if (isMajorTick && pos !== centerX) {
              context.fillStyle = "#FFFFFF80";
              context.textAlign = "center";
              context.fillText(
                `${Math.abs(pos - centerX)}`,
                pos,
                centerY + tickLength + 12
              );
            }
          }
          context.strokeStyle = "#FFFFFF80";
          context.lineWidth = isMajorTick ? 1.5 : 1;
          context.stroke();
        }

        // Draw main crosshair lines
        context.beginPath();
        if (isVertical) {
          context.moveTo(centerX, start);
          context.lineTo(centerX, end);
        } else {
          context.moveTo(start, centerY);
          context.lineTo(end, centerY);
        }
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 1;
        context.stroke();
      };

      // Draw crosshair with calibration
      drawCalibratedLine(0, canvasSize.width, false);
      drawCalibratedLine(0, canvasSize.height, true);

      // Draw dynamic current position with pulse effect
      const pulseSize = pointSize + Math.sin(time * 4) * 2;
      context.beginPath();
      context.arc(
        centerX + currentPosition.x,
        centerY + currentPosition.y,
        pulseSize,
        0,
        Math.PI * 2
      );
      context.fillStyle = colors.accent;
      context.fill();

      // Draw position indicator lines
      context.setLineDash([2, 2]);
      context.beginPath();
      context.moveTo(centerX + currentPosition.x, centerY);
      context.lineTo(centerX + currentPosition.x, centerY + currentPosition.y);
      context.moveTo(centerX, centerY + currentPosition.y);
      context.lineTo(centerX + currentPosition.x, centerY + currentPosition.y);
      context.strokeStyle = `${colors.accent}80`;
      context.lineWidth = 1;
      context.stroke();
      context.setLineDash([]);

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-2 rounded-lg"
    >
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="rounded-md border border-gray-700 mb-2"
        />
        <PeakChart  />
        {showInfo && (
          <Button
        variant="ghost"
        size="icon"
        aria-label="刷新"
        onClick={handleReset}
        className="h-6 w-6"
          >
        <RefreshCw className="h-3 w-3 text-white" />
          </Button>
        )}
      </div>

      <div className="flex flex-row md:flex-col gap-2 flex-1 min-w-0">
        {showStats && (
          <Card className=" flex-1">
            <CardContent className="p-2">
              <div className="grid grid-cols-3 md:grid-cols-1 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">距离</span>
                  <div className="font-medium text-gray-300">
                    {stats.distance.toFixed(2)} px
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">最大偏差</span>
                  <div className="font-medium text-gray-300">
                    {stats.maxDeviation.toFixed(2)} px
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">平均偏差</span>
                  <div className="font-medium text-gray-300">
                    {stats.avgDeviation.toFixed(2)} px
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {enableExport && (
          <div className="flex flex-row md:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportImage}
              className="flex-1 h-8"
            >
              <Download className="h-3 w-3 mr-1" />
              导出图像
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex-1 h-8"
            >
              <FileJson className="h-3 w-3 mr-1" />
              导出数据
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
