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
import styled from "styled-components";

const Container = styled(motion.div)`
  color: white;
  background-color: #1f2937;
  min-height: 100vh;
  padding: 1rem;
`;

const StyledCard = styled(Card)`
  background-color: #374151;
  border-color: #4b5563;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
`;

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

  const handleStartGuiding = () => {
    startGuiding();
    toast({
      title: "Guiding Started",
      description: "导星已开始。",
    });
  };

  const handleStopGuiding = () => {
    stopGuiding();
    toast({
      title: "Guiding Stopped",
      description: "导星已停止。",
    });
  };

  const handleDither = () => {
    dither(parseInt(ditherPixels));
    toast({
      title: "Dithering",
      description: `已进行 ${ditherPixels} 像素的抖动。`,
    });
  };

  const handleSettingsChange = () => {
    setGuiderSettings({
      ditherPixels: parseInt(ditherPixels),
      settleTimeout: parseInt(settleTimeout),
    });
    toast({
      title: "Settings Updated",
      description: "导星仪设置已更新。",
    });
  };

  const handleFilterChange = () => {
    changeFilter(parseInt(selectedFilter));
    toast({
      title: "更换滤镜",
      description: `已切换至滤镜 ${selectedFilter}`,
    });
  };

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <DeviceSelector
        deviceType="Guider"
        devices={[
          "ZWO ASI120MM Mini",
          "Starlight Xpress Lodestar X2",
          "QHY5L-II-M",
        ]}
        onDeviceChange={(device) => console.log(`Selected guider: ${device}`)}
      />
      <motion.div
        variants={itemVariants}
        className="mt-6 grid gap-4 lg:grid-cols-2"
      >
        <StyledCard>
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
                <div className="text-sm">{guiderInfo.pixelScale} arcsec/px</div>
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
                  className="bg-gray-700"
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
                  className="bg-gray-700 text-white"
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
                  className="bg-gray-700 text-white"
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
                  <SelectTrigger
                    id="phd2-profile"
                    className="bg-gray-700 text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    <SelectItem value="default">默认</SelectItem>
                    <SelectItem value="aggressive">激进</SelectItem>
                    <SelectItem value="conservative">保守</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleSettingsChange}
                className="w-full bg-gray-700 hover:bg-gray-600"
              >
                应用设置
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2 mt-4">
              <Label>描述</Label>
              <div className="text-sm">{guiderInfo.description}</div>
            </motion.div>
          </CardContent>
        </StyledCard>

        <StyledCard>
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
                  className="w-full bg-gray-700 hover:bg-gray-600"
                >
                  开始导星
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <Button
                  variant="destructive"
                  onClick={handleStopGuiding}
                  disabled={guiderInfo.state !== "Guiding"}
                  className="w-full bg-red-700 hover:bg-red-600"
                >
                  停止导星
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <Button
                  onClick={handleDither}
                  disabled={guiderInfo.state !== "Guiding"}
                  className="w-full bg-gray-700 hover:bg-gray-600"
                >
                  抖动
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </StyledCard>
      </motion.div>
    </Container>
  );
}
