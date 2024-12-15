"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CustomColors } from "@/types/guiding/guiding";

interface WaveformDisplayProps {
  data: number[];
  colors: CustomColors;
  animationSpeed: number;
  waveformStyle?: "sine" | "square" | "sawtooth";
  amplitude?: number;
  frequency?: number;
  lineWidth?: number;
  waveformColor?: string;
  canvasSize?: { width: number; height: number };
  offset?: number;
}

export function WaveformDisplay({
  data,
  colors,
  animationSpeed,
  waveformStyle = "sine",
  amplitude = 1,
  frequency = 1,
  lineWidth = 2,
  waveformColor = colors.accent,
  canvasSize = { width: 300, height: 100 },
  offset = 0,
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const getWaveform = (time: number, index: number) => {
      const t = time + index * 0.1 + offset;
      switch (waveformStyle) {
        case "square":
          return Math.sign(Math.sin(t * frequency));
        case "sawtooth":
          return ((t * frequency) % 1) * 2 - 1;
        default:
          return Math.sin(t * frequency);
      }
    };

    const drawFrame = () => {
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = waveformColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      const step = canvas.width / (data.length - 1);
      const time = Date.now() * 0.001 * animationSpeed;

      data.forEach((value, index) => {
        const x = index * step;
        const y =
          (canvas.height / 2) *
          (1 - value * amplitude * getWaveform(time, index));
        ctx.lineTo(x, y);
      });

      ctx.stroke();

      animationFrame = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => cancelAnimationFrame(animationFrame);
  }, [
    data,
    colors,
    animationSpeed,
    waveformStyle,
    amplitude,
    frequency,
    lineWidth,
    waveformColor,
    canvasSize,
    offset,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full border rounded"
        style={{ borderColor: colors.primary }}
      />
    </motion.div>
  );
}
