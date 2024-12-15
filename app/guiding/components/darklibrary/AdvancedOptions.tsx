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
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export default function AdvancedOptions({
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
}: Props) {
  const [isMockMode, setIsMockMode] = useState(false);
  const [activeTab, setActiveTab] = useState("camera");

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
    <motion.div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeTab === "camera" ? "default" : "outline"}
          onClick={() => setActiveTab("camera")}
          size="sm"
        >
          相机设置
        </Button>
        <Button
          variant={activeTab === "processing" ? "default" : "outline"}
          onClick={() => setActiveTab("processing")}
          size="sm"
        >
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
            className="space-y-4"
          >
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
                onValueChange={setBinningMode}
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
                onCheckedChange={setCoolingEnabled}
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
                  onValueChange={(value) => setTargetTemperature(value[0])}
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
                onCheckedChange={setIsMockMode}
                disabled={isLoading}
              />
              <Label htmlFor="mockMode">启用模拟模式</Label>
            </div>
            <div className="space-y-2">
              <Label>快门模式:</Label>
              <Select defaultValue="electronic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronic">电子快门</SelectItem>
                  <SelectItem value="mechanical">机械快门</SelectItem>
                </SelectContent>
              </Select>
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
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>暗场校正方法:</Label>
              <Select defaultValue="average">
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
