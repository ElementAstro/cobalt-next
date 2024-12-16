"use client";

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface DataPoint {
  time: string;
  temperature: number;
}

interface LineChartProps {
  data: DataPoint[];
  enableZoom?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function LineChart({
  data,
  enableZoom = true,
  showGrid = true,
  showLegend = true,
}: LineChartProps) {
  const handleDownload = () => {
    const svg = document.querySelector(".recharts-wrapper svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "temperature-chart.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      className="p-4 bg-gray-800 text-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-end mb-2">
        <Button onClick={handleDownload} className="mr-2">
          <Download size={16} className="mr-2" />
          下载
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="time"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}°C`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", borderColor: "#333" }}
            itemStyle={{ color: "#fff" }}
          />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
