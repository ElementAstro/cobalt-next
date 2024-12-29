"use client";

import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled: boolean;
  ariaLabel: string;
  presets?: string[];
}

const PRESET_COLORS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#008000",
  "#000080",
  "#800000",
  "#808000",
];

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.1 } },
};

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  disabled,
  ariaLabel,
  presets = PRESET_COLORS,
}) => {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [inputColor, setInputColor] = useState(color);

  useEffect(() => {
    setInputColor(color);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    setInputColor(newColor);
    // Update recent colors
    setRecentColors((prev) => {
      const newRecent = [newColor, ...prev.filter((c) => c !== newColor)];
      return newRecent.slice(0, 6);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            disabled={disabled}
            aria-label={`选择${ariaLabel}`}
            className="relative"
          >
            选择颜色
            <motion.div
              className="absolute inset-0 rounded-md"
              style={{ backgroundColor: color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            />
          </Button>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        <DialogContent className="bg-gray-800 p-4 rounded-lg max-w-md">
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DialogHeader>
              <DialogTitle className="text-white">选择颜色</DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-700"
                >
                  关闭
                </Button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4">
              <HexColorPicker
                color={color}
                onChange={handleColorChange}
                className="w-full h-64"
              />

              <div className="flex items-center gap-2">
                <Input
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  onBlur={() => handleColorChange(inputColor)}
                  className="w-full"
                />
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: color }}
                />
              </div>

              {recentColors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">
                    最近使用
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentColors.map((color, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-white"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">预设颜色</h3>
                <ScrollArea className="h-32">
                  <div className="grid grid-cols-6 gap-2 p-1">
                    {presets.map((color, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-white"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
};

export { ColorPickerComponent as ColorPicker };
