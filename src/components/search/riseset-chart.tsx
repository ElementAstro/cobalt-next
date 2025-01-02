import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Brush,
} from "recharts";
import { motion } from "framer-motion";

interface RiseSetChartProps {
  riseTime: string;
  setTime: string;
  transitTime: string;
  transitAltitude: number;
  chartHeight?: number;
  lineColor?: string;
  gridColor?: string;
  axisColor?: string;
  backgroundColor?: string;
  showReferenceLines?: boolean;
  enableZoom?: boolean;
  animationDuration?: number;
}

export function RiseSetChart({
  riseTime,
  setTime,
  transitTime,
  transitAltitude,
  chartHeight = 300,
  lineColor = "#3b82f6",
  gridColor = "#374151",
  axisColor = "#9ca3af",
  backgroundColor = "rgba(255, 255, 255, 0.05)",
  showReferenceLines = true,
  enableZoom = false,
  animationDuration = 0.5,
}: RiseSetChartProps) {
  // Generate more detailed data points for smoother curve
  const generateDataPoints = () => {
    const points = [];
    const riseDate = new Date(`2000/01/01 ${riseTime}`);
    const setDate = new Date(`2000/01/01 ${setTime}`);
    const transitDate = new Date(`2000/01/01 ${transitTime}`);

    for (let i = 0; i <= 24; i++) {
      const time = new Date(
        riseDate.getTime() + (i * (setDate.getTime() - riseDate.getTime())) / 24
      );
      const altitude = calculateAltitude(
        time,
        riseDate,
        transitDate,
        setDate,
        transitAltitude
      );
      points.push({
        time: time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        altitude: Math.max(0, altitude),
      });
    }
    return points;
  };

  const calculateAltitude = (
    current: Date,
    rise: Date,
    transit: Date,
    set: Date,
    maxAlt: number
  ): number => {
    // Convert all times to minutes since midnight for easier calculation
    const getMinutes = (date: Date) => date.getHours() * 60 + date.getMinutes();

    const currentMin = getMinutes(current);
    const riseMin = getMinutes(rise);
    const transitMin = getMinutes(transit);
    const setMin = getMinutes(set);

    // If current time is outside rise-set period, return 0
    if (currentMin < riseMin || currentMin > setMin) {
      return 0;
    }

    // Calculate position in the arc (0 to 1)
    let position;
    if (currentMin <= transitMin) {
      // Rising phase
      position = (currentMin - riseMin) / (transitMin - riseMin);
    } else {
      // Setting phase
      position = 1 - (currentMin - transitMin) / (setMin - transitMin);
    }

    // Use sine function to create smooth curve
    return maxAlt * Math.sin((position * Math.PI) / 2);
  };

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (enableZoom) {
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(0.5, zoom + delta), 3);
      setZoom(newZoom);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (enableZoom && e.buttons === 1) {
      setOffset({
        x: offset.x + e.movementX,
        y: offset.y + e.movementY,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: animationDuration }}
      className="w-full p-2 rounded-lg"
      style={{ backgroundColor }}
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={generateDataPoints()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="altitudeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="time"
            stroke={axisColor}
            tick={{ fill: axisColor }}
            allowDataOverflow={enableZoom}
          />
          <YAxis
            domain={[0, 90]}
            stroke={axisColor}
            tick={{ fill: axisColor }}
            allowDataOverflow={enableZoom}
          />
          {showReferenceLines && (
            <>
              <ReferenceLine
                y={transitAltitude}
                stroke={axisColor}
                strokeDasharray="5 5"
                label={{
                  value: "Transit",
                  position: "insideTopRight",
                  fill: axisColor,
                }}
              />
              <ReferenceLine
                y={0}
                stroke={axisColor}
                strokeDasharray="5 5"
                label={{
                  value: "Horizon",
                  position: "insideBottomRight",
                  fill: axisColor,
                }}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: backgroundColor,
              border: `1px solid ${gridColor}`,
              borderRadius: "0.375rem",
            }}
          />
          <Line
            type="monotone"
            dataKey="altitude"
            stroke="url(#altitudeGradient)"
            strokeWidth={2}
            dot={false}
            animationDuration={animationDuration * 1000}
          />
          {enableZoom && (
            <Brush
              dataKey="time"
              height={30}
              stroke={axisColor}
              fill={backgroundColor}
              travellerWidth={10}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
