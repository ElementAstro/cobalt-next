"use client";

import { useEffect, useState } from "react";
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
import { getColorScheme, useGuideStore } from "@/store/useGuidingStore";

import { GuideImage } from "@/components/guiding/guide-image";
import { PeakChart } from "@/components/guiding/peak-chart";
import { TargetDiagram } from "@/components/guiding/target-diagram";
import HistoryGraph from "@/components/guiding/history-graph";
import { X, Settings } from "lucide-react";
import SettingsDialog from "@/components/guiding/settings-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function TelescopeGuiding() {
  const {
    settings,
    setSettings,
    tracking,
    setTracking,
    currentPosition,
    setCurrentPosition,
    colors,
    setColors,
    guideImage,
    setGuideImage,
  } = useGuideStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setColors(getColorScheme(settings.colorScheme));
  }, [settings.colorScheme, setColors]);

  useEffect(() => {
    if (!guideImage) {
      setGuideImage("/test-guide-image.jpg");
    }

    const interval = setInterval(() => {
      const newPosition = {
        x: currentPosition.x + (Math.random() * 0.4 - 0.2),
        y: currentPosition.y + (Math.random() * 0.4 - 0.2),
      };
      setCurrentPosition(newPosition);

      setTracking({ value: tracking.value + (Math.random() * 0.2 - 0.1) });

      if (settings.autoGuide) {
        setCurrentPosition({
          x: currentPosition.x * 0.95,
          y: currentPosition.y * 0.95,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    currentPosition,
    settings.autoGuide,
    setCurrentPosition,
    setTracking,
    guideImage,
    setGuideImage,
  ]);

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
              radius={50}
              currentPosition={currentPosition}
              colors={colors}
              animationSpeed={1}
              showStats={true}
              enableExport={true}
              canvasSize={{ width: 100, height: 100 }}
            />
            <Card>
              <CardContent className="text-xs space-y-1.5 font-mono items-center p-2">
                <div className="flex justify-between">
                  <span>Mid row FWHM:</span>
                  <span>2.79</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak:</span>
                  <span>12523</span>
                </div>
                <div className="flex justify-between">
                  <span>Background:</span>
                  <span>2890</span>
                </div>
                <div className="flex justify-between">
                  <span>SNR:</span>
                  <span>4.33</span>
                </div>
                <div className="flex justify-between">
                  <span>HFD:</span>
                  <span className="text-2xl font-bold">2.56</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
