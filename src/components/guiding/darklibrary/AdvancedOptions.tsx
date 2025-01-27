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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const AdvancedOptions = memo(({ ...props }: Props) => {
  const [isMockMode, setIsMockMode] = useState(false);
  const [activeTab, setActiveTab] = useState("camera");
  const [isMobile, setIsMobile] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(props.targetTemperature);
  const [stabilized, setStabilized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (props.coolingEnabled) {
      const interval = setInterval(() => {
        const simulatedTemp =
          currentTemp + (props.targetTemperature - currentTemp) * 0.1;
        setCurrentTemp(simulatedTemp);
        setStabilized(Math.abs(simulatedTemp - props.targetTemperature) < 0.5);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [props.coolingEnabled, props.targetTemperature, currentTemp]);

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
      props.setTargetTemperature(value);
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-4 w-4" />
              相机控制
              {stabilized && props.coolingEnabled && (
                <Badge variant="secondary" className="ml-auto">
                  温度已稳定
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ISO 值:</Label>
              <Slider
                min={100}
                max={3200}
                step={100}
                value={[props.isoValue]}
                onValueChange={(value) => props.setIsoValue(value[0])}
                disabled={props.isLoading}
              />
              <p className="text-sm text-muted-foreground">{props.isoValue}</p>
            </div>

            <div className="space-y-2">
              <Label>Binning 模式:</Label>
              <Select
                value={props.binningMode}
                onValueChange={(value) => {
                  props.setBinningMode(value);
                  toast({
                    title: "Binning 模式已更新",
                    description: `当前模式: ${value}`,
                  });
                }}
                disabled={props.isLoading}
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
                checked={props.coolingEnabled}
                onCheckedChange={(checked) => {
                  props.setCoolingEnabled(checked);
                  if (!checked) {
                    toast({
                      title: "制冷已关闭",
                      description: "相机温度将逐渐回升",
                    });
                  }
                }}
                disabled={props.isLoading}
              />
              <Label htmlFor="cooling">启用制冷</Label>
            </div>

            {props.coolingEnabled && (
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
                  value={[props.targetTemperature]}
                  onValueChange={(value) => handleTemperatureChange(value[0])}
                  disabled={props.isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  {props.targetTemperature}°C
                </p>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label>增益值:</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[props.gainValue]}
                onValueChange={(value) => props.setGainValue(value[0])}
                disabled={props.isLoading}
              />
              <p className="text-sm text-muted-foreground">{props.gainValue}</p>
            </div>

            <div className="space-y-2">
              <Label>偏移值:</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[props.offsetValue]}
                onValueChange={(value) => props.setOffsetValue(value[0])}
                disabled={props.isLoading}
              />
              <p className="text-sm text-muted-foreground">
                {props.offsetValue}
              </p>
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
                disabled={props.isLoading}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              处理选项
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                disabled={props.isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>热像素检测阈值:</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={[30]}
                disabled={props.isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoOptimize"
                defaultChecked={true}
                disabled={props.isLoading}
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            温度控制
          </CardTitle>
          <CardDescription>
            当前温度: {currentTemp.toFixed(1)}°C
            {props.coolingEnabled && ` (目标: ${props.targetTemperature}°C)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>目标温度 (°C):</Label>
            <Slider
              min={-20}
              max={0}
              step={1}
              value={[props.targetTemperature]}
              onValueChange={(value) => handleTemperatureChange(value[0])}
              disabled={props.isLoading}
            />
            <p className="text-sm text-muted-foreground">
              {props.targetTemperature}°C
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AdvancedOptions.displayName = "AdvancedOptions";
export default AdvancedOptions;
