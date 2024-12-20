"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Camera, Pause, Play, RefreshCw, Settings } from "lucide-react";
import {
  useExposureStore,
  ExposureSettings,
  State,
} from "@/lib/store/dashboard";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ExposureControlsProps {
  settings: ExposureSettings;
  onParameterClick: (parameter: string) => void;
  onCapture: (
    exposureTime: number,
    burstMode: boolean,
    exposureMode: string,
    whiteBalance: string
  ) => void;
  onPause: () => void;
  isShooting: boolean;
  isPaused: boolean;
  progress: number;
}

const ExposureControls: React.FC<ExposureControlsProps> = React.memo(
  ({
    settings,
    onParameterClick,
    onCapture,
    onPause,
    isShooting,
    isPaused,
    progress,
  }) => {
    const {
      exposureTime,
      burstMode,
      burstCount,
      filterType,
      gain,
      offset,
      binning,
      resetSettings,
      setExposureTime,
      toggleBurstMode,
      setBurstCount,
      setFilterType,
      setGain,
      setOffset,
      setBinning,
    } = useExposureStore();

    useEffect(() => {
      resetSettings(settings);
    }, [settings, resetSettings]);

    const handleCaptureClick = () => {
      onCapture(
        exposureTime,
        burstMode,
        settings.exposureMode,
        settings.whiteBalance
      );
    };

    const handleReset = () => {
      resetSettings(settings);
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center h-full p-4 rounded-lg shadow-lg bg-gray-900 dark:bg-gray-800"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-end w-full mb-4"
        >
          <motion.div variants={itemVariants}>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-white">
                  <Settings />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="left"
                className="w-80 p-4 bg-gray-800 text-white rounded-md shadow-lg"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor="burstMode">连拍模式</Label>
                    <Switch
                      id="burstMode"
                      checked={burstMode}
                      onCheckedChange={(checked) => toggleBurstMode(checked)}
                      className="bg-gray-600"
                    />
                  </motion.div>
                  {burstMode && (
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col"
                    >
                      <Label htmlFor="burstCount">连拍次数</Label>
                      <Input
                        id="burstCount"
                        type="number"
                        min="2"
                        max="10"
                        value={burstCount}
                        onChange={(e) => setBurstCount(Number(e.target.value))}
                        className="mt-1 bg-gray-700 text-white"
                      />
                    </motion.div>
                  )}
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <Label htmlFor="exposureTime">曝光时间 (秒)</Label>
                    <Slider
                      id="exposureTime"
                      min={1}
                      max={3600}
                      step={1}
                      value={[exposureTime]}
                      onValueChange={(value) => setExposureTime(value[0])}
                      className="mt-2"
                    />
                    <div className="text-sm text-right text-gray-400">
                      {exposureTime} 秒
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <Label htmlFor="filterType">滤镜类型</Label>
                    <Select
                      value={filterType}
                      onValueChange={(value) => setFilterType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择滤镜类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">无</SelectItem>
                        <SelectItem value="Black and White">黑白</SelectItem>
                        <SelectItem value="Sepia">棕褐色</SelectItem>
                        <SelectItem value="Vivid">鲜艳</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <Label htmlFor="gain">增益</Label>
                    <Slider
                      id="gain"
                      min={0}
                      max={100}
                      step={1}
                      value={[gain]}
                      onValueChange={(value) => setGain(value[0])}
                      className="mt-2"
                    />
                    <div className="text-sm text-right text-gray-400">
                      {gain}
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <Label htmlFor="offset">偏置</Label>
                    <Slider
                      id="offset"
                      min={0}
                      max={100}
                      step={1}
                      value={[offset]}
                      onValueChange={(value) => setOffset(value[0])}
                      className="mt-2"
                    />
                    <div className="text-sm text-right text-gray-400">
                      {offset}
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col">
                    <Label htmlFor="binning">像素合并</Label>
                    <Select
                      value={binning}
                      onValueChange={(value) => setBinning(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择像素合并" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x1">1x1</SelectItem>
                        <SelectItem value="2x2">2x2</SelectItem>
                        <SelectItem value="3x3">3x3</SelectItem>
                        <SelectItem value="4x4">4x4</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600"
                      onClick={handleReset}
                    >
                      <RefreshCw />
                      <span>重置</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </PopoverContent>
            </Popover>
          </motion.div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full mb-4"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 flex items-center justify-center space-x-2"
              onClick={handleCaptureClick}
              disabled={isShooting}
            >
              <Camera />
            </Button>
          </motion.div>
        </motion.div>
        {isShooting && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="w-full mb-4"
          >
            <Progress value={progress} className="w-full mb-4" />
            <motion.div variants={itemVariants} className="w-full">
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 flex items-center justify-center space-x-2"
                onClick={onPause}
              >
                {isPaused ? <Play /> : <Pause />}
              </Button>
            </motion.div>
          </motion.div>
        )}
        <AnimatePresence>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="secondary"
              className="w-full mt-4 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleReset}
            >
              <RefreshCw />
            </Button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }
);

ExposureControls.displayName = "ExposureControls";

export default ExposureControls;
