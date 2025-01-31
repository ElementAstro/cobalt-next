"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DarkFieldLibrary from "@/components/guiding/darklibrary/DarkFieldLibrary";
import { useGuidingStore } from "@/store/useGuidingStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  History,
  Settings2,
  Calendar,
  FileDown,
  Plus,
} from "lucide-react";
import StatsCard from "@/components/guiding/darklibrary/StatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DarkLibraryPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const store = useGuidingStore();
  const { statistics, history } = store.darkField;

  // 首次加载时获取数据
  useEffect(() => {
    store.darkField.fetchStatistics();
    handleTimeRangeChange("30days");
  }, []);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const days = value === "7days" ? 7 : value === "30days" ? 30 : 90;
    store.darkField.fetchHistory(days);
  };

  const formatStatValue = (key: string, value: number) => {
    switch (key) {
      case 'librarySize':
        return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
      case 'totalTime':
        return `${(value / 3600).toFixed(1)}h`;
      case 'averageExposure':
        return `${value.toFixed(1)}s`;
      case 'avgTemperature':
        return `${value.toFixed(1)}°C`;
      case 'successRate':
        return `${(value * 100).toFixed(1)}%`;
      case 'compression':
        return `${value.toFixed(1)}x`;
      default:
        return value.toString();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="container p-4 mx-auto space-y-6 min-h-[100vh] pb-24"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b"
      >
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-bold tracking-tight">暗场库管理</h1>
              <p className="text-sm text-muted-foreground">优化您的天文摄影暗场收集</p>
            </motion.div>
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className="animate-in fade-in slide-in-from-top-1"
              >
                专业版
              </Badge>
              <Badge 
                className="bg-gradient-to-r from-blue-500 to-purple-500 animate-in fade-in slide-in-from-top-2"
              >
                实时同步
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Add system status indicators */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {store.darkField.systemStatus.isCameraConnected && (
                <Badge variant="outline" className="bg-green-500/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  相机已连接
                </Badge>
              )}
              {store.darkField.systemStatus.isTemperatureStable && (
                <Badge variant="outline" className="bg-blue-500/10">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                  温度稳定
                </Badge>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="library">创建暗场库</TabsTrigger>
          <TabsTrigger value="stats">统计信息</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <AnimatePresence mode="wait">
            <DarkFieldLibrary />
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="总帧数"
              value={statistics.totalFrames}
              description="所有暗场帧总数"
              icon={BarChart3}
            />
            <StatsCard
              title="平均曝光"
              value={formatStatValue('averageExposure', statistics.averageExposure)}
              description="平均曝光时间"
              icon={Settings2}
            />
            <StatsCard
              title="最近创建"
              value={statistics.lastCreated}
              description="最后更新时间"
              icon={History}
            />
            <StatsCard
              title="库大小"
              value={formatStatValue('librarySize', statistics.librarySize)}
              description="暗场库占用空间"
              icon={Settings2}
            />
            <StatsCard
              title="总曝光时间"
              value={formatStatValue('totalTime', statistics.totalTime)}
              description="累计曝光时间"
              icon={Calendar}
            />
            <StatsCard
              title="平均温度"
              value={formatStatValue('avgTemperature', statistics.avgTemperature)}
              description="传感器温度"
              icon={Settings2}
            />
            <StatsCard
              title="成功率"
              value={formatStatValue('successRate', statistics.successRate)}
              description="暗场创建成功率"
              icon={BarChart3}
            />
            <StatsCard
              title="压缩率"
              value={formatStatValue('compression', statistics.compression)}
              description="平均压缩比例"
              icon={FileDown}
            />
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>暗场库历史趋势</CardTitle>
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">最近7天</SelectItem>
                  <SelectItem value="30days">最近30天</SelectItem>
                  <SelectItem value="90days">最近90天</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={history}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid #444444",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="frames"
                      name="帧数"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      name="温度(°C)"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="exposure"
                      name="曝光(s)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="successCount"
                      name="成功帧数"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalCount"
                      name="总帧数"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add floating action button for quick actions */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button 
          size="lg" 
          className="rounded-full shadow-lg"
          onClick={store.darkField.startCreation}
        >
          <Plus className="mr-2 h-4 w-4" />
          快速创建
        </Button>
      </motion.div>
    </motion.div>
  );
}
