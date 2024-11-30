"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface MemoryUsageChartProps {
  usage: number;
}

export function MemoryUsageChart({ usage }: MemoryUsageChartProps) {
  const data = [
    { name: "Used", value: usage },
    { name: "Free", value: 100 - usage },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
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
