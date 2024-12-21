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
import { useTheme } from "@/contexts/ThemeContext";
import {
  ThemeSettings,
  ColorScheme,
  presetThemes,
  ThemeName,
} from "@/types/theme";

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, activePreset, setActivePreset } = useTheme();

  const applyTheme = (theme: ThemeSettings) => {
    const {
      colorScheme,
      fontSize,
      borderRadius,
      fontFamily,
      buttonStyle,
      useShadows,
      animationSpeed,
      contrast,
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
    document.documentElement.style.setProperty(
      "--animation-speed",
      animationSpeed
    );
    document.documentElement.style.setProperty("--contrast", contrast);

    document.documentElement.classList.toggle(
      "dark",
      activePreset === "dark" || activePreset === "astronomyRed"
    );
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme, activePreset]);

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
    const newTheme: ThemeSettings = {
      ...theme,
      colorScheme: { ...theme.colorScheme, [key]: value },
    };
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handlePresetChange = (preset: ThemeName) => {
    setActivePreset(preset);
    setTheme(presetThemes[preset]);
  };

  const handleFontFamilyChange = (value: string) => {
    setTheme({
      ...theme,
      fontFamily: value,
    });
    applyTheme({
      ...theme,
      fontFamily: value,
    });
  };

  const handleButtonStyleChange = (value: "default" | "rounded" | "square") => {
    setTheme({
      ...theme,
      buttonStyle: value,
    });
    applyTheme({
      ...theme,
      buttonStyle: value,
    });
  };

  const handleUseShadowsChange = (value: boolean) => {
    setTheme({
      ...theme,
      useShadows: value,
    });
    applyTheme({
      ...theme,
      useShadows: value,
    });
  };

  const handleAnimationSpeedChange = (
    value: "none" | "slow" | "normal" | "fast"
  ) => {
    setTheme({
      ...theme,
      animationSpeed: value,
    });
    applyTheme({
      ...theme,
      animationSpeed: value,
    });
  };

  const handleContrastChange = (value: "normal" | "high") => {
    setTheme({
      ...theme,
      contrast: value,
    });
    applyTheme({
      ...theme,
      contrast: value,
    });
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
                <Select value={activePreset} onValueChange={handlePresetChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择主题" />
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
                <TabsList className="flex space-x-2">
                  <TabsTrigger value="colors">颜色</TabsTrigger>
                  <TabsTrigger value="typography">排版</TabsTrigger>
                  <TabsTrigger value="layout">布局</TabsTrigger>
                  <TabsTrigger value="advanced">高级</TabsTrigger>
                </TabsList>

                {/* 颜色配置 */}
                <TabsContent value="colors" className="space-y-4">
                  {Object.keys(theme.colorScheme).map((key) => (
                    <ColorPicker
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={theme.colorScheme[key as keyof ColorScheme]}
                      onChange={(value) =>
                        handleColorChange(key as keyof ColorScheme, value)
                      }
                    />
                  ))}
                </TabsContent>

                {/* 排版配置 */}
                <TabsContent value="typography" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">字体大小</Label>
                    <Slider
                      value={[theme.fontSize]}
                      onValueChange={(value) =>
                        setTheme({
                          ...theme,
                          fontSize: value[0],
                        })
                      }
                      max={24}
                      min={12}
                      step={1}
                      className="w-[60%]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">字体类别</Label>
                    <Select
                      value={theme.fontFamily}
                      onValueChange={handleFontFamilyChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-ui, sans-serif">
                          系统默认
                        </SelectItem>
                        <SelectItem value="'Arial', sans-serif">
                          Arial
                        </SelectItem>
                        <SelectItem value="'Roboto', sans-serif">
                          Roboto
                        </SelectItem>
                        <SelectItem value="'Open Sans', sans-serif">
                          Open Sans
                        </SelectItem>
                        <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* 布局配置 */}
                <TabsContent value="layout" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">边框圆角</Label>
                    <Slider
                      value={[theme.borderRadius]}
                      onValueChange={(value) =>
                        setTheme({
                          ...theme,
                          borderRadius: value[0],
                        })
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
                      value={theme.buttonStyle}
                      onValueChange={handleButtonStyleChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">默认</SelectItem>
                        <SelectItem value="rounded">圆角</SelectItem>
                        <SelectItem value="square">方形</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* 高级配置 */}
                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">使用阴影</Label>
                    <Switch
                      checked={theme.useShadows}
                      onCheckedChange={handleUseShadowsChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">动画速度</Label>
                    <Select
                      value={theme.animationSpeed}
                      onValueChange={handleAnimationSpeedChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无</SelectItem>
                        <SelectItem value="slow">慢</SelectItem>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="fast">快</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">对比度</Label>
                    <Select
                      value={theme.contrast}
                      onValueChange={handleContrastChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="high">高对比</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsOpen(false)}>保存</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default ThemeCustomizer;
