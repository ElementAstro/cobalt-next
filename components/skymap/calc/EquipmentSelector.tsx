"use client";

import { useState } from "react";
import { useAstronomyStore } from "@/lib/store/skymap/calc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Telescope, Camera, Eye, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalculatedValues {
  focalRatio: string;
  resolution: string;
  fieldOfView: string;
  dawesLimit: string;
}

export function EquipmentSelector() {
  const { isMetric, equipment, addEquipment, selectEquipment } =
    useAstronomyStore();
  const [angle, setAngle] = useState(0);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    focalLength: "",
    aperture: "",
    type: "telescope" as "telescope" | "camera" | "barlow" | "reducer",
  });

  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    focalRatio: "-",
    resolution: "-",
    fieldOfView: "-",
    dawesLimit: "-",
  });

  const convertToImperial = (value: string) => {
    return (parseFloat(value) / 25.4).toFixed(2);
  };

  const convertToMetric = (value: string) => {
    return (parseFloat(value) * 25.4).toFixed(2);
  };

  const handleAddEquipment = () => {
    if (
      newEquipment.name &&
      newEquipment.focalLength &&
      newEquipment.aperture
    ) {
      const equipmentToAdd = {
        id: Date.now().toString(),
        ...newEquipment,
        focalLength: parseFloat(newEquipment.focalLength),
        aperture: parseFloat(newEquipment.aperture),
      };
      addEquipment(equipmentToAdd);
      selectEquipment(equipmentToAdd.id);
      setNewEquipment({
        name: "",
        focalLength: "",
        aperture: "",
        type: "telescope",
      });
    }
  };

  const calculateValues = () => {
    const f = parseFloat(newEquipment.focalLength);
    const a = parseFloat(newEquipment.aperture);

    if (f && a) {
      const focalRatio = (f / a).toFixed(2);
      const resolution = (116.0 / a).toFixed(2);
      const fieldOfView = ((57.3 * 36) / f).toFixed(2);
      const dawesLimit = (115.8 / a).toFixed(2);

      setCalculatedValues({
        focalRatio,
        resolution,
        fieldOfView,
        dawesLimit,
      });
    }
  };

  // 新增功能：快速预设
  const presets = [
    {
      name: "标准折射",
      type: "telescope" as const,
      focalLength: 900,
      aperture: 90,
    },
    {
      name: "标准反射",
      type: "telescope" as const,
      focalLength: 1200,
      aperture: 200,
    },
    // ...more presets
  ];

  interface Preset {
    name: string;
    type: "telescope" | "camera" | "barlow" | "reducer";
    focalLength: number;
    aperture: number;
  }

  const applyPreset = (preset: Preset): void => {
    setNewEquipment({
      name: preset.name,
      type: preset.type,
      focalLength: preset.focalLength.toString(),
      aperture: preset.aperture.toString(),
    });
    calculateValues();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* 新增预设选择 */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              onClick={() => applyPreset(preset)}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span>{preset.name}</span>
              <span className="text-xs text-muted-foreground">
                {preset.focalLength}mm f/
                {(preset.focalLength / preset.aperture).toFixed(1)}
              </span>
            </Button>
          ))}
        </motion.div>

        <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center gap-4"
              whileHover={{ scale: 1.01 }}
            >
              <CardTitle className="text-xl font-bold text-gray-100">
                设备选择器
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => calculateValues()}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  计算参数
                </Button>
                <Button
                  onClick={handleAddEquipment}
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  添加设备
                </Button>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* 设备类型选择 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">设备类型</Label>
                <Select
                  value={newEquipment.type}
                  onValueChange={(value: any) =>
                    setNewEquipment({ ...newEquipment, type: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="telescope">
                      <div className="flex items-center">
                        <Telescope className="mr-2 h-4 w-4" />
                        望远镜
                      </div>
                    </SelectItem>
                    <SelectItem value="camera">
                      <div className="flex items-center">
                        <Camera className="mr-2 h-4 w-4" />
                        相机
                      </div>
                    </SelectItem>
                    <SelectItem value="barlow">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        巴洛镜
                      </div>
                    </SelectItem>
                    <SelectItem value="reducer">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        减焦镜
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* 设备名称输入 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">设备名称</Label>
                <Input
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                  placeholder="输入设备名称"
                  className="bg-gray-700 border-gray-600"
                />
              </motion.div>

              {/* 焦距输入 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">焦距</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newEquipment.focalLength}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        focalLength: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                  <span>{isMetric ? "mm" : "in"}</span>
                </div>
                {!isMetric && (
                  <p className="text-sm text-muted-foreground">
                    {convertToMetric(newEquipment.focalLength)} mm
                  </p>
                )}
              </motion.div>

              {/* 口径输入 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">口径</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newEquipment.aperture}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        aperture: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                  <span>{isMetric ? "mm" : "in"}</span>
                </div>
                {!isMetric && (
                  <p className="text-sm text-muted-foreground">
                    {convertToMetric(newEquipment.aperture)} mm
                  </p>
                )}
              </motion.div>

              {/* 角度选择 */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">角度: {angle}°</Label>
                <Slider
                  min={0}
                  max={359}
                  step={1}
                  value={[angle]}
                  onValueChange={(value) => setAngle(value[0])}
                  className="bg-gray-700"
                />
              </motion.div>
            </motion.div>

            {/* 计算结果显示 */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">焦比</Label>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {calculatedValues.focalRatio}
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">分辨率</Label>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {calculatedValues.resolution}
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">视场</Label>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {calculatedValues.fieldOfView}
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-gray-200">道威极限</Label>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {calculatedValues.dawesLimit}
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
