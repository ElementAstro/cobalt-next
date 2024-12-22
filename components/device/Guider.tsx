"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGuiderStore } from "@/lib/store/device/guiding";
import { DeviceSelector } from "./DeviceSelector";
import { motion } from "framer-motion";
import { guiderApi } from "@/services/device/guider";

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

export function GuiderPage() {
  const [ditherPixels, setDitherPixels] = useState("5");
  const [settleTimeout, setSettleTimeout] = useState("40");
  const { toast } = useToast();
  const {
    guiderInfo,
    startGuiding,
    stopGuiding,
    dither,
    setGuiderSettings,
    selectedFilter,
    setSelectedFilter,
    changeFilter,
  } = useGuiderStore();

  const handleStartGuiding = async () => {
    try {
      await guiderApi.startGuiding();
      toast({
        title: "Guiding Started",
        description: "导星已开始。",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "启动导星失败：" + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleStopGuiding = async () => {
    try {
      await guiderApi.stopGuiding();
      toast({
        title: "Guiding Stopped",
        description: "导星已停止。",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "停止导星失败：" + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDither = async () => {
    try {
      await guiderApi.dither(parseInt(ditherPixels));
      toast({
        title: "Dithering",
        description: `已进行 ${ditherPixels} 像素的抖动。`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "抖动失败：" + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSettingsChange = async () => {
    try {
      // 更新曝光时间
      if (guiderInfo.exposureTime !== undefined) {
        await guiderApi.setExposureTime(guiderInfo.exposureTime);
      }
      // 更新导星精度
      if (guiderInfo.guidingAccuracy !== undefined) {
        await guiderApi.setGuidingAccuracy(guiderInfo.guidingAccuracy);
      }
      setGuiderSettings({
        ditherPixels: parseInt(ditherPixels),
        settleTimeout: parseInt(settleTimeout),
      });
      toast({
        title: "Settings Updated",
        description: "导星仪设置已更新。",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "更新设置失败：" + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = () => {
    changeFilter(parseInt(selectedFilter));
    toast({
      title: "更换滤镜",
      description: `已切换至滤镜 ${selectedFilter}`,
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <DeviceSelector
          deviceType="Guider"
          onDeviceChange={(device) => console.log(`Selected guider: ${device}`)}
        />

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle>导星仪设置</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>像素刻度</Label>
                    <div className="text-sm">
                      {guiderInfo.pixelScale} arcsec/px
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label>状态</Label>
                    <div className="text-sm">{guiderInfo.state}</div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-2"
                  >
                    <Label htmlFor="show-corrections">显示校正</Label>
                    <Switch
                      id="show-corrections"
                      checked={guiderInfo.showCorrections}
                      onCheckedChange={(checked) => setGuiderSettings({})}
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="dither-pixels">抖动像素</Label>
                    <Input
                      id="dither-pixels"
                      type="number"
                      value={ditherPixels}
                      onChange={(e) => setDitherPixels(e.target.value)}
                      placeholder="输入像素"
                      className="bg-gray-700"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="settle-timeout">稳定超时</Label>
                    <Input
                      id="settle-timeout"
                      type="number"
                      value={settleTimeout}
                      onChange={(e) => setSettleTimeout(e.target.value)}
                      placeholder="输入超时"
                      className="bg-gray-700"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="phd2-profile">PHD2 配置文件</Label>
                    <Select
                      value={guiderInfo.phd2Profile}
                      onValueChange={(value) =>
                        setGuiderSettings({
                          phd2Profile: value,
                        })
                      }
                    >
                      <SelectTrigger id="phd2-profile" className="bg-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700">
                        <SelectItem value="default">默认</SelectItem>
                        <SelectItem value="aggressive">激进</SelectItem>
                        <SelectItem value="conservative">保守</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button onClick={handleSettingsChange} className="w-full">
                    应用设置
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2 mt-4">
                  <Label>描述</Label>
                  <div className="text-sm">{guiderInfo.description}</div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Side Panel */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle>导星控制</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div variants={itemVariants} className="flex-1">
                    <Button
                      onClick={handleStartGuiding}
                      disabled={guiderInfo.state === "Guiding"}
                      className="w-full"
                    >
                      开始导星
                    </Button>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex-1">
                    <Button
                      variant="destructive"
                      onClick={handleStopGuiding}
                      disabled={guiderInfo.state !== "Guiding"}
                      className="w-full"
                    >
                      停止导星
                    </Button>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex-1">
                    <Button
                      onClick={handleDither}
                      disabled={guiderInfo.state !== "Guiding"}
                      className="w-full"
                    >
                      抖动
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
