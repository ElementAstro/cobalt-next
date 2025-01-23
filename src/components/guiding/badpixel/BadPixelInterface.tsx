"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBadPixelStore } from "@/store/guiding/useBadPixelStore";
import {
  X,
  Settings,
  LayoutGrid,
  LineChart,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import PixelInfo from "./PixelInfo";
import ActionButtons from "./ActionButtons";
import BadPixelVisualization from "./BadPixelVisualization";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "react-responsive";

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
  const isLandscape = useMediaQuery({ query: "(min-width: 768px)" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [manualPixel, setManualPixel] = useState("");
  const [visualMode, setVisualMode] = useState<"table" | "graph">("table");
  const [expanded, setExpanded] = useState(false);

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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div
        className={`container mx-auto ${
          isLandscape ? "grid grid-cols-2 gap-6" : "space-y-6"
        } p-4`}
      >
        <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                坏点映射管理
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setVisualMode((v) => (v === "table" ? "graph" : "table"))
                  }
                  className="hover:bg-gray-700"
                >
                  {visualMode === "table" ? (
                    <LayoutGrid className="w-4 h-4 mr-2" />
                  ) : (
                    <LineChart className="w-4 h-4 mr-2" />
                  )}
                  {visualMode === "table" ? "图表模式" : "表格模式"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="hover:bg-gray-700"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-gray-800 rounded-md shadow-inner"
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

            {isLoading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </CardContent>
        </Card>

        {isLandscape && (
          <Card className="h-[calc(100vh-2rem)] shadow-lg rounded-lg">
            <CardContent className="p-4 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-4">坏点分布图</h3>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
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
