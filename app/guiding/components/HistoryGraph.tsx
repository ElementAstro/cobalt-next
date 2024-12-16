"use client";

import { useState, useCallback } from "react";
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

  const stats = calculateStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative"
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={points}
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
          {showTrendLine && (
            <Line
              type="monotone"
              dataKey="y"
              stroke={colors.primary}
              strokeWidth={lineThickness}
              dot={{ r: pointRadius }}
              activeDot={{ r: pointRadius * 2 }}
              animationDuration={animationSpeed * 1000}
            />
          )}
          {hoveredPoint && (
            <ReferenceLine
              x={hoveredPoint.x}
              stroke="red"
              label={`Hovered: ${hoveredPoint.y}`}
            />
          )}
          <Brush dataKey="x" height={30} stroke={colors.secondary} />
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
