"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { focuserApi } from "@/services/device/focuser";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import { useFocuserStore } from "@/lib/store/device/focuser";

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

export function FocuserPage() {
  const [inputPosition, setInputPosition] = useState("12500");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    targetPosition,
    temperatureCompensation,
    focuserInfo,
    isConnected,
    setTargetPosition,
    setTemperatureCompensation,
    moveFocuser,
  } = useFocuserStore();
  const [autoFocusing, setAutoFocusing] = useState(false);
  const [tempCompCurve, setTempCompCurve] = useState<[number, number][]>([]);

  const handleError = (error: any) => {
    toast({
      variant: "destructive",
      title: "操作失败",
      description: error.message || "未知错误",
    });
  };

  const handleMove = async (steps: number) => {
    try {
      setIsLoading(true);
      await focuserApi.moveFocuser(steps);
      toast({
        title: "移动聚焦器",
        description: `正在移动 ${steps} 步`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToPosition = async () => {
    const position = parseInt(inputPosition);
    try {
      setIsLoading(true);
      await focuserApi.setPosition(position);
      toast({
        title: "移动聚焦器",
        description: `正在移动到位置 ${position}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemperatureCompensation = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      await focuserApi.setTemperatureCompensation(enabled);
      setTemperatureCompensation(enabled);
      toast({
        title: "温度补偿",
        description: `温度补偿已${enabled ? "启用" : "禁用"}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackflashCompensation = async (enabled: boolean) => {
    try {
      setIsLoading(true);
      await focuserApi.setBackflashCompensation(enabled);
      toast({
        title: "反向间隙补偿",
        description: `反向间隙补偿已${enabled ? "启用" : "禁用"}`,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoFocus = async () => {
    try {
      setAutoFocusing(true);
      setIsLoading(true);
      // TODO: 实现自动对焦逻辑
      // 可以通过分析多个位置的图像清晰度来确定最佳焦点
      // 这需要与相机服务配合
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "自动对焦",
        description: "自动对焦完成",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setAutoFocusing(false);
      setIsLoading(false);
    }
  };

  const addTempCompPoint = async () => {
    try {
      setIsLoading(true);
      const newPoint: [number, number] = [
        focuserInfo.temperature,
        focuserInfo.position,
      ];
      setTempCompCurve([...tempCompCurve, newPoint]);
      // TODO: 保存温度补偿点到后端
      toast({
        title: "温度补偿",
        description: "已添加温度补偿点",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 设备连接状态变化时的处理
  const handleDeviceChange = async (deviceId: string) => {
    try {
      setIsLoading(true);
      if (isConnected) {
        await focuserApi.disconnect();
      } else {
        await focuserApi.connect();
      }
    } catch (error) {
      handleError(error);
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
      <div className="max-w-7xl mx-auto space-y-6">
        <DeviceSelector
          deviceType="Focuser"
          onDeviceChange={handleDeviceChange}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Focuser Information</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>Position</Label>
                  <div className="text-sm">{focuserInfo.position}</div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>Temperature</Label>
                  <div className="text-sm">{focuserInfo.temperature}°C</div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-2"
                >
                  <Label htmlFor="temp-comp">Temperature Compensation</Label>
                  <Switch
                    id="temp-comp"
                    checked={temperatureCompensation}
                    onCheckedChange={handleTemperatureCompensation}
                  />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Focuser Control</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col space-y-4"
                >
                  <Label htmlFor="target-position">Target Position</Label>
                  <div className="flex space-x-4">
                    <Input
                      id="target-position"
                      type="number"
                      value={inputPosition}
                      onChange={(e) => setInputPosition(e.target.value)}
                      className="flex-1 bg-gray-700"
                    />
                    <Button
                      onClick={handleMoveToPosition}
                      className="whitespace-nowrap"
                    >
                      Move To
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-center gap-4"
                >
                  <Button
                    variant="secondary"
                    onClick={() => handleMove(-1000)}
                    className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                  >
                    <ChevronFirst className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleMove(-100)}
                    className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleMove(100)}
                    className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleMove(1000)}
                    className="min-w-[48px] h-[48px] sm:min-w-[64px] sm:h-[64px]"
                  >
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700 shadow-xl rounded-2xl transition-transform duration-200 hover:-translate-y-1">
          <CardHeader>
            <CardTitle>自动对焦</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div variants={itemVariants} className="space-y-4">
              <Button onClick={startAutoFocus} disabled={autoFocusing}>
                {autoFocusing ? "对焦中..." : "开始自动对焦"}
              </Button>

              <div className="space-y-2">
                <Label>温度补偿曲线</Label>
                <Button onClick={addTempCompPoint} variant="outline">
                  添加当前点
                </Button>
                {tempCompCurve.map((point, index) => (
                  <div key={index} className="text-sm">
                    {point[0].toFixed(1)}°C @ {point[1]}步
                  </div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
