"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getColorScheme, useGuidingStore } from "@/store/useGuidingStore";

import { GuideImage } from "@/components/guiding/guide-image";
import { PeakChart } from "@/components/guiding/peak-chart";
import { TargetDiagram } from "@/components/guiding/target-diagram";
import HistoryGraph from "@/components/guiding/history-graph";
import { X, Settings } from "lucide-react";
import SettingsDialog from "@/components/guiding/settings-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function TelescopeGuiding() {
  const { settings, setSettings, tracking, darkField, calibration, historyGraph } = useGuidingStore();
  const [currentPosition, setCurrentPosition] = useState({
    x: 0,
    y: 0,
    timestamp: Date.now(),
  });
  const [guideImage, setGuideImage] = useState<string | null>(null);
  const [colors, setColors] = useState(getColorScheme("dark"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setColors(getColorScheme(settings.colorScheme));
  }, [settings.colorScheme]);

  useEffect(() => {
    if (!guideImage) {
      setGuideImage("/test-guide-image.jpg");
    }

    const interval = setInterval(() => {
      const newPosition = {
        x: currentPosition.x + (Math.random() * 0.4 - 0.2),
        y: currentPosition.y + (Math.random() * 0.4 - 0.2),
        timestamp: Date.now(),
      };
      setCurrentPosition(newPosition);

      if (settings.autoGuide) {
        setCurrentPosition({
          x: currentPosition.x * 0.95,
          y: currentPosition.y * 0.95,
          timestamp: Date.now(),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPosition, settings.autoGuide, guideImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setGuideImage(e.target?.result as string);
        setIsLoading(false);
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
      exposureTime: 30, // 新增曝光时间默认值
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f") setSettings({ correction: !settings.correction });
      if (e.key === "t") setSettings({ trendLine: !settings.trendLine });
      if (e.key === "r") resetView();
      // 可扩展快捷键
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [settings]);

  // 计算FWHM和相关指标
  const stats = useMemo(() => {
    const peakSNR = 10 * Math.log10(Math.abs(tracking.value));
    const hfd = calibration.data.raSpeed ? 
      parseFloat(calibration.data.raSpeed.split(" ")[0]) / tracking.flow : 
      0;

    return {
      fwhm: (2.355 * hfd).toFixed(2),
      peak: Math.round(tracking.value * 1000),
      background: Math.round(tracking.mod * 10),
      snr: peakSNR.toFixed(2),
      hfd: hfd.toFixed(2)
    };
  }, [tracking, calibration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-gray-950 text-white"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col md:flex-row md:space-x-4 h-full">
          <div className="flex-1 relative flex flex-col">
            <div className="flex-1 relative min-h-0">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="loader"></div>
                </div>
              )}
              <GuideImage
                imageUrl={guideImage}
                colors={colors}
                crosshairSize={20}
                showGrid={true}
                height="100%"
                shapes={[
                  {
                    type: "circle",
                    position: {
                      x: currentPosition.x,
                      y: currentPosition.y,
                    },
                    radius: 5,
                    color: colors.accent,
                  },
                ]}
              />
            </div>
            <div className="h-[40vh]">
              <HistoryGraph />
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col space-y-4 p-4">
            <TargetDiagram
              radius={settings.radius || 50}
              currentPosition={currentPosition}
              colors={colors}
              animationSpeed={settings.animationSpeed || 1}
              showStats={true}
              enableExport={true}
              canvasSize={{ width: 100, height: 100 }}
              showInfo={true}
              crosshairColor={colors.secondary}
              circleCount={3}
              pointSize={4}
            />
            <Card>
              <CardContent className="text-xs space-y-1.5 font-mono items-center p-2">
                <div className="flex justify-between">
                  <span>Mid row FWHM:</span>
                  <span>{stats.fwhm}"</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak:</span>
                  <span>{stats.peak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Background:</span>
                  <span>{stats.background}</span>
                </div>
                <div className="flex justify-between">
                  <span>SNR:</span>
                  <span>{stats.snr}db</span>
                </div>
                <div className="flex justify-between">
                  <span>HFD:</span>
                  <span className="text-2xl font-bold">{stats.hfd}"</span>
                </div>
              </CardContent>
            </Card>
            
            {/* 添加跟踪状态指示器 */}
            <Card>
              <CardContent className="text-xs space-y-1.5 font-mono items-center p-2">
                <div className="flex justify-between">
                  <span>跟踪状态:</span>
                  <span className={`font-bold ${settings.autoGuide ? 'text-green-500' : 'text-yellow-500'}`}>
                    {settings.autoGuide ? '自动跟踪中' : '待机'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>曝光时间:</span>
                  <span>{settings.exposureTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>累计时间:</span>
                  <span>{historyGraph.points.length * settings.exposureTime / 1000}s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
