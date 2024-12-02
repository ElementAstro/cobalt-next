"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "react-responsive";

interface DiskUsageChartProps {
  usage: number;
}

export function DiskUsageChart({ usage }: DiskUsageChartProps) {
  const data = [
    { name: "Used", value: usage },
    { name: "Free", value: 100 - usage },
  ];

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
