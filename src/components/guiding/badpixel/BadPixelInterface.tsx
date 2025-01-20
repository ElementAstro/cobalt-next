"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBadPixelStore } from "@/store/guiding/useBadPixelStore";
import { X, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import PixelInfo from "./PixelInfo";
import ActionButtons from "./ActionButtons";
import BadPixelVisualization from "./BadPixelVisualization";
import { useToast } from "@/hooks/use-toast";

export default function BadPixelInterface() {
  const { toast } = useToast();
  const {
    data,
    options,
    setData,
    setOptions,
    resetCorrectionLevels,
    generateBadPixels,
    addBadPixel,
  } = useBadPixelStore();
  const [isLandscape, setIsLandscape] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [manualPixel, setManualPixel] = useState("");
  const [visualMode, setVisualMode] = useState<"table" | "graph">("table");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", checkOrientation);
    checkOrientation();

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  useEffect(() => {
    if (options.autoRefresh) {
      const interval = setInterval(() => {
        generateBadPixels();
      }, options.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, options.refreshInterval, generateBadPixels]);

  const toggleTheme = () => {
    setOptions({ theme: options.theme === "light" ? "dark" : "light" });
    document.documentElement.classList.toggle("dark");
  };

  const handleGenerateBadPixels = async () => {
    try {
      await generateBadPixels();
      toast({
        title: "成功生成坏点数据",
        description: "已更新坏点分布图",
      });
    } catch (error) {
      toast({
        title: "生成坏点数据失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const handleResetCorrectionLevels = () => {
    resetCorrectionLevels();
    toast({
      title: "已重置修正等级",
      description: "热点和冷点修正等级已恢复默认值",
    });
  };

  const handleManualAddPixel = () => {
    const pixel = parseInt(manualPixel);
    if (isNaN(pixel)) {
      toast({
        title: "输入无效",
        description: "请输入有效的像素坐标",
        variant: "destructive",
      });
      return;
    }
    if (pixel < 0 || pixel >= data.width * data.height) {
      toast({
        title: "坐标超出范围",
        description: "请输入在有效范围内的坐标值",
        variant: "destructive",
      });
      return;
    }
    addBadPixel(pixel);
    setManualPixel("");
    toast({
      title: "已添加坏点",
      description: `成功添加坐标 ${pixel} 的坏点`,
    });
  };

  const containerClass = isLandscape
    ? "grid grid-cols-2 gap-4 p-4 max-h-screen overflow-hidden"
    : "p-4";

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className={containerClass}>
        <Card
          className={`shadow-lg rounded-lg ${
            isLandscape ? "h-[calc(100vh-2rem)]" : ""
          }`}
        >
          <CardContent
            className={`p-4 ${isLandscape ? "h-full overflow-y-auto" : ""}`}
          >
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10 py-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                完善坏点映射图
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setVisualMode((v) => (v === "table" ? "graph" : "table"))
                  }
                >
                  {visualMode === "table" ? "图表模式" : "表格模式"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-md shadow-inner"
                >
                  <SettingsPanel />
                </motion.div>
              )}
            </AnimatePresence>

            <PixelInfo
              data={data}
              visualMode={visualMode}
              isLandscape={isLandscape}
              expanded={expanded}
              onToggleExpand={() => setExpanded(!expanded)}
              onManualAddPixel={addBadPixel}
              manualPixel={manualPixel}
              setManualPixel={setManualPixel}
            />

            <ActionButtons
              resetCorrectionLevels={handleResetCorrectionLevels}
              generateBadPixels={handleGenerateBadPixels}
              handleManualAddPixel={handleManualAddPixel}
              manualPixel={manualPixel}
              setManualPixel={setManualPixel}
            />
          </CardContent>
        </Card>

        {isLandscape && (
          <Card className="h-[calc(100vh-2rem)] shadow-lg rounded-lg">
            <CardContent className="p-4 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4">坏点分布图</h3>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  {/* 这里可以添加坏点分布的可视化图表 */}
                  <BadPixelVisualization data={data} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
