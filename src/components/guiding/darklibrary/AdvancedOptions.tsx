"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Settings2, Thermometer, Camera, Sliders } from "lucide-react";

interface Props {
  isoValue: number;
  setIsoValue: (value: number) => void;
  binningMode: string;
  setBinningMode: (value: string) => void;
  coolingEnabled: boolean;
  setCoolingEnabled: (value: boolean) => void;
  targetTemperature: number;
  setTargetTemperature: (value: number) => void;
  gainValue: number;
  setGainValue: (value: number) => void;
  offsetValue: number;
  setOffsetValue: (value: number) => void;
  isLoading: boolean;
}

const AdvancedOptions = memo(
  ({
    isoValue,
    setIsoValue,
    binningMode,
    setBinningMode,
    coolingEnabled,
    setCoolingEnabled,
    targetTemperature,
    setTargetTemperature,
    gainValue,
    setGainValue,
    offsetValue,
    setOffsetValue,
    isLoading,
  }: Props) => {
    const [isMockMode, setIsMockMode] = useState(false);
    const [activeTab, setActiveTab] = useState("camera");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const validateTemperature = useCallback((temp: number) => {
      if (temp < -20 || temp > 0) {
        toast({
          title: "温度设置错误",
          description: "目标温度必须在-20°C到0°C之间",
          variant: "destructive",
        });
        return false;
      }
      if (temp > -5) {
        toast({
          title: "温度警告",
          description: "建议将温度设置在-5°C以下以获得更好的效果",
          variant: "destructive",
        });
      }
      return true;
    }, []);

    const handleTemperatureChange = (value: number) => {
      if (validateTemperature(value)) {
        setTargetTemperature(value);
      }
    };

    const optionVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: custom * 0.1,
          duration: 0.3,
        },
      }),
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
          <Button
            variant={activeTab === "camera" ? "default" : "ghost"}
            onClick={() => setActiveTab("camera")}
            className="flex-1 gap-2"
          >
            <Camera className="h-4 w-4" />
            相机设置
          </Button>
          <Button
            variant={activeTab === "processing" ? "default" : "ghost"}
            onClick={() => setActiveTab("processing")}
            className="flex-1 gap-2"
          >
            <Sliders className="h-4 w-4" />
            处理选项
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "camera" && (
            <motion.div
              key="camera"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={optionVariants}
              className="space-y-6"
            >
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label>ISO 值:</Label>
                  <Slider
                    min={100}
                    max={3200}
                    step={100}
                    value={[isoValue]}
                    onValueChange={(value) => setIsoValue(value[0])}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">{isoValue}</p>
                </div>

                <div className="space-y-2">
                  <Label>Binning 模式:</Label>
                  <Select
                    value={binningMode}
                    onValueChange={(value) => {
                      setBinningMode(value);
                      toast({
                        title: "Binning 模式已更新",
                        description: `当前模式: ${value}`,
                      });
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1x1", "2x2", "3x3", "4x4"].map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="cooling"
                    checked={coolingEnabled}
                    onCheckedChange={(checked) => {
                      setCoolingEnabled(checked);
                      if (!checked) {
                        toast({
                          title: "制冷已关闭",
                          description: "相机温度将逐渐回升",
                        });
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Label htmlFor="cooling">启用制冷</Label>
                </div>

                {coolingEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label>目标温度 (°C):</Label>
                    <Slider
                      min={-20}
                      max={0}
                      step={1}
                      value={[targetTemperature]}
                      onValueChange={(value) =>
                        handleTemperatureChange(value[0])
                      }
                      disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground">
                      {targetTemperature}°C
                    </p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label>增益值:</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[gainValue]}
                    onValueChange={(value) => setGainValue(value[0])}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">{gainValue}</p>
                </div>

                <div className="space-y-2">
                  <Label>偏移值:</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[offsetValue]}
                    onValueChange={(value) => setOffsetValue(value[0])}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">{offsetValue}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="mockMode"
                    checked={isMockMode}
                    onCheckedChange={(checked) => {
                      setIsMockMode(checked);
                      toast({
                        title: checked ? "模拟模式已启用" : "模拟模式已禁用",
                        variant: checked ? "default" : "destructive",
                      });
                    }}
                    disabled={isLoading}
                  />
                  <Label htmlFor="mockMode">启用模拟模式</Label>
                </div>

                <div className="space-y-2">
                  <Label>快门模式:</Label>
                  <Select
                    defaultValue="electronic"
                    onValueChange={(value) =>
                      toast({
                        title: "快门模式已更新",
                        description: `当前模式: ${value}`,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronic">电子快门</SelectItem>
                      <SelectItem value="mechanical">机械快门</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "processing" && (
            <motion.div
              key="processing"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={optionVariants}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label>暗场校正方法:</Label>
                <Select
                  defaultValue="average"
                  onValueChange={(value) =>
                    toast({
                      title: "暗场校正方法已更新",
                      description: `当前方法: ${value}`,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="average">平均值</SelectItem>
                    <SelectItem value="median">中值</SelectItem>
                    <SelectItem value="kappa-sigma">Kappa-Sigma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>噪声降低强度:</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[50]}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>热像素检测阈值:</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[30]}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoOptimize"
                  defaultChecked={true}
                  disabled={isLoading}
                  onCheckedChange={(checked) =>
                    toast({
                      title: checked ? "自动优化已启用" : "自动优化已禁用",
                      variant: checked ? "default" : "destructive",
                    })
                  }
                />
                <Label htmlFor="autoOptimize">自动优化处理参数</Label>
              </div>

              <div className="space-y-2">
                <Label>帧对齐方法:</Label>
                <Select
                  defaultValue="star"
                  onValueChange={(value) =>
                    toast({
                      title: "帧对齐方法已更新",
                      description: `当前方法: ${value}`,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="star">星点对齐</SelectItem>
                    <SelectItem value="pixel">像素对齐</SelectItem>
                    <SelectItem value="none">不对齐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AdvancedOptions.displayName = "AdvancedOptions";
export default AdvancedOptions;
