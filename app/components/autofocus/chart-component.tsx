import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface ChartComponentProps {
  mode: "real" | "mock";
}

export function ChartComponent({ mode }: ChartComponentProps) {
  const [chartData, setChartData] = useState<
    Array<{ name: number; hfd: number; starIndex: number }>
  >([]);

  useEffect(() => {
    if (mode === "mock") {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        name: i,
        hfd: Math.random() * 20 - 10,
        starIndex: Math.random() * 30,
      }));
      setChartData(mockData);
    } else {
      // In real mode, you would fetch data from your telescope or API
      // For now, we'll just clear the data
      setChartData([]);
    }
  }, [mode]);

  const clearChart = () => {
    setChartData([]);
  };

  return (
    <div className="relative h-64 sm:h-80 mb-4">
      <Button
        variant="ghost"
        className="absolute right-2 top-2 z-10 text-sm"
        onClick={clearChart}
      >
        CLEAR
      </Button>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis
            stroke="#666"
            domain={[-20, 20]}
            ticks={[-20, -15, -10, -5, 0, 5, 10, 15, 20]}
          />
          <Line type="monotone" dataKey="hfd" stroke="#4ade80" dot={false} />
          <Line
            type="monotone"
            dataKey="starIndex"
            stroke="#60a5fa"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
