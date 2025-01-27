"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBadPixelStore } from "@/store/guiding/useBadPixelStore";
import {
  Settings,
  LayoutGrid,
  LineChart,
  AlertTriangle,
  Loader2,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  RotateCcw,
  History,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "react-responsive";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SettingsPanel from "@/components/guiding/badpixel/SettingsPanel";
import PixelInfo from "@/components/guiding/badpixel/PixelInfo";
import ActionButtons from "@/components/guiding/badpixel/ActionButtons";
import BadPixelVisualization from "@/components/guiding/badpixel/BadPixelVisualization";

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
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

  // 导出数据
  const handleExport = () => {
    const exportData = {
      hotPixels: data.hotPixels,
      coldPixels: data.coldPixels,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `badpixels-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[calc(100vh-1rem)]">
          {/* 左侧面板 */}
          <Card className="md:col-span-1 bg-gray-800/50 backdrop-blur border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  坏点管理
                </h2>
                <div className="flex gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        导出数据
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="w-4 h-4 mr-2" />
                        导入数据
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowHistory(!showHistory)}>
                        <History className="w-4 h-4 mr-2" />
                        操作历史
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-10rem)]">
                <div className="space-y-4">
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

                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => {/* 撤销逻辑 */}}>
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {/* 重做逻辑 */}}>
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleResetCorrectionLevels}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 中间可视化区域 */}
          <Card className="md:col-span-2 bg-gray-800/50 backdrop-blur border-gray-700">
            <CardContent className="p-4 h-full">
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVisualMode(v => v === 'table' ? 'graph' : 'table')}
                    >
                      {visualMode === 'table' ? 
                        <LayoutGrid className="w-4 h-4 mr-2" /> : 
                        <LineChart className="w-4 h-4 mr-2" />
                      }
                      {visualMode === 'table' ? '图表模式' : '表格模式'}
                    </Button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-900/50 rounded-lg">
                  <BadPixelVisualization data={data} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 快捷操作悬浮按钮 */}
      <motion.div
        className="fixed bottom-4 right-4 flex gap-2"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="default"
          size="sm"
          onClick={handleGenerateBadPixels}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          生成坏点
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4 mr-2" />
          设置
        </Button>
      </motion.div>

      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-y-0 right-0 w-80 bg-gray-800/95 backdrop-blur shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 历史记录面板 */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="fixed inset-y-0 right-0 w-80 bg-gray-800/95 backdrop-blur shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* 添加历史记录组件 */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
