"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Camera as CameraIcon,
  Settings,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Save,
  Thermometer,
  Timer,
  Signal,
} from "lucide-react";

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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function Camera() {
  return (
    <motion.div
      className="text-white bg-gray-800 min-h-screen p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Device Selector */}
      <Card className="bg-gray-700 border-gray-600 shadow-lg rounded-lg mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CameraIcon className="w-5 h-5" />
            相机选择
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="Canon EOS Ra">
            <SelectTrigger className="w-full bg-gray-600 text-white">
              <SelectValue placeholder="选择相机型号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Canon EOS Ra">Canon EOS Ra</SelectItem>
              <SelectItem value="Nikon D850">Nikon D850</SelectItem>
              <SelectItem value="Sony A7R IV">Sony A7R IV</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Camera Information */}
      <Card className="bg-gray-700 border-gray-600 shadow-lg rounded-lg mb-4">
        <CardHeader>
          <CardTitle>相机信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>传感器类型</Label>
              <div className="text-sm">背照式CMOS</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>传感器尺寸</Label>
              <div className="text-sm">35.9mm x 24mm</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>像素尺寸</Label>
              <div className="text-sm">3.76μm</div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>当前温度</Label>
              <div className="text-sm">-15°C</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Exposure Control */}
      <Card className="bg-gray-700 border-gray-600 shadow-lg rounded-lg mb-4">
        <CardHeader>
          <CardTitle>曝光控制</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="exposure">曝光时间 (秒)</Label>
              <Input
                id="exposure"
                type="number"
                defaultValue={60}
                min="0.001"
                step="0.001"
                className="bg-gray-600 text-white"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="gain">增益</Label>
              <Input
                id="gain"
                type="number"
                defaultValue={20}
                min="0"
                className="bg-gray-600 text-white"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="binning">像素合并</Label>
              <Select defaultValue="1">
                <SelectTrigger className="bg-gray-600 text-white">
                  <SelectValue placeholder="选择合并模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x1</SelectItem>
                  <SelectItem value="2">2x2</SelectItem>
                  <SelectItem value="4">4x4</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.div variants={itemVariants}>
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <ZoomIn className="w-4 h-4 mr-2" />
                开始曝光
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <ZoomOut className="w-4 h-4 mr-2" />
                中止曝光
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Control */}
      <Card className="bg-gray-700 border-gray-600 shadow-lg rounded-lg mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>温度控制</CardTitle>
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-2"
            >
              <Label htmlFor="cooler">制冷器</Label>
              <Switch id="cooler" />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <motion.div variants={itemVariants} className="flex flex-col">
              <Label htmlFor="target-temp">目标温度 (°C)</Label>
              <Input
                id="target-temp"
                type="number"
                defaultValue={-10}
                className="w-full sm:w-24 bg-gray-600 text-white"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button className="bg-green-600 hover:bg-green-700">
                <Thermometer className="w-4 h-4 mr-2" />
                设置
              </Button>
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="mt-6">
            <div className="h-32 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-white">温度曲线图</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Image Control */}
      <Card className="bg-gray-700 border-gray-600 shadow-lg rounded-lg mb-4">
        <CardHeader>
          <CardTitle>图像控制</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>文件格式</Label>
              <Select defaultValue="FITS">
                <SelectTrigger className="bg-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FITS">FITS</SelectItem>
                  <SelectItem value="TIFF">TIFF</SelectItem>
                  <SelectItem value="RAW">RAW</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                实时预览
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700">
                <Save className="w-4 h-4 mr-2" />
                保存图像
              </Button>
            </motion.div>
          </div>
          <div className="mt-4">
            <Label>直方图</Label>
            <div className="h-32 bg-gray-600 rounded flex items-center justify-center">
              <span className="text-white">直方图</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="bg-gray-700 border-gray-600 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>附加信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>连接状态</Label>
              <Badge variant="default">已连接</Badge>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>缓冲率</Label>
              <Progress value={85} />
              <span className="text-sm text-gray-400">85%</span>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>温度</Label>
              <div className="flex items-center">
                <Thermometer className="w-4 h-4 mr-2" />
                <span>38°C</span>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>曝光</Label>
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                <span>1/100s</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
