"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";
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
  showStats?: boolean;
  showAxisLabels?: boolean;
  enableZoom?: boolean;
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
  showStats = true,
  showAxisLabels = true,
  enableZoom = true,
}: WaveformDisplayProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const calculateStats = () => {
    if (!data.length) return null;
    return {
      min: Math.min(...data),
      max: Math.max(...data),
      avg: data.reduce((a, b) => a + b) / data.length,
    };
  };

  const stats = calculateStats();

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

  const waveformData = data.map((value, index) => ({
    x: index,
    y:
      value *
      amplitude *
      getWaveform(Date.now() * 0.001 * animationSpeed, index),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative"
    >
      <ResponsiveContainer width="100%" height={canvasSize.height}>
        <LineChart
          data={waveformData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            label={
              showAxisLabels
                ? { value: "Time", position: "insideBottomRight", offset: -10 }
                : undefined
            }
          />
          <YAxis
            label={
              showAxisLabels
                ? { value: "Value", angle: -90, position: "insideLeft" }
                : undefined
            }
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="y"
            stroke={waveformColor}
            strokeWidth={lineWidth}
            dot={false}
            animationDuration={animationSpeed * 1000}
          />
          {hoveredPoint !== null && (
            <ReferenceLine
              x={hoveredPoint}
              stroke="red"
              label={`Hovered: ${hoveredPoint}`}
            />
          )}
          {enableZoom && (
            <Brush dataKey="x" height={30} stroke={colors.secondary} />
          )}
        </LineChart>
      </ResponsiveContainer>
      {showStats && stats && (
        <div className="absolute top-2 left-2 bg-gray-800 text-white p-2 rounded">
          <p>Max: {stats.max.toFixed(2)}</p>
          <p>Min: {stats.min.toFixed(2)}</p>
          <p>Avg: {stats.avg.toFixed(2)}</p>
        </div>
      )}
    </motion.div>
  );
}
