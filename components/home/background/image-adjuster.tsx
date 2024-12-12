"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCcw,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ImageAdjusterProps {
  size: string;
  position: string;
  rotation: number;
  opacity: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
  onSizeChange: (size: string) => void;
  onPositionChange: (position: string) => void;
  onRotationChange: (rotation: number) => void;
  onOpacityChange: (opacity: number) => void;
  onScaleChange: (scale: number) => void;
  onFlipXChange: (flip: boolean) => void;
  onFlipYChange: (flip: boolean) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function ImageAdjuster({
  size,
  position,
  rotation,
  opacity,
  scale = 1,
  flipX = false,
  flipY = false,
  onSizeChange,
  onPositionChange,
  onRotationChange,
  onOpacityChange,
  onScaleChange,
  onFlipXChange,
  onFlipYChange,
}: ImageAdjusterProps) {
  const sizes = [
    "auto",
    "cover",
    "contain",
    "100% 100%",
    "50% 50%",
    "75% 75%",
    "125% 125%",
    "150% 150%",
    "200% 200%",
  ];

  const positions = [
    "center center",
    "top left",
    "top center",
    "top right",
    "center left",
    "center right",
    "bottom left",
    "bottom center",
    "bottom right",
  ];

  const handleReset = () => {
    onSizeChange("cover");
    onPositionChange("center center");
    onRotationChange(0);
    onOpacityChange(1);
    onScaleChange(1);
    onFlipXChange(false);
    onFlipYChange(false);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 space-y-6">
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center"
          >
            <h3 className="text-lg font-semibold text-white">图片调整</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="hover:bg-gray-800"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label htmlFor="image-size" className="text-gray-400">
                图片大小
              </Label>
              <Select value={size} onValueChange={onSizeChange}>
                <SelectTrigger
                  id="image-size"
                  className="bg-gray-800 border-gray-700"
                >
                  <SelectValue placeholder="选择图片大小" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-position" className="text-gray-400">
                图片位置
              </Label>
              <Select value={position} onValueChange={onPositionChange}>
                <SelectTrigger
                  id="image-position"
                  className="bg-gray-800 border-gray-700"
                >
                  <SelectValue placeholder="选择图片位置" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {positions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-rotation" className="text-gray-400">
                图片旋转: {rotation}°
              </Label>
              <Slider
                id="image-rotation"
                min={0}
                max={360}
                step={1}
                value={[rotation]}
                onValueChange={(value) => onRotationChange(value[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-scale" className="text-gray-400">
                图片缩放: {scale.toFixed(2)}x
              </Label>
              <Slider
                id="image-scale"
                min={0.1}
                max={3}
                step={0.1}
                value={[scale]}
                onValueChange={(value) => onScaleChange(value[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-opacity" className="text-gray-400">
                不透明度: {opacity.toFixed(2)}
              </Label>
              <Slider
                id="image-opacity"
                min={0}
                max={1}
                step={0.01}
                value={[opacity]}
                onValueChange={(value) => onOpacityChange(value[0])}
                className="py-2"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="flip-x"
                checked={flipX}
                onCheckedChange={onFlipXChange}
              />
              <Label htmlFor="flip-x" className="text-gray-400">
                水平翻转
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="flip-y"
                checked={flipY}
                onCheckedChange={onFlipYChange}
              />
              <Label htmlFor="flip-y" className="text-gray-400">
                垂直翻转
              </Label>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
