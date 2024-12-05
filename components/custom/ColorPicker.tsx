"use client";

import { useState, useEffect, useRef } from "react";
import { Paintbrush, Copy, Plus, Minus, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import getNearestColor from "color-namer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

extend([namesPlugin]);

type ColorFormat = "hex" | "rgb" | "hsl";

const initialPresetColors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33F5",
  "#33FFF5",
  "#F5FF33",
  "#FF3333",
  "#33FF33",
];

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number,
    s: number,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
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
      default:
        h = 0;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
}

export default function AdvancedColorPickerPopover() {
  const [color, setColor] = useState("#000000");
  const [colorName, setColorName] = useState("Black");
  const [opacity, setOpacity] = useState(100);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [history, setHistory] = useState<string[]>([]);
  const [presetColors, setPresetColors] = useState(initialPresetColors);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rgb, setRgb] = useState<[number, number, number]>([0, 0, 0]);
  const [hsl, setHsl] = useState<[number, number, number]>([0, 0, 0]);
  const [palette, setPalette] = useState<string[]>([]);
  const [mixColor, setMixColor] = useState("#FFFFFF");
  const [mixAmount, setMixAmount] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("colorHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    updateRgbAndHsl(color);
  }, []);

  useEffect(() => {
    updateRgbAndHsl(color);
    updatePalette();
    updateColorName();
  }, [color]);

  const updateRgbAndHsl = (hexColor: string) => {
    const rgbValues = hexToRgb(hexColor);
    setRgb(rgbValues as [number, number, number]);
    setHsl(rgbToHsl(...rgbValues) as [number, number, number]);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    updateHistory(newColor);
  };

  const updateHistory = (newColor: string) => {
    const updatedHistory = [
      newColor,
      ...history.filter((c) => c !== newColor),
    ].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("colorHistory", JSON.stringify(updatedHistory));
  };

  const getFormattedColor = (): string => {
    switch (format) {
      case "rgb":
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity / 100})`;
      case "hsl":
        return `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, ${opacity / 100})`;
      default:
        return `${color}${Math.round(opacity * 2.55)
          .toString(16)
          .padStart(2, "0")}`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedColor());
    toast({
      title: "Color copied",
      description: `${getFormattedColor()} has been copied to your clipboard.`,
    });
  };

  const addToPresets = () => {
    if (!presetColors.includes(color)) {
      setPresetColors([...presetColors, color]);
    }
  };

  const handleRgbChange = (index: number, value: number) => {
    const newRgb: [number, number, number] = [...rgb];
    newRgb[index] = value;
    setRgb(newRgb);
    const newHexColor = rgbToHex(...newRgb);
    setColor(newHexColor);
    setHsl(rgbToHsl(...newRgb) as [number, number, number]);
  };

  const handleHslChange = (index: number, value: number) => {
    const newHsl: [number, number, number] = [...hsl];
    newHsl[index] = value;
    setHsl(newHsl);
    const newRgb = hslToRgb(...newHsl);
    setRgb(newRgb);
    setColor(rgbToHex(...newRgb));
  };

  const updatePalette = () => {
    const baseColor = colord(color);
    setPalette([
      baseColor.lighten(0.4).toHex(),
      baseColor.lighten(0.2).toHex(),
      color,
      baseColor.darken(0.2).toHex(),
      baseColor.darken(0.4).toHex(),
    ]);
  };

  const updateColorName = () => {
    const nearestColor = getNearestColor(color);
    const colorName = nearestColor.basic[0].name; // 假设使用 basic 调色板并选择第一个颜色
    setColorName(colorName);
  };

  const handleMixColorChange = (newMixColor: string) => {
    setMixColor(newMixColor);
  };

  const handleMixAmountChange = (newAmount: number) => {
    setMixAmount(newAmount);
    const mixedColor = mixColors(color, mixColor, newAmount / 100);
    setColor(colord(mixedColor).toHex());
  };

  // 自定义颜色混合函数
  const mixColors = (
    color1: string,
    color2: string,
    amount: number
  ): string => {
    const colord1 = colord(color1).toRgb();
    const colord2 = colord(color2).toRgb();
    const mixedR = colord1.r + (colord2.r - colord1.r) * amount;
    const mixedG = colord1.g + (colord2.g - colord1.g) * amount;
    const mixedB = colord1.b + (colord2.b - colord1.b) * amount;
    return `rgb(${Math.round(mixedR)}, ${Math.round(mixedG)}, ${Math.round(
      mixedB
    )})`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const dominantColor = getDominantColor(imageData.data);
            setColor(dominantColor);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const getDominantColor = (imageData: Uint8ClampedArray): string => {
    const colorCounts: { [key: string]: number } = {};
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const rgb = `${r},${g},${b}`;
      colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
    }
    const dominantRgb = Object.keys(colorCounts).reduce((a, b) =>
      colorCounts[a] > colorCounts[b] ? a : b
    );
    const [r, g, b] = dominantRgb.split(",").map(Number);
    return rgbToHex(r, g, b);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] justify-start text-left font-normal"
        >
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          <Paintbrush className="mr-2 h-4 w-4" />
          <span>Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid gap-4"
        >
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Selected Color</h4>
            <div
              className="w-full h-10 rounded flex items-center justify-center text-center"
              style={{
                backgroundColor: color,
                color: colord(color).isLight() ? "#000000" : "#FFFFFF",
              }}
            >
              {colorName}
            </div>
          </div>
          <Tabs defaultValue="picker" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="picker">Picker</TabsTrigger>
              <TabsTrigger value="palette">Palette</TabsTrigger>
              <TabsTrigger value="mixer">Mixer</TabsTrigger>
            </TabsList>
            <TabsContent value="picker" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-color">Custom color</Label>
                <Input
                  id="custom-color"
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Opacity</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[opacity]}
                  onValueChange={(value) => setOpacity(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label>Preset colors</Label>
                <div className="grid grid-cols-8 gap-2">
                  {presetColors.map((presetColor) => (
                    <motion.button
                      key={presetColor}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-black"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => handleColorChange(presetColor)}
                      aria-label={`Select color ${presetColor}`}
                    />
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-black"
                    onClick={addToPresets}
                    aria-label="Add current color to presets"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="palette" className="space-y-4">
              <div className="space-y-2">
                <Label>Generated Palette</Label>
                <div className="grid grid-cols-5 gap-2">
                  {palette.map((paletteColor) => (
                    <motion.button
                      key={paletteColor}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-full h-8 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-black"
                      style={{ backgroundColor: paletteColor }}
                      onClick={() => handleColorChange(paletteColor)}
                      aria-label={`Select color ${paletteColor}`}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="mixer" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mix-color">Mix with color</Label>
                <Input
                  id="mix-color"
                  type="color"
                  value={mixColor}
                  onChange={(e) => handleMixColorChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Mix amount</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[mixAmount]}
                  onValueChange={(value) => handleMixAmountChange(value[0])}
                />
              </div>
              <div
                className="w-full h-10 rounded"
                style={{
                  background: `linear-gradient(to right, ${color}, ${mixColor})`,
                }}
              />
            </TabsContent>
          </Tabs>
          <div className="flex items-center space-x-2">
            <Label>Format:</Label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ColorFormat)}
              className="border rounded px-2 py-1"
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
            </select>
            <Button size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <div className="text-sm font-mono">{getFormattedColor()}</div>
          <motion.div
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={{
              expanded: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>RGB</Label>
                {["Red", "Green", "Blue"].map((label, index) => (
                  <div key={label} className="flex items-center space-x-2">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="255"
                      value={rgb[index]}
                      onChange={(e) =>
                        handleRgbChange(
                          index,
                          Math.min(
                            255,
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-16"
                    />
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgb[index]]}
                      onValueChange={(value) =>
                        handleRgbChange(index, value[0])
                      }
                      className="flex-grow"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>HSL</Label>
                {["Hue", "Saturation", "Lightness"].map((label, index) => (
                  <div key={label} className="flex items-center space-x-2">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      min={index === 0 ? "0" : "0"}
                      max={index === 0 ? "360" : "100"}
                      value={hsl[index]}
                      onChange={(e) =>
                        handleHslChange(
                          index,
                          Math.min(
                            index === 0 ? 360 : 100,
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-16"
                    />
                    <Slider
                      min={index === 0 ? 0 : 0}
                      max={index === 0 ? 360 : 100}
                      step={1}
                      value={[hsl[index]]}
                      onValueChange={(value) =>
                        handleHslChange(index, value[0])
                      }
                      className="flex-grow"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2"
          >
            {isExpanded ? (
              <>
                <Minus className="w-4 h-4 mr-2" />
                Less options
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                More options
              </>
            )}
          </Button>
          <div className="space-y-2">
            <Label>Extract color from image</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
