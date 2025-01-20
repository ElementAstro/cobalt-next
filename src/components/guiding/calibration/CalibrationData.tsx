"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGuidingStore } from "@/store/useGuidingStore";
import { motion } from "framer-motion";
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
  ResponsiveContainer
} from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const calibrationData = [
  { name: "0", ra: 0, dec: 0, error: 0.1 },
  { name: "1", ra: 2, dec: 1, error: 0.3 },
  { name: "2", ra: 1.5, dec: 2.5, error: 0.2 },
  { name: "3", ra: 3, dec: 2, error: 0.4 },
];

export default function CalibrationData() {
  const { data, settings } = useGuidingStore().calibration;
  const [timeRange, setTimeRange] = useState("1h");

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 校准数据趋势 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="col-span-full"
      >
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-300">
                校准数据趋势
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs text-gray-500">
              最近1小时校准数据趋势
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={calibrationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: 8,
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
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="dec" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="error" 
                  stroke="#f87171" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  activeDot={{ r: 6 }}
                />
                <Brush 
                  dataKey="name"
                  height={20}
                  stroke="#4b5563"
                  fill="#1f2937"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* 数据详情 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="border-gray-700 bg-gray-800 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-300">
                校准数据详情
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
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
        </Card>
      </motion.div>
    </motion.div>
  );
}
