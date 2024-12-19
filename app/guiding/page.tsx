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

  const resetView = () => {
    setSettings({
      xScale: 100,
      yScale: "+/-4",
      trendLine: true,
      correction: true,
    });
  };

  // 添加快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f") setSettings({ correction: !settings.correction });
      if (e.key === "t") setSettings({ trendLine: !settings.trendLine });
      if (e.key === "r") resetView();
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [settings]);

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
          {/* 修改主区域布局为网格布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1 p-2">
            <div className="lg:col-span-2 h-full">
              <GuideView
                targetX={400}
                targetY={300}
                colors={colors}
                animationSpeed={settings.animationSpeed}
                showCrosshair={true}
                showGrid={true}
                enableZoom={true}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex-1">
                <WaveformDisplay
                  data={waveformData}
                  colors={colors}
                  animationSpeed={settings.animationSpeed}
                  showStats={true}
                  enableZoom={true}
                />
              </div>
              <div className="flex-1">
                <TargetDiagram
                  radius={settings.radius}
                  currentPosition={currentPosition}
                  colors={colors}
                  animationSpeed={settings.animationSpeed}
                  showStats={true}
                  enableExport={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 添加新的底部控制面板 */}
        <div
          className="shrink-0 border-t"
          style={{ borderColor: colors.primary }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-bold">导星控制</h3>
              <div className="flex items-center space-x-2">
                <Label>赤经:</Label>
                <Input
                  type="number"
                  value={tracking.mod}
                  onChange={(e) =>
                    setTracking({ mod: parseInt(e.target.value) })
                  }
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
                  onChange={(e) =>
                    setTracking({ agr: parseInt(e.target.value) })
                  }
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
            <div className="space-y-2">
              <h3 className="text-sm font-bold">显示设置</h3>
              <div className="flex flex-wrap gap-4">
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
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold">快捷键</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>F - 切换修正</div>
                <div>T - 切换趋势线</div>
                <div>R - 重置视图</div>
                <div>+/- - 缩放</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
