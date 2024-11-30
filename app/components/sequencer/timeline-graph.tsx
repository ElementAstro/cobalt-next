"use client";

import { useRef, useEffect } from "react";
import { TimelineData } from "@/types/sequencer";

interface TimelineGraphProps {
  data: TimelineData[];
  height: number;
}

export function TimelineGraph({ data, height }: TimelineGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    for (let i = 0; i <= height; i += 30) {
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
    }
    ctx.stroke();

    // Draw data
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    const barWidth = width / 24;
    data.forEach((item, i) => {
      const barHeight = (item.value / 100) * height;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    });

    // Draw time labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px sans-serif";
    for (let i = 3; i <= 9; i += 3) {
      ctx.fillText(i.toString().padStart(2, "0"), (width / 24) * i, height - 5);
    }

    // Draw current time marker
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const markerX = (width / 24) * currentHour;

    ctx.strokeStyle = "rgb(0, 200, 150)";
    ctx.beginPath();
    ctx.moveTo(markerX, 0);
    ctx.lineTo(markerX, height);
    ctx.stroke();
  }, [data, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: `${height}px` }}
      className="w-full"
    />
  );
}
