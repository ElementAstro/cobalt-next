"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NetworkUsageChartProps {
  upload: number;
  download: number;
}

export function NetworkUsageChart({
  upload,
  download,
}: NetworkUsageChartProps) {
  const [data, setData] = useState<
    { time: string; upload: number; download: number }[]
  >([]);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    setData((oldData) => {
      const newData = [
        ...oldData,
        { time: new Date().toLocaleTimeString(), upload, download },
      ];
      if (newData.length > 10) newData.shift();
      return newData;
    });
  }, [upload, download]);

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="upload"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="download"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
