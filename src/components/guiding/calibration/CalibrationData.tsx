"use client";

import { useState, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGuidingStore } from "@/store/useGuidingStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Brush,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  Clock,
  ZoomIn,
  Settings2,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

// 数据验证Schema
const CalibrationDataSchema = z.object({
  raStars: z.number().min(0),
  decStars: z.number().min(0),
  cameraAngle: z.number(),
  orthogonalError: z.number(),
  raSpeed: z.number().min(0),
  decSpeed: z.number().min(0),
});

const CalibrationSettingsSchema = z.object({
  modifiedAt: z.string(),
  focalLength: z.number().positive(),
  resolution: z.string(),
  raDirection: z.string(),
  decValue: z.number(),
  rotationAngle: z.number(),
});

export default function CalibrationData() {
  const { data, settings } = useGuidingStore().calibration;
  const [timeRange, setTimeRange] = useState("1h");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  // 数据验证
  const validateData = useCallback(() => {
    try {
      CalibrationDataSchema.parse(data);
      CalibrationSettingsSchema.parse(settings);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "数据验证失败",
          description: error.errors[0].message,
        });
      }
      return false;
    }
  }, [data, settings]);

  // 图表数据处理
  const calibrationData = Array.isArray(data) ? data : []; // Ensure data is an array
  const chartData = useMemo(() => {
    return calibrationData.map(
      (item: { name: string; ra: number; dec: number; error: number }) => ({
        ...item,
        error: Number(item.error.toFixed(2)),
      })
    );
  }, [calibrationData]);

  // 刷新数据处理
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // 模拟数据刷新
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!validateData()) {
        return;
      }
      toast({
        title: "刷新成功",
        description: "校准数据已更新",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "刷新失败",
        description: "请稍后重试",
      });
    } finally {
      setIsLoading(false);
    }
  }, [validateData]);

  // 导出数据处理
  const handleExport = useCallback(() => {
    try {
      const exportData = JSON.stringify({ data, settings }, null, 2);
      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `calibration-data-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "导出成功",
        description: "校准数据已导出到文件",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "导出失败",
        description: "请稍后重试",
      });
    }
  }, [data, settings]);

  return (
    <motion.div className="grid grid-cols-1 gap-2 p-2">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="col-span-full"
      >
        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm text-gray-300">
                  校准数据趋势
                </CardTitle>
                {isLoading && <Progress value={undefined} className="w-20" />}
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400"
                        onClick={handleRefresh}
                        disabled={isLoading}
                      >
                        <RefreshCw
                          className={`w-4 h-4 mr-2 ${
                            isLoading ? "animate-spin" : ""
                          }`}
                        />
                        刷新
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>刷新校准数据</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400"
                        onClick={handleExport}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        导出
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>导出校准数据</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardDescription className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              最近1小时校准数据趋势
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                onMouseMove={(e) => {
                  if (e && e.activePayload) {
                    setSelectedDataPoint(e.activePayload[0].payload);
                  }
                }}
                onMouseLeave={() => setSelectedDataPoint(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 border border-gray-700 p-2 rounded-lg shadow-lg">
                          <p className="text-sm text-gray-300">
                            时间点: {payload[0].payload.name}
                          </p>
                          <p className="text-sm text-blue-400">
                            赤经: {payload[0].value}
                          </p>
                          <p className="text-sm text-green-400">
                            赤纬: {payload[1].value}
                          </p>
                          <p className="text-sm text-red-400">
                            误差: {payload[2].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: 10,
                  }}
                />
                <ReferenceLine y={0} stroke="#4b5563" />
                <Line
                  type="monotone"
                  dataKey="ra"
                  name="赤经"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="dec"
                  name="赤纬"
                  stroke="#10b981"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="error"
                  name="误差"
                  stroke="#f87171"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  activeDot={{ r: 6 }}
                  dot={{ r: 4 }}
                />
                <Brush
                  dataKey="name"
                  height={20}
                  stroke="#4b5563"
                  fill="#1f2937"
                  travellerWidth={10}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                校准数据详情
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Filter className="w-4 h-4 mr-2" />
                      筛选
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>筛选数据</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calibration" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="calibration" className="text-xs">
                  校准数据
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  赤道仪设置
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calibration">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-400 text-xs p-2">
                        赤经坐标:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {data.raStars}
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs p-2">
                        赤纬坐标:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {data.decStars}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-400 text-xs p-2">
                        相机角度:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {data.cameraAngle.toFixed(1)}°
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs p-2">
                        正交误差:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {data.orthogonalError.toFixed(1)}°
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-400 text-xs p-2">
                        赤经速率:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {data.raSpeed}°/s
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs p-2">
                        赤纬速率:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {data.decSpeed}°/s
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="settings">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-400 text-xs p-2">
                        修改时间:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {settings.modifiedAt}
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs p-2">
                        焦距:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {settings.focalLength}mm
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-400 text-xs p-2">
                        分辨率:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {settings.resolution}
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs p-2">
                        赤道仪方位:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {settings.raDirection}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-700/50 transition-colors">
                      <TableCell className="text-gray-400 text-xs p-2">
                        赤经值:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {settings.decValue}
                      </TableCell>
                      <TableCell className="text-gray-400 text-xs p-2">
                        旋转绝对值:
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        {settings.rotationAngle}°
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              最后更新: {new Date().toLocaleTimeString()}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
