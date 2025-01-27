"use client";

import { motion } from "framer-motion";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const pixelSchema = z
  .number()
  .min(0, "像素坐标不能小于0")
  .max(4144 * 2822 - 1, "像素坐标超出范围");

// 定义颜色常量
const COLORS = {
  hot: "#ff4444",
  cold: "#4444ff",
  normal: "#44ff44",
};

interface PixelInfoProps {
  data: {
    width: number;
    height: number;
    hotPixels: number[];
    coldPixels: number[];
  };
  visualMode: "table" | "graph";
  isLandscape: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onManualAddPixel: (pixel: number) => void;
  manualPixel: string;
  setManualPixel: (value: string) => void;
}

const PixelInfo: FC<PixelInfoProps> = ({
  data,
  visualMode,
  isLandscape,
  expanded,
  onToggleExpand,
  onManualAddPixel,
  manualPixel,
  setManualPixel,
}) => {
  const { toast } = useToast();

  const handleAddPixel = async () => {
    try {
      const parsedPixel = pixelSchema.parse(Number(manualPixel));
      await onManualAddPixel(parsedPixel);
      setManualPixel("");
      toast({
        title: "成功添加坏点",
        description: `坐标 ${parsedPixel} 已添加`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "输入错误",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "添加失败",
          description: "未知错误",
          variant: "destructive",
        });
      }
    }
  };

  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  const totalPixels = data.width * data.height;
  const hotPixelPercentage = (data.hotPixels.length / totalPixels) * 100;
  const coldPixelPercentage = (data.coldPixels.length / totalPixels) * 100;

  // 准备图表数据
  const distributionData = [
    { name: "热坏点", count: data.hotPixels.length },
    { name: "冷坏点", count: data.coldPixels.length },
  ];

  const pieData = [
    { name: "热坏点", value: hotPixelPercentage },
    { name: "冷坏点", value: coldPixelPercentage },
    { name: "正常", value: 100 - hotPixelPercentage - coldPixelPercentage },
  ];

  // 假设 data.pixels 是一个包含坏点坐标的数组
  const scatterData = [
    ...data.hotPixels.map((pixel) => ({
      x: pixel % data.width,
      y: Math.floor(pixel / data.width),
      type: "hot",
    })),
    ...data.coldPixels.map((pixel) => ({
      x: pixel % data.width,
      y: Math.floor(pixel / data.width),
      type: "cold",
    })),
  ];

  return (
    <motion.div className="space-y-4">
      {/* 相机信息卡片 */}
      <Card className="bg-gray-900/50">
        <CardContent className="p-3">
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="text-sm">
              <p className="text-gray-400">分辨率</p>
              <p>
                {data.width} x {data.height}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-gray-400">总像素</p>
              <p>{data.width * data.height}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 坏点统计图表 */}
      <Card className="bg-gray-900/50">
        <CardContent className="p-3">
          <CardTitle className="text-sm mb-4">坏点分布</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="数量">
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? COLORS.hot : COLORS.cold}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 坏点类型占比 */}
      <Card className="bg-gray-900/50">
        <CardContent className="p-3">
          <CardTitle className="text-sm mb-4">坏点类型占比</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? COLORS.hot
                        : index === 1
                        ? COLORS.cold
                        : COLORS.normal
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 坏点位置分布 */}
      <Card className="bg-gray-900/50">
        <CardContent className="p-3">
          <CardTitle className="text-sm mb-4">坏点位置分布</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="X" unit="px" />
              <YAxis type="number" dataKey="y" name="Y" unit="px" />
              <ZAxis type="category" dataKey="type" name="类型" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="热坏点"
                data={scatterData.filter((p: any) => p.type === "hot")}
                fill={COLORS.hot}
              />
              <Scatter
                name="冷坏点"
                data={scatterData.filter((p: any) => p.type === "cold")}
                fill={COLORS.cold}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 手动添加坏点 */}
      <Card className="bg-gray-900/50">
        <CardContent className="p-3">
          <Label htmlFor="manual-pixel">手动添加坏点</Label>
          <div className="flex gap-2">
            <Input
              id="manual-pixel"
              value={manualPixel}
              onChange={(e) => setManualPixel(e.target.value)}
              placeholder="输入像素坐标 (0 - 11696767)"
              className="flex-1"
            />
            <Button onClick={handleAddPixel} disabled={!manualPixel}>
              添加
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PixelInfo;
