"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Camera,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Save,
  Upload,
} from "lucide-react";
import { useExposureStore, ExposureSettings } from "@/store/useDashboardStore";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { cn } from "@/lib/utils";
import { ExposureTimeSlider } from "./exposure-slider";
import { formatExposureTime } from "@/utils/format-exposure-time";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const progressVariants: Variants = {
  initial: { width: 0 },
  animate: {
    width: "100%",
    transition: {
      duration: 1,
      ease: "linear",
    },
  },
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
  onSavePreset: (name: string) => void;
  onLoadPreset: (name: string) => void;
  histogramData?: number[];
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
    histogramData,
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
        className="flex flex-col items-center justify-center h-full p-4 rounded-lg shadow-lg "
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
                className="w-80 p-4 bg-gray-800 text-white rounded-md shadow-lg mr-4"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Left Column */}
                  <div className="space-y-4">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor="burstMode">连拍模式</Label>
                      <Checkbox
                        id="burstMode"
                        checked={burstMode}
                        onCheckedChange={(checked) =>
                          toggleBurstMode(checked as boolean)
                        }
                        className=""
                      />
                    </motion.div>

                    {burstMode && (
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="burstCount">连拍次数</Label>
                        <Input
                          id="burstCount"
                          type="number"
                          min="2"
                          max="10"
                          value={burstCount}
                          onChange={(e) =>
                            setBurstCount(Number(e.target.value))
                          }
                          className="mt-1 bg-gray-700 text-white w-full"
                        />
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
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

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="filterType">滤镜类型</Label>
                      <Select
                        value={filterType}
                        onValueChange={(value) => setFilterType(value)}
                      >
                        <SelectTrigger className="w-full">
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
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <motion.div variants={itemVariants}>
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

                    <motion.div variants={itemVariants}>
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

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="binning">像素合并</Label>
                      <Select
                        value={binning}
                        onValueChange={(value) => setBinning(value)}
                      >
                        <SelectTrigger className="w-full">
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
                  </div>

                  {/* Full Width Reset Button */}
                  <motion.div variants={itemVariants} className="col-span-2">
                    <Button
                      variant="secondary"
                      className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600"
                      onClick={handleReset}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>重置</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </PopoverContent>
            </Popover>
          </motion.div>
        </motion.div>
        {/* Histogram Display */}
        {histogramData && (
          <motion.div
            variants={itemVariants}
            className="w-full mb-4 p-2 bg-gray-700 rounded-lg"
          >
            <div className="flex items-end h-20">
              {histogramData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-500"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>255</span>
            </div>
          </motion.div>
        )}

        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>
            <motion.div variants={itemVariants} className="w-full mb-4">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <span>Exposure Settings</span>
                <span>{formatExposureTime(exposureTime)}</span>
              </Button>
            </motion.div>
          </HoverCardTrigger>
          <HoverCardContent
            side="left"
            align="start"
            className="w-96 p-0 bg-gray-800 border-gray-700"
          >
            <ExposureTimeSlider />
          </HoverCardContent>
        </HoverCard>

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
            className="w-full space-y-4 flex flex-col items-center"
          >
            {/* Replace Progress with AnimatedCircularProgressBar */}
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-center"
            >
              <AnimatedCircularProgressBar
                max={100}
                min={0}
                value={progress}
                gaugePrimaryColor="#10B981" // Green color for primary
                gaugeSecondaryColor="#1F2937" // Dark color for background
                className="transform-gpu"
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isPaused ? (
                  <span className="flex items-center gap-1">
                    <Pause className="w-4 h-4" />
                    已暂停
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    曝光中
                  </span>
                )}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full">
              <Button
                className={cn(
                  "w-full font-bold py-2 px-4 rounded-full transition duration-200 flex items-center justify-center space-x-2",
                  isPaused
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                )}
                onClick={onPause}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span>继续</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>暂停</span>
                  </>
                )}
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
