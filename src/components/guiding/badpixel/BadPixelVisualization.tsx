"use client";

import { FC } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useBadPixelStore } from "@/store/guiding/useBadPixelStore";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ZoomIn, ZoomOut, RotateCcw, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BadPixelVisualizationProps {
  data: {
    width: number;
    height: number;
    hotPixels: number[];
    coldPixels: number[];
  };
}

const COLORS = {
  hot: "#ff4444",
  cold: "#4444ff",
};

const BadPixelVisualization: FC<BadPixelVisualizationProps> = ({ data }) => {
  const { options } = useBadPixelStore();
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(1);
  const [autoScale, setAutoScale] = useState(true);

  const scatterData = useMemo(() => {
    const hot = data.hotPixels.map((pixel) => ({
      x: pixel % data.width,
      y: Math.floor(pixel / data.width),
      type: "hot",
    }));

    const cold = data.coldPixels.map((pixel) => ({
      x: pixel % data.width,
      y: Math.floor(pixel / data.width),
      type: "cold",
    }));

    return [...hot, ...cold];
  }, [data]);

  const heatmapData = useMemo(() => {
    // 将像素点按区域聚合生成热力图数据
    const gridSize = 32; // 将图像分成 32x32 的网格
    const grid = Array(gridSize)
      .fill(0)
      .map(() => Array(gridSize).fill(0));

    const cellWidth = data.width / gridSize;
    const cellHeight = data.height / gridSize;

    // 统计每个网格中的坏点数量
    [...data.hotPixels, ...data.coldPixels].forEach((pixel) => {
      const x = pixel % data.width;
      const y = Math.floor(pixel / data.width);
      const gridX = Math.floor(x / cellWidth);
      const gridY = Math.floor(y / cellHeight);
      if (gridX < gridSize && gridY < gridSize) {
        grid[gridY][gridX]++;
      }
    });

    // 转换为适合 Recharts 的数据格式
    return grid.map((row, y) => ({
      name: `Row${y}`,
      ...row.reduce(
        (acc, value, x) => ({
          ...acc,
          [`col${x}`]: value,
        }),
        {}
      ),
    }));
  }, [data]);

  if (!data.width || !data.height) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (options.displayMode === "scatter") {
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="X"
              domain={[0, data.width]}
              allowDecimals={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y"
              domain={[0, data.height]}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const { x, y, type } = payload[0].payload;
                return (
                  <div className="bg-background/95 p-2 rounded-lg shadow border">
                    <p>
                      位置: ({x}, {y})
                    </p>
                    <p>类型: {type === "hot" ? "热点" : "冷点"}</p>
                  </div>
                );
              }}
            />
            <Legend />
            <Scatter name="坏点分布" data={scatterData} fill="#8884d8">
              {scatterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.type === "hot" ? COLORS.hot : COLORS.cold}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (options.displayMode === "heatmap") {
    // 使用网格布局展示热力图数据
    return (
      <div className="w-full h-full grid grid-cols-[repeat(32,1fr)] gap-px bg-gray-800">
        {heatmapData.flatMap((row, y) =>
          Object.values(row).map((value: number, x) => {
            if (typeof value === "number") {
              const intensity = Math.min(value / 10, 1); // 归一化强度
              return (
                <div
                  key={`${x}-${y}`}
                  className="aspect-square"
                  style={{
                    backgroundColor: `rgba(255, 68, 68, ${intensity})`,
                  }}
                  title={`Count: ${value}`}
                />
              );
            }
            return null;
          })
        )}
      </div>
    );
  }

  // Grid mode (保持不变)
  return (
    <div className="w-full h-full overflow-auto grid grid-cols-[repeat(auto-fill,minmax(2px,1fr))] gap-px bg-gray-800">
      {Array.from({ length: data.width * data.height }).map((_, i) => (
        <div
          key={i}
          className={`aspect-square ${
            data.hotPixels.includes(i)
              ? "bg-red-500"
              : data.coldPixels.includes(i)
              ? "bg-green-500"
              : "bg-gray-900"
          }`}
        />
      ))}
    </div>
  );
};

export default BadPixelVisualization;
