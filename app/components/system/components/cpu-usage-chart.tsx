"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CpuUsageChartProps {
  usage: number;
}

export function CpuUsageChart({ usage }: CpuUsageChartProps) {
  const [data, setData] = useState<{ time: string; usage: number }[]>([]);

  useEffect(() => {
    setData((oldData) => {
      const newData = [
        ...oldData,
        { time: new Date().toLocaleTimeString(), usage },
      ];
      if (newData.length > 10) newData.shift();
      return newData;
    });
  }, [usage]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="usage" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
