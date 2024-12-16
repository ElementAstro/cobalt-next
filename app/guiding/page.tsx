"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useGuideStore } from "@/lib/store/guiding/guiding";
import { getColorScheme } from "@/utils/color-schemes";

import { GuideView } from "./components/GuideView";
import { WaveformDisplay } from "./components/WaveformDisplay";
import { TargetDiagram } from "./components/TargetDiagram";
import { HistoryGraph } from "./components/HistoryGraph";
import { GuideImage } from "./components/GuideImage";

export default function TelescopeGuiding() {
  const {
    settings,
    setSettings,
    tracking,
    setTracking,
    waveformData,
    setWaveformData,
    currentPosition,
    setCurrentPosition,
    historyPoints,
    setHistoryPoints,
    colors,
    setColors,
    guideImage,
    setGuideImage,
  } = useGuideStore();

  useEffect(() => {
    setColors(getColorScheme(settings.colorScheme));
  }, [settings.colorScheme, setColors]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveformData([...waveformData.slice(1), Math.random() * 2 - 1]);
      setCurrentPosition({
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
      });
      setHistoryPoints([
        ...historyPoints.slice(1),
        {
          x: historyPoints[historyPoints.length - 1]?.x + 40 || 0,
          y: 100 + Math.random() * 50,
          timestamp: Date.now(),
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    waveformData,
    historyPoints,
    setWaveformData,
    setCurrentPosition,
    setHistoryPoints,
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGuideImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-screen"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-2 flex flex-col">
            <div className="flex-1">
              <GuideView
                targetX={400}
                targetY={300}
                colors={colors}
                animationSpeed={settings.animationSpeed}
              />
            </div>
            <div className="h-1/3 mt-2">
              <GuideImage imageUrl={guideImage} colors={colors} />
            </div>
          </div>

          <div
            className="w-80 p-2 space-y-4 border-l"
            style={{ borderColor: colors.primary }}
          >
            <div className="space-y-2">
              <div
                className="text-sm font-bold border-b pb-1"
                style={{ borderColor: colors.primary }}
              >
                星点图
              </div>
              <WaveformDisplay
                data={waveformData}
                colors={colors}
                animationSpeed={settings.animationSpeed}
              />
            </div>

            <div className="space-y-2">
              <div
                className="text-sm font-bold border-b pb-1"
                style={{ borderColor: colors.primary }}
              >
                靶心图
              </div>
              <div
                className="p-2 rounded"
                style={{ backgroundColor: colors.secondary }}
              >
                <div className="flex justify-between mb-2">
                  <Select
                    value={settings.zoom.toString()}
                    onValueChange={(value) =>
                      setSettings({ zoom: parseInt(value) })
                    }
                  >
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                  </Select>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      +
                    </Button>
                    <Button variant="outline" size="sm">
                      -
                    </Button>
                    <Button variant="outline" size="sm">
                      清除
                    </Button>
                  </div>
                </div>
                <TargetDiagram
                  radius={settings.radius}
                  currentPosition={currentPosition}
                  colors={colors}
                  animationSpeed={settings.animationSpeed}
                />
                <div className="flex items-center mt-2">
                  <Label className="mr-2">半径:</Label>
                  <Input
                    type="number"
                    value={settings.radius}
                    onChange={(e) =>
                      setSettings({ radius: parseFloat(e.target.value) })
                    }
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-64 border-t" style={{ borderColor: colors.primary }}>
          <div
            className="flex items-center space-x-4 p-2 border-b"
            style={{ borderColor: colors.primary }}
          >
            <Select
              value={settings.xScale.toString()}
              onValueChange={(value) =>
                setSettings({ xScale: parseInt(value) })
              }
            >
              <option value="100">x: 100</option>
              <option value="200">x: 200</option>
            </Select>
            <Select
              value={settings.yScale}
              onValueChange={(value) => setSettings({ yScale: value })}
            >
              <option value="+/-4">y: +/-4"</option>
              <option value="+/-8">y: +/-8"</option>
            </Select>
            <Button variant="outline" size="sm">
              设置
            </Button>
            <Button variant="outline" size="sm">
              清除
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.trendLine}
                onCheckedChange={(checked) =>
                  setSettings({ trendLine: checked })
                }
                id="trend"
              />
              <Label htmlFor="trend">趋势线</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.correction}
                onCheckedChange={(checked) =>
                  setSettings({ correction: checked })
                }
                id="correction"
              />
              <Label htmlFor="correction">修正</Label>
            </div>
          </div>

          <div className="flex-1 p-2">
            <HistoryGraph
              points={historyPoints}
              showTrendLine={settings.trendLine}
              colors={colors}
              animationSpeed={settings.animationSpeed}
            />
          </div>

          <div
            className="flex items-center space-x-4 p-2 border-t"
            style={{ borderColor: colors.primary }}
          >
            <div className="flex items-center space-x-2">
              <Label>赤经:</Label>
              <Input
                type="number"
                value={tracking.mod}
                onChange={(e) => setTracking({ mod: parseInt(e.target.value) })}
                className="w-16"
              />
              <Label>流:</Label>
              <Input
                type="number"
                value={tracking.flow}
                onChange={(e) =>
                  setTracking({ flow: parseInt(e.target.value) })
                }
                className="w-16"
              />
              <Label>值:</Label>
              <Input
                type="number"
                value={tracking.value}
                onChange={(e) =>
                  setTracking({ value: parseFloat(e.target.value) })
                }
                className="w-16"
              />
              <Label>Agr:</Label>
              <Input
                type="number"
                value={tracking.agr}
                onChange={(e) => setTracking({ agr: parseInt(e.target.value) })}
                className="w-16"
              />
              <Label>赤经限长:</Label>
              <Input
                type="number"
                value={tracking.guideLength}
                onChange={(e) =>
                  setTracking({ guideLength: parseInt(e.target.value) })
                }
                className="w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-2 border-t" style={{ borderColor: colors.primary }}>
          <div className="flex items-center space-x-4">
            <Label>动画速度:</Label>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={[settings.animationSpeed]}
              onValueChange={(value) =>
                setSettings({ animationSpeed: value[0] })
              }
              className="w-48"
            />
            <Label>颜色主题:</Label>
            <Select
              value={settings.colorScheme}
              onValueChange={(value) =>
                setSettings({ colorScheme: value as "dark" | "light" })
              }
            >
              <option value="dark">暗色</option>
              <option value="light">亮色</option>
            </Select>
            <Label htmlFor="imageUpload" className="cursor-pointer">
              上传导星图像
            </Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
