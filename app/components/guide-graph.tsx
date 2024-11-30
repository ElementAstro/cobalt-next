"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function GuideGraph() {
  const data = Array.from({ length: 100 }, (_, i) => ({
    name: i,
    value: (Math.random() - 0.5) * 4,
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.1)" />
          <YAxis domain={[-4, 4]} stroke="rgba(255, 255, 255, 0.1)" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgb(75, 192, 192)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
