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
} from "recharts";
import { TimelineData } from "@/types/sequencer";
import { motion } from "framer-motion";

interface TimelineGraphProps {
  data: TimelineData[];
  height: number;
  showLineChart?: boolean;
  colors?: string[];
}

export function TimelineGraph({
  data,
  height,
  showLineChart,
  colors,
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
          <LineChart data={formattedData}>
            <XAxis dataKey="hour" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            {Array.isArray(data[0]?.value) ? (
              data[0].value.map((_, i) => (
                <Line
                  key={i}
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
                  dot={false}
                  animationDuration={1000}
                  animationBegin={0}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors?.[0] || "#82ca9d"}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                animationBegin={0}
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
          <BarChart data={formattedData}>
            <XAxis dataKey="hour" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            {Array.isArray(data[0]?.value) ? (
              data[0].value.map((_, i) => (
                <Bar
                  key={i}
                  dataKey={`value${i}`}
                  fill={
                    colors?.[i] ||
                    `hsl(${
                      (i * 360) /
                      (Array.isArray(data[0]?.value) ? data[0].value.length : 1)
                    }, 70%, 50%)`
                  }
                  animationDuration={1000}
                  animationBegin={0}
                  onMouseEnter={(data, index) => {
                    console.log(`Hovering bar at index ${index}`);
                  }}
                />
              ))
            ) : (
              <Bar
                dataKey="value"
                fill="#82ca9d"
                animationDuration={1000}
                animationBegin={0}
                onMouseEnter={(data, index) => {
                  console.log(`Hovering bar at index ${index}`);
                }}
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
