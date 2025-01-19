"use client";

import React, { useState, useEffect } from "react";
import {
  HexColorPicker,
  RgbColorPicker,
  HslColorPicker,
  RgbColor,
  HslColor,
} from "react-colorful";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  generateAnalogousPalette,
  generateMonochromaticPalette,
} from "@/utils/color-utils";
import { useToast } from "@/hooks/use-toast";

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
  const [colorFormat, setColorFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  const [showContrast, setShowContrast] = useState(false);
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);

  const calculateLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const calculateContrastRatio = (color1: string, color2: string): number => {
    const lum1 = calculateLuminance(color1);
    const lum2 = calculateLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  useEffect(() => {
    if (showContrast) {
      const ratio = calculateContrastRatio(color, "#ffffff");
      setContrastRatio(ratio);
    }
  }, [showContrast, color]);
  const [paletteType, setPaletteType] = useState<"analogous" | "monochromatic">(
    "analogous"
  );
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);

  const { toast } = useToast();

  const isValidColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleColorChange = (newColor: string | RgbColor | HslColor) => {
    try {
      let colorString =
        typeof newColor === "string"
          ? newColor
          : "r" in newColor
          ? rgbToHex(newColor)
          : hslToHex(newColor);

      if (!isValidColor(colorString)) {
        throw new Error("无效的颜色值");
      }

      onChange(colorString);
      setInputColor(colorString);
      updatePalette(colorString);

      setRecentColors((prev) => {
        const newRecent = [
          colorString,
          ...prev.filter((c) => c !== colorString),
        ];
        return newRecent.slice(0, 12);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "颜色值无效";
      toast({
        title: "颜色错误",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
      setInputColor(color);
    }
  };

  const rgbToHex = (rgb: RgbColor): string => {
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  };

  const hslToHex = (hsl: HslColor): string => {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const updatePalette = (color: string) => {
    if (paletteType === "analogous") {
      setGeneratedPalette(generateAnalogousPalette(color));
    } else {
      setGeneratedPalette(generateMonochromaticPalette(color));
    }
  };

  useEffect(() => {
    setInputColor(color);
    updatePalette(color);
  }, [color]);

  const handleFormatChange = (format: "hex" | "rgb" | "hsl") => {
    setColorFormat(format);
  };

  const renderColorPicker = () => {
    switch (colorFormat) {
      case "rgb":
        return (
          <RgbColorPicker
            color={hexToRgb(color)}
            onChange={handleColorChange}
          />
        );
      case "hsl":
        return (
          <HslColorPicker
            color={hexToHsl(color)}
            onChange={handleColorChange}
          />
        );
      default:
        return <HexColorPicker color={color} onChange={handleColorChange} />;
    }
  };

  const hexToRgb = (hex: string): RgbColor => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const hexToHsl = (hex: string): HslColor => {
    const rgb = hexToRgb(hex);
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
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
              <DialogTitle className="text-white">颜色选择器</DialogTitle>
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
              <Tabs defaultValue="picker" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="picker">选择器</TabsTrigger>
                  <TabsTrigger value="palette">调色板</TabsTrigger>
                  <TabsTrigger value="contrast">对比度</TabsTrigger>
                </TabsList>

                <TabsContent value="picker">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>颜色格式</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            colorFormat === "hex" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleFormatChange("hex")}
                        >
                          HEX
                        </Button>
                        <Button
                          variant={
                            colorFormat === "rgb" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleFormatChange("rgb")}
                        >
                          RGB
                        </Button>
                        <Button
                          variant={
                            colorFormat === "hsl" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleFormatChange("hsl")}
                        >
                          HSL
                        </Button>
                      </div>
                    </div>

                    <div className="w-full h-64 relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={colorFormat}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0"
                        >
                          {renderColorPicker()}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        value={inputColor}
                        onChange={(e) => {
                          setInputColor(e.target.value);
                          // 实时验证颜色格式
                          if (!isValidColor(e.target.value)) {
                            toast({
                              title: "格式错误",
                              description: "请输入有效的十六进制颜色值",
                              variant: "destructive",
                              duration: 2000,
                            });
                          }
                        }}
                        onBlur={() => handleColorChange(inputColor)}
                        className="w-full"
                        placeholder="#FFFFFF"
                      />
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="palette">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>调色板类型</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            paletteType === "analogous" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setPaletteType("analogous");
                            updatePalette(color);
                          }}
                        >
                          类似色
                        </Button>
                        <Button
                          variant={
                            paletteType === "monochromatic"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setPaletteType("monochromatic");
                            updatePalette(color);
                          }}
                        >
                          单色
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {generatedPalette.map((color, i) => (
                        <motion.div
                          key={i}
                          className="w-full h-10 rounded-md cursor-pointer border-2 border-transparent hover:border-white"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contrast">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>对比度检查</Label>
                      <Switch
                        checked={showContrast}
                        onCheckedChange={setShowContrast}
                      />
                    </div>
                    {showContrast && contrastRatio && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">对比度比率</span>
                          <span className="text-sm font-medium">
                            {contrastRatio.toFixed(2)}:1
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                            style={{
                              width: `${Math.min(contrastRatio * 10, 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          {contrastRatio >= 7
                            ? "符合WCAG AAA标准"
                            : contrastRatio >= 4.5
                            ? "符合WCAG AA标准"
                            : "不符合可访问性标准"}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {recentColors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">
                    最近使用
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentColors.map((color, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <motion.div
                            className="w-8 h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-white"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">预设颜色</h3>
                <ScrollArea className="h-32">
                  <div className="grid grid-cols-6 gap-2 p-1">
                    {presets.map((color, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <motion.div
                            className="w-8 h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-white"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
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
