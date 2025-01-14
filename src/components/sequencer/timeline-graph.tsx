"use client";

import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from "recharts";
import { TimelineData } from "@/types/sequencer";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RefreshCw,
  Settings,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

interface TimelineGraphProps {
  data: TimelineData[];
  height: number;
  showLineChart?: boolean;
  colors?: string[];
  showGrid?: boolean;
  gridStroke?: string;
  gridStrokeDasharray?: string;
  showLegend?: boolean;
  legendPosition?: "top" | "bottom";
  axisLabels?: {
    x?: string;
    y?: string;
  };
  showMarkers?: boolean;
  markerSize?: number;
  markerStroke?: string;
  markerFill?: string;
  zoomable?: boolean;
  panable?: boolean;
  animationDuration?: number;
  animationEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  hoverAnimation?: boolean;
  hoverAnimationDuration?: number;
  showControls?: boolean;
  controlIcons?: {
    play?: boolean;
    pause?: boolean;
    refresh?: boolean;
    settings?: boolean;
    zoomIn?: boolean;
    zoomOut?: boolean;
  };
  onControlClick?: (action: string) => void;
}

export function TimelineGraph({
  data,
  height,
  showLineChart,
  colors,
  showGrid = true,
  gridStroke = "#444",
  gridStrokeDasharray = "3 3",
  showLegend = true,
  legendPosition = "bottom",
  axisLabels = {},
  showMarkers = false,
  markerSize = 5,
  markerStroke = "#fff",
  markerFill = "#888",
  zoomable = false,
  panable = false,
  animationDuration = 1000,
  animationEasing = "ease-in-out",
  hoverAnimation = true,
  hoverAnimationDuration = 300,
  showControls = false,
  controlIcons = {
    play: true,
    pause: true,
    refresh: true,
    settings: true,
    zoomIn: true,
    zoomOut: true,
  },
  onControlClick,
}: TimelineGraphProps) {
  const formattedData = data.map((item, index) => {
    const dataPoint: any = { hour: `${index}:00` };
    if (Array.isArray(item.value)) {
      item.value.forEach((val, i) => {
        dataPoint[`value${i}`] = val;
      });
    } else {
      dataPoint.value = item.value;
    }
    return dataPoint;
  });

  const getAnimationProps = (index: number) => ({
    isAnimationActive: true,
    animationDuration,
    animationEasing,
    ...(hoverAnimation && {
      onMouseEnter: () => {
        const element = document.getElementById(`chart-element-${index}`);
        if (element) {
          element.style.transition = `all ${hoverAnimationDuration}ms ease`;
          element.style.transform = "scale(1.05)";
          element.style.filter = "brightness(1.2)";
        }
      },
      onMouseLeave: () => {
        const element = document.getElementById(`chart-element-${index}`);
        if (element) {
          element.style.transition = `all ${hoverAnimationDuration}ms ease`;
          element.style.transform = "scale(1)";
          element.style.filter = "brightness(1)";
        }
      },
    }),
  });

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentHourLabel = `${Math.floor(currentHour)}:00`;

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleControlClick = (action: string) => {
    if (onControlClick) {
      onControlClick(action);
    }
    if (action === "zoomIn") {
      setZoomLevel((prev) => Math.min(2, prev + 0.1));
    }
    if (action === "zoomOut") {
      setZoomLevel((prev) => Math.max(0.5, prev - 0.1));
    }
  };

  const chartContainerStyle = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: "top left",
    transition: "transform 0.2s ease",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-4 rounded-lg shadow-lg relative"
    >
      {showControls && (
        <motion.div
          className="absolute top-2 right-2 flex gap-3 bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {controlIcons?.play && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleControlClick("play")}
              className="p-1 rounded-full hover:bg-gray-700 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                播放
              </div>
            </motion.div>
          )}
          {controlIcons?.pause && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleControlClick("pause")}
              className="p-1 rounded-full hover:bg-gray-700 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <Pause className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                暂停
              </div>
            </motion.div>
          )}
          {controlIcons?.refresh && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleControlClick("refresh")}
              className="p-1 rounded-full hover:bg-gray-700 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <RefreshCw className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                刷新
              </div>
            </motion.div>
          )}
          {controlIcons?.settings && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleControlClick("settings")}
              className="p-1 rounded-full hover:bg-gray-700 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <Settings className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                设置
              </div>
            </motion.div>
          )}
          {controlIcons?.zoomIn && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleControlClick("zoomIn")}
              className="p-1 rounded-full hover:bg-gray-700 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <ZoomIn className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                放大
              </div>
            </motion.div>
          )}
          {controlIcons?.zoomOut && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleControlClick("zoomOut")}
              className="p-1 rounded-full hover:bg-gray-700 cursor-pointer relative group active:scale-95 transition-transform"
            >
              <ZoomOut className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                缩小
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        style={chartContainerStyle}
      >
        {zoomLevel !== 1 && (
          <div className="absolute top-0 left-0 bg-gray-800/50 px-2 py-1 rounded-br text-sm text-gray-300">
            {Math.round(zoomLevel * 100)}%
          </div>
        )}
        <ResponsiveContainer width="100%" height={height}>
          {showLineChart ? (
            <LineChart
              data={formattedData}
              {...(zoomable && { zoomable: true })}
              {...(panable && { panable: true })}
            >
              {showGrid && (
                <CartesianGrid
                  stroke={gridStroke}
                  strokeDasharray={gridStrokeDasharray}
                />
              )}
              <XAxis
                dataKey="hour"
                stroke="#ccc"
                label={{
                  value: axisLabels.x,
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                stroke="#ccc"
                label={{
                  value: axisLabels.y,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <motion.div
                        className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm text-gray-300">{label}</p>
                        {payload.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 mt-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <p className="text-sm text-gray-200">
                              {item.name}: {item.value}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
              />
              {showLegend && <Legend verticalAlign={legendPosition} />}
              {Array.isArray(data[0]?.value) ? (
                data[0].value.map((_, i) => (
                  <Line
                    key={i}
                    id={`chart-element-${i}`}
                    type="monotone"
                    dataKey={`value${i}`}
                    stroke={
                      colors?.[i] ||
                      `hsl(${
                        (i * 360) /
                        (Array.isArray(data[0]?.value)
                          ? data[0].value.length
                          : 1)
                      }, 70%, 50%)`
                    }
                    strokeWidth={2}
                    dot={
                      showMarkers
                        ? {
                            stroke: markerStroke,
                            fill: markerFill,
                            r: markerSize,
                          }
                        : false
                    }
                    {...getAnimationProps(i)}
                  />
                ))
              ) : (
                <Line
                  id="chart-element-single"
                  type="monotone"
                  dataKey="value"
                  stroke={colors?.[0] || "#82ca9d"}
                  strokeWidth={2}
                  dot={
                    showMarkers
                      ? {
                          stroke: markerStroke,
                          fill: markerFill,
                          r: markerSize,
                        }
                      : false
                  }
                  {...getAnimationProps(0)}
                />
              )}
              <ReferenceLine
                x={currentHourLabel}
                stroke="rgb(0, 200, 150)"
                label={{
                  value: "现在",
                  position: "top",
                  fill: "rgb(0, 200, 150)",
                }}
                strokeDasharray="3 3"
              />
            </LineChart>
          ) : (
            <BarChart
              data={formattedData}
              {...(zoomable && { zoomable: true })}
              {...(panable && { panable: true })}
            >
              {showGrid && (
                <CartesianGrid
                  stroke={gridStroke}
                  strokeDasharray={gridStrokeDasharray}
                />
              )}
              <XAxis
                dataKey="hour"
                stroke="#ccc"
                label={{
                  value: axisLabels.x,
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                stroke="#ccc"
                label={{
                  value: axisLabels.y,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
              />
              {showLegend && <Legend verticalAlign={legendPosition} />}
              {Array.isArray(data[0]?.value) ? (
                data[0].value.map((_, i) => (
                  <Bar
                    key={i}
                    id={`chart-element-${i}`}
                    dataKey={`value${i}`}
                    fill={
                      colors?.[i] ||
                      `hsl(${
                        (i * 360) /
                        (Array.isArray(data[0]?.value)
                          ? data[0].value.length
                          : 1)
                      }, 70%, 50%)`
                    }
                    {...getAnimationProps(i)}
                  />
                ))
              ) : (
                <Bar
                  id="chart-element-single"
                  dataKey="value"
                  fill="#82ca9d"
                  {...getAnimationProps(0)}
                />
              )}
              <ReferenceLine
                x={currentHourLabel}
                stroke="rgb(0, 200, 150)"
                label={{
                  value: "现在",
                  position: "top",
                  fill: "rgb(0, 200, 150)",
                }}
                strokeDasharray="3 3"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
