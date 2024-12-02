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
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={formattedData}>
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#82ca9d" />
        <ReferenceLine
          x={currentHourLabel}
          stroke="rgb(0, 200, 150)"
          label="现在"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
