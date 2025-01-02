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
        }
      },
      onMouseLeave: () => {
        const element = document.getElementById(`chart-element-${index}`);
        if (element) {
          element.style.transition = `all ${hoverAnimationDuration}ms ease`;
          element.style.transform = "scale(1)";
        }
      },
    }),
  });

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentHourLabel = `${Math.floor(currentHour)}:00`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-4 rounded-lg shadow-lg"
    >
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
              label={{ value: axisLabels.x, position: "insideBottom", offset: -10 }}
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
                <Line
                  key={i}
                  id={`chart-element-${i}`}
                  type="monotone"
                  dataKey={`value${i}`}
                  stroke={
                    colors?.[i] ||
                    `hsl(${
                      (i * 360) /
                      (Array.isArray(data[0]?.value) ? data[0].value.length : 1)
                    }, 70%, 50%)`
                  }
                  strokeWidth={2}
                  dot={showMarkers ? { stroke: markerStroke, fill: markerFill, r: markerSize } : false}
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
                dot={showMarkers ? { stroke: markerStroke, fill: markerFill, r: markerSize } : false}
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
              label={{ value: axisLabels.x, position: "insideBottom", offset: -10 }}
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
                      (Array.isArray(data[0]?.value) ? data[0].value.length : 1)
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
  );
}
