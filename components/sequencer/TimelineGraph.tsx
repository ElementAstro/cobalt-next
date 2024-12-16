"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
}

export function TimelineGraph({ data, height }: TimelineGraphProps) {
  const formattedData = data.map((item, index) => ({
    hour: `${index}:00`,
    value: item.value,
  }));

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
        <BarChart data={formattedData}>
          <XAxis dataKey="hour" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
            itemStyle={{ color: "#fff" }}
            cursor={{ fill: "rgba(255,255,255,0.1)" }}
          />
          <Bar
            dataKey="value"
            fill="#82ca9d"
            animationDuration={1000}
            animationBegin={0}
            onMouseEnter={(data, index) => {
              // 处理鼠标悬停事件
              console.log(`Hovering bar at index ${index}`);
            }}
          />
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
      </ResponsiveContainer>
    </motion.div>
  );
}
