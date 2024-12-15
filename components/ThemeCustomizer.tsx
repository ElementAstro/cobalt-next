"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Settings } from "lucide-react";

interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  border: string;
  input: string;
  ring: string;
  accent: string;
  popover: string;
  card: string;
  muted: string;
}

interface ThemeSettings {
  colorScheme: ColorScheme;
  fontSize: number;
  borderRadius: number;
  fontFamily: string;
  buttonStyle: "default" | "rounded" | "square";
  useShadows: boolean;
}

const defaultLightScheme: ColorScheme = {
  primary: "#000000",
  secondary: "#4A90A7",
  background: "#FFFFFF",
  foreground: "#000000",
  border: "#e5e5e5",
  input: "#e5e5e5",
  ring: "#003B4F",
  accent: "#0077A7",
  popover: "#FFFFFF",
  card: "#FFFFFF",
  muted: "#f1f5f9",
};

const defaultDarkScheme: ColorScheme = {
  primary: "#FFFFFF",
  secondary: "#4A90A7",
  background: "#1a1a1a",
  foreground: "#FFFFFF",
  border: "#2a2a2a",
  input: "#2a2a2a",
  ring: "#4A90A7",
  accent: "#0077A7",
  popover: "#1a1a1a",
  card: "#1a1a1a",
  muted: "#2a2a2a",
};

const astronomyRedEyeProtectionScheme: ColorScheme = {
  primary: "#FF3F3F",
  secondary: "#A30000",
  background: "#1A0000",
  foreground: "#FFB3B3",
  border: "#4D0000",
  input: "#4D0000",
  ring: "#FF7F7F",
  accent: "#FF0000",
  popover: "#2E0000",
  card: "#2E0000",
  muted: "#4D0000",
};

const oceanBlueScheme: ColorScheme = {
  primary: "#0077BE",
  secondary: "#00A3E0",
  background: "#F0F8FF",
  foreground: "#333333",
  border: "#B0E0E6",
  input: "#B0E0E6",
  ring: "#4682B4",
  accent: "#1E90FF",
  popover: "#E6F3FF",
  card: "#E6F3FF",
  muted: "#B0E0E6",
};

const forestGreenScheme: ColorScheme = {
  primary: "#228B22",
  secondary: "#32CD32",
  background: "#F0FFF0",
  foreground: "#333333",
  border: "#90EE90",
  input: "#90EE90",
  ring: "#2E8B57",
  accent: "#00FF00",
  popover: "#E6FFE6",
  card: "#E6FFE6",
  muted: "#98FB98",
};

const defaultThemeSettings: ThemeSettings = {
  colorScheme: defaultLightScheme,
  fontSize: 16,
  borderRadius: 4,
  fontFamily: "Inter",
  buttonStyle: "default",
  useShadows: true,
};

const presetThemes = {
  light: { ...defaultThemeSettings, colorScheme: defaultLightScheme },
  dark: { ...defaultThemeSettings, colorScheme: defaultDarkScheme },
  astronomyRed: {
    ...defaultThemeSettings,
    colorScheme: astronomyRedEyeProtectionScheme,
  },
  oceanBlue: { ...defaultThemeSettings, colorScheme: oceanBlueScheme },
  forestGreen: { ...defaultThemeSettings, colorScheme: forestGreenScheme },
};

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] =
    useState<keyof typeof presetThemes>("light");
  const [customTheme, setCustomTheme] = useState<ThemeSettings>(
    presetThemes.light
  );

  const applyTheme = (theme: ThemeSettings) => {
    const {
      colorScheme,
      fontSize,
      borderRadius,
      fontFamily,
      buttonStyle,
      useShadows,
    } = theme;
    Object.entries(colorScheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    document.documentElement.style.setProperty("--font-size", `${fontSize}px`);
    document.documentElement.style.setProperty(
      "--border-radius",
      `${borderRadius}px`
    );
    document.documentElement.style.setProperty("--font-family", fontFamily);
    document.documentElement.style.setProperty(
      "--button-radius",
      buttonStyle === "rounded" ? "9999px" : `${borderRadius}px`
    );
    document.documentElement.style.setProperty(
      "--use-shadows",
      useShadows ? "1" : "0"
    );
    document.documentElement.classList.toggle(
      "dark",
      activeTheme === "dark" || activeTheme === "astronomyRed"
    );
  };

  useEffect(() => {
    applyTheme(customTheme);
  }, [customTheme, activeTheme]);

  const ColorPicker = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-xs">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-8 cursor-pointer rounded border bg-transparent p-0"
        />
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 rounded border bg-background px-1 py-0.5 text-xs"
        />
      </div>
    </div>
  );

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    const newTheme = {
      ...customTheme,
      colorScheme: { ...customTheme.colorScheme, [key]: value },
    };
    setCustomTheme(newTheme);
    applyTheme(newTheme);
  };

  const handlePresetChange = (preset: keyof typeof presetThemes) => {
    setActiveTheme(preset);
    setCustomTheme(presetThemes[preset]);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">主题定制器</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">预设主题</span>
                <Select
                  value={activeTheme}
                  onValueChange={(value: keyof typeof presetThemes) =>
                    handlePresetChange(value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">明亮</SelectItem>
                    <SelectItem value="dark">暗黑</SelectItem>
                    <SelectItem value="astronomyRed">天文红色护眼</SelectItem>
                    <SelectItem value="oceanBlue">海洋蓝</SelectItem>
                    <SelectItem value="forestGreen">森林绿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Tabs defaultValue="colors" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="colors">颜色</TabsTrigger>
                  <TabsTrigger value="typography">排版</TabsTrigger>
                  <TabsTrigger value="layout">布局</TabsTrigger>
                </TabsList>
                <TabsContent value="colors" className="space-y-2">
                  {Object.entries(customTheme.colorScheme).map(
                    ([key, value]) => (
                      <ColorPicker
                        key={key}
                        label={key}
                        value={value}
                        onChange={(newValue) =>
                          handleColorChange(key as keyof ColorScheme, newValue)
                        }
                      />
                    )
                  )}
                </TabsContent>
                <TabsContent value="typography" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">字体大小</Label>
                    <Slider
                      value={[customTheme.fontSize]}
                      onValueChange={(value) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          fontSize: value[0],
                        }))
                      }
                      max={24}
                      min={12}
                      step={1}
                      className="w-[60%]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">字体家族</Label>
                    <Select
                      value={customTheme.fontFamily}
                      onValueChange={(value) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          fontFamily: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="layout" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">边框圆角</Label>
                    <Slider
                      value={[customTheme.borderRadius]}
                      onValueChange={(value) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          borderRadius: value[0],
                        }))
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="w-[60%]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">按钮样式</Label>
                    <Select
                      value={customTheme.buttonStyle}
                      onValueChange={(
                        value: "default" | "rounded" | "square"
                      ) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          buttonStyle: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">默认</SelectItem>
                        <SelectItem value="rounded">圆角</SelectItem>
                        <SelectItem value="square">方形</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">使用阴影</Label>
                    <Switch
                      checked={customTheme.useShadows}
                      onCheckedChange={(checked) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          useShadows: checked,
                        }))
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
