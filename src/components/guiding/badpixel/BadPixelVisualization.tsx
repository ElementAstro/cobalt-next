"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
} from "recharts";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BadPixelVisualizationProps {
  data: {
    width: number;
    height: number;
    hotPixels: number[];
    coldPixels: number[];
  };
}

export default function BadPixelVisualization({
  data,
}: BadPixelVisualizationProps) {
  const { theme } = useTheme();

  const { hotPixels, coldPixels } = useMemo(() => {
    const hot = data.hotPixels.map((pixel) => ({
      x: pixel % data.width,
      y: Math.floor(pixel / data.width),
      type: "热噪点",
      value: 1,
    }));

    const cold = data.coldPixels.map((pixel) => ({
      x: pixel % data.width,
      y: Math.floor(pixel / data.width),
      type: "冷噪点",
      value: 1,
    }));

    return { hotPixels: hot, coldPixels: cold };
  }, [data]);

  const chartColors = theme === "dark" ? {
    background: "#1f2937",
    grid: "#374151",
    text: "#f3f4f6",
    hot: "#ef4444",
    cold: "#3b82f6"
  } : {
    background: "#ffffff",
    grid: "#e5e7eb",
    text: "#111827",
    hot: "#dc2626",
    cold: "#2563eb"
  };

  if (!data.width || !data.height) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Badge variant="secondary" className="bg-red-500/20 text-red-500">
          热噪点: {data.hotPixels.length}
        </Badge>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
          冷噪点: {data.coldPixels.length}
        </Badge>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 70, left: 70 }}
          style={{ background: chartColors.background }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.grid}
          />
          
          <XAxis
            type="number"
            dataKey="x"
            name="X坐标"
            unit="px"
            domain={[0, data.width]}
            tick={{ fill: chartColors.text }}
            label={{
              value: "X坐标",
              position: "bottom",
              offset: 40,
              fill: chartColors.text,
            }}
          />
          
          <YAxis
            type="number"
            dataKey="y"
            name="Y坐标"
            unit="px"
            domain={[0, data.height]}
            tick={{ fill: chartColors.text }}
            label={{
              value: "Y坐标",
              angle: -90,
              position: "left",
              offset: -50,
              fill: chartColors.text,
            }}
          />

          <ZAxis type="number" dataKey="value" range={[10, 100]} />

          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: chartColors.grid }}
            content={({ payload }) => {
              if (payload && payload.length > 0) {
                const point = payload[0].payload;
                return (
                  <div className="bg-background p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{`类型: ${point.type}`}</p>
                    <p>{`X: ${point.x} px`}</p>
                    <p>{`Y: ${point.y} px`}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend
            verticalAlign="top"
            height={40}
            wrapperStyle={{
              paddingTop: "10px",
              color: chartColors.text,
            }}
          />

          <Scatter
            name="热噪点"
            data={hotPixels}
            fill={chartColors.hot}
            shape="circle"
            animationDuration={300}
          />

          <Scatter
            name="冷噪点"
            data={coldPixels}
            fill={chartColors.cold}
            shape="circle"
            animationDuration={300}
          />

          {/* 添加参考线 */}
          <ReferenceLine 
            x={data.width / 2} 
            stroke={chartColors.grid} 
            strokeDasharray="3 3"
          />
          <ReferenceLine 
            y={data.height / 2} 
            stroke={chartColors.grid} 
            strokeDasharray="3 3"
          />
        </ScatterChart>
      </ResponsiveContainer>

      {data.hotPixels.length === 0 && data.coldPixels.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p className="text-muted-foreground">
            暂无坏点数据，请先生成或添加坏点
          </p>
        </div>
      )}
    </div>
  );
}
