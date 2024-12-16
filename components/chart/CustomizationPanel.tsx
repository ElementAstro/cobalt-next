import React from "react";
import { motion } from "framer-motion";
import { Save, X as Reset, Palette, LineChartIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomizationPanelProps {
  updateInterval: number;
  setUpdateInterval: (interval: number) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  showComponents: {
    searchBar: boolean;
    statusBar: boolean;
  };
  setShowComponents: (components: {
    searchBar: boolean;
    statusBar: boolean;
  }) => void;
  chartOptions: {
    showGrid: boolean;
    showLabels: boolean;
    enableAnimation: boolean;
    dataPointSize: number;
  };
  setChartOptions: (options: any) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  updateInterval,
  setUpdateInterval,
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
  language,
  setLanguage,
  primaryColor,
  setPrimaryColor,
  showComponents,
  setShowComponents,
  chartOptions,
  setChartOptions,
}) => {
  const handleReset = () => {
    setUpdateInterval(1000);
    setDarkMode(false);
    setFontSize("medium");
    setLanguage("zh-cn");
    setPrimaryColor("#3b82f6");
    setShowComponents({ searchBar: true, statusBar: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-lg space-y-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6" />
        <h2 className="text-2xl font-bold">自定义选项</h2>
      </div>

      <div className="space-y-6">
        {/* 基础设置 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="updateInterval">更新间隔 (毫秒)</Label>
            <Input
              id="updateInterval"
              type="number"
              min="100"
              max="10000"
              step="100"
              value={updateInterval}
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="darkMode">暗色模式</Label>
            <input
              id="darkMode"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="form-checkbox h-5 w-5"
            />
          </div>
        </div>

        {/* 外观设置 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontSize">字体大小</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue placeholder="选择字体大小" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">小</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="large">大</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">语言选择</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-cn">中文</SelectItem>
                <SelectItem value="en-us">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">主要颜色</Label>
            <Input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-12 p-0 border-none"
            />
          </div>
        </div>

        {/* 组件显示设置 */}
        <div className="space-y-2">
          <Label>显示/隐藏组件</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showComponents.searchBar}
                onChange={(e) =>
                  setShowComponents({
                    ...showComponents,
                    searchBar: e.target.checked,
                  })
                }
                className="form-checkbox h-5 w-5"
              />
              <span>搜索栏</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showComponents.statusBar}
                onChange={(e) =>
                  setShowComponents({
                    ...showComponents,
                    statusBar: e.target.checked,
                  })
                }
                className="form-checkbox h-5 w-5"
              />
              <span>状态栏</span>
            </label>
          </div>
        </div>

        {/* 图表选项 */}
        <div className="space-y-4">
          <Label>图表选项</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={chartOptions.showGrid}
                onChange={(e) =>
                  setChartOptions({
                    ...chartOptions,
                    showGrid: e.target.checked,
                  })
                }
                className="form-checkbox h-5 w-5"
              />
              <span>显示网格</span>
            </label>

            <div className="space-y-2">
              <Label htmlFor="dataPointSize">数据点大小</Label>
              <Input
                id="dataPointSize"
                type="range"
                min="1"
                max="10"
                value={chartOptions.dataPointSize}
                onChange={(e) =>
                  setChartOptions({
                    ...chartOptions,
                    dataPointSize: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex-1 flex items-center justify-center p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <Reset className="w-4 h-4 mr-2" /> 重置默认
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex-1 flex items-center justify-center p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <Save className="w-4 h-4 mr-2" /> 保存设置
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizationPanel;
