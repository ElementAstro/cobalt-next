"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useMediaQuery } from "react-responsive";

interface MemoryUsageChartProps {
  usage: number;
}

export function MemoryUsageChart({ usage }: MemoryUsageChartProps) {
  const data = [
    { name: "Used", value: usage },
    { name: "Free", value: 100 - usage },
  ];

  const COLORS = ["#0088FE", "#00C49F"];
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={isMobile ? 40 : 60}
          outerRadius={isMobile ? 60 : 80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
