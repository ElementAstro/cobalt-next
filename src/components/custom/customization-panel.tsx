import React from "react";
import { motion } from "framer-motion";
import {
  Save,
  X as Reset,
  Palette,
  LineChart,
  Eye,
  Settings,
  Download,
  Grid,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ChartCustomization {
  showGrid: boolean;
  showTooltip: boolean;
  showLegend: boolean;
  showAxis: boolean;
  enableAnimation: boolean;
  animationType: string;
  animationDuration: number;
  dataPointSize: number;
  lineThickness: number;
  curveType: "linear" | "natural" | "step" | "monotone";
  colorScheme: string;
  darkMode: boolean;
  gradientFill: boolean;
}

interface ViewOptions {
  searchBar: boolean;
  statusBar: boolean;
  toolbar: boolean;
  minimap: boolean;
  zoomControls: boolean;
}

interface CustomizationPanelProps {
  chartOptions: ChartCustomization;
  setChartOptions: (options: ChartCustomization) => void;
  viewOptions: ViewOptions;
  setViewOptions: (options: ViewOptions) => void;
  onExport: (type: "json" | "png" | "svg") => void;
  onShare: () => void;
  className?: string;
  exporting?: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  chartOptions,
  setChartOptions,
  viewOptions,
  setViewOptions,
  onExport,
  onShare,
  className = "",
}) => {
  const handleReset = () => {
    setChartOptions({
      showGrid: true,
      showTooltip: true,
      showLegend: true,
      showAxis: true,
      enableAnimation: true,
      animationType: "easeInOut",
      animationDuration: 1000,
      dataPointSize: 4,
      lineThickness: 2,
      curveType: "monotone",
      colorScheme: "default",
      darkMode: false,
      gradientFill: false,
    });
    setViewOptions({
      searchBar: true,
      statusBar: true,
      toolbar: true,
      minimap: false,
      zoomControls: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-lg shadow-lg ${
        chartOptions.darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-gray-900"
      } ${className}`}
    >
      <TooltipProvider>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="chart-settings">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4" />
                图表设置
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showGrid">网格</Label>
                  <Switch
                    id="showGrid"
                    checked={chartOptions.showGrid}
                    onCheckedChange={(checked) =>
                      setChartOptions({ ...chartOptions, showGrid: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showTooltip">提示框</Label>
                  <Switch
                    id="showTooltip"
                    checked={chartOptions.showTooltip}
                    onCheckedChange={(checked) =>
                      setChartOptions({ ...chartOptions, showTooltip: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>数据点大小</Label>
                <Input
                  type="range"
                  min={1}
                  max={10}
                  value={chartOptions.dataPointSize}
                  onChange={(e) =>
                    setChartOptions({
                      ...chartOptions,
                      dataPointSize: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>曲线类型</Label>
                <Select
                  value={chartOptions.curveType}
                  onValueChange={(
                    value: "linear" | "natural" | "step" | "monotone"
                  ) => setChartOptions({ ...chartOptions, curveType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">线性</SelectItem>
                    <SelectItem value="natural">自然</SelectItem>
                    <SelectItem value="step">阶梯</SelectItem>
                    <SelectItem value="monotone">单调</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="view-settings">
            <AccordionTrigger className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                视图设置
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(viewOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setViewOptions({ ...viewOptions, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-2 p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onExport("json")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>导出数据</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>分享图表</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleReset}>
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>重置设置</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </motion.div>
  );
};

export default CustomizationPanel;
