"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFilterWheelStore } from "@/lib/store/device/filterwheel";
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import { filterWheelApi } from "@/services/device/filterwheel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FilterWheelPage() {
  const { toast } = useToast();
  const {
    filterWheelInfo,
    selectedFilter,
    setSelectedFilter,
    isConnected,
    setConnected,
  } = useFilterWheelStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await filterWheelApi.connect();
      toast({
        title: "连接成功",
        description: "已成功连接到滤镜轮设备",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "连接失败");
      toast({
        variant: "destructive",
        title: "连接失败",
        description: "无法连接到滤镜轮设备",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await filterWheelApi.disconnect();
      toast({
        title: "断开连接",
        description: "已断开与滤镜轮设备的连接",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "断开连接失败");
      toast({
        variant: "destructive",
        title: "断开失败",
        description: "无法断开与滤镜轮设备的连接",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "请先连接设备",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await filterWheelApi.changeFilter(parseInt(selectedFilter));
      toast({
        title: "更换滤镜",
        description: `已切换至滤镜 ${
          filterWheelInfo.filters[parseInt(selectedFilter) - 1]
        }`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "更换滤镜失败");
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "更换滤镜失败",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <DeviceSelector
            deviceType="FilterWheel"
            onDeviceChange={(device) =>
              console.log(`Selected filter wheel: ${device}`)
            }
          />
          <div className="flex items-center gap-4">
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="px-4 py-2"
            >
              {isConnected ? (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              {isConnected ? "已连接" : "未连接"}
            </Badge>
            <Button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isLoading}
              variant={isConnected ? "destructive" : "default"}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isConnected ? "断开连接" : "连接"}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  滤镜轮信息
                  {filterWheelInfo.isMoving && (
                    <div className="flex items-center text-sm font-normal">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      正在移动...
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>名称</Label>
                    <div className="text-sm">{filterWheelInfo.name}</div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>驱动信息</Label>
                    <div className="text-sm">{filterWheelInfo.driverInfo}</div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>驱动版本</Label>
                    <div className="text-sm">
                      {filterWheelInfo.driverVersion}
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>当前滤镜</Label>
                    <div className="text-sm">
                      {filterWheelInfo.currentFilter}
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>描述</Label>
                    <div className="text-sm">{filterWheelInfo.description}</div>
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-8 space-y-6">
                  <div className="flex flex-col space-y-4">
                    <div className="w-full">
                      <Label htmlFor="filter-select">选择滤镜</Label>
                      <div className="flex gap-4 mt-2">
                        <Select
                          value={selectedFilter}
                          onValueChange={setSelectedFilter}
                          disabled={!isConnected || isLoading}
                        >
                          <SelectTrigger id="filter-select">
                            <SelectValue placeholder="请选择滤镜" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterWheelInfo.filters.map((filter, index) => (
                              <SelectItem
                                key={index}
                                value={(index + 1).toString()}
                              >
                                {filter}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleFilterChange}
                          disabled={!isConnected || isLoading}
                          className="min-w-[120px]"
                        >
                          {isLoading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          更换滤镜
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {filterWheelInfo.isMoving && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <Progress value={33} className="h-2" />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Panel */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>状态监控</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>当前位置</Label>
                    <div className="text-2xl font-semibold mt-1">
                      {filterWheelInfo.position} / {filterWheelInfo.maxPosition}
                    </div>
                  </div>
                  <div>
                    <Label>移动历史</Label>
                    <div className="mt-2 space-y-2">
                      {/* Add movement history display here */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
