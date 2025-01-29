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
import { motion } from "framer-motion";
import { calculateDensityMap } from "@/utils/pixelDensity";

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

  // 新增：缩放和平移控制
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = transform.scale * (e.deltaY > 0 ? 0.9 : 1.1);
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(newScale, 0.1), 5),
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 新增：动画效果
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  if (!data.width || !data.height) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden"
      variants={variants}
      initial="hidden"
      animate="visible"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 工具栏 */}
      <div className="absolute top-4 right-4 space-x-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setTransform((prev) => ({ ...prev, scale: prev.scale * 1.2 }))
          }
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setTransform((prev) => ({ ...prev, scale: prev.scale * 0.8 }))
          }
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* 主要可视化内容 */}
      <motion.div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
        className="origin-center"
      >
        {options.displayMode === "scatter" && (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
              >
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
        )}

        {options.displayMode === "heatmap" && (
          <div className="w-full h-full grid grid-cols-[repeat(32,1fr)] gap-px bg-gray-800">
            {heatmapData.flatMap((row, y) =>
              (Object.values(row) as number[]).map((value, x) => {
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
        )}

        {options.displayMode === "grid" && (
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
        )}
      </motion.div>

      {/* 缩略图导航器 */}
      <div className="absolute bottom-4 right-4 w-32 h-32 border border-gray-600 bg-gray-900/50">
        {/* 添加缩略图实现 */}
      </div>
    </motion.div>
  );
};

export default BadPixelVisualization;
