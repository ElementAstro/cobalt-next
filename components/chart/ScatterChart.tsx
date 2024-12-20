import React, { useState, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import styled, { ThemeProvider } from "styled-components";
import { ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartWrapper } from "./ChartWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { combinedLightTheme, combinedDarkTheme } from "./chartThemes";
import CustomizationPanel, { ChartCustomization } from "./CustomizationPanel";

interface ScatterChartProps {
  data: { x: number; y: number; category?: string }[];
  width: string | number;
  height: number;
  darkMode?: boolean;
  customize?: {
    scatterColor?: string;
    gridColor?: string;
    tooltipBg?: string;
    tooltipText?: string;
    pointSize?: number;
  };
}

const ScatterPlot: React.FC<ScatterChartProps> = ({
  data,
  width,
  height,
  darkMode = false,
  customize = {},
}) => {
  const [chartOptions, setChartOptions] = useState<ChartCustomization>({
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    showAxis: true,
    enableAnimation: true,
    dataPointSize: customize.pointSize || 4,
    lineThickness: 2,
    curveType: "monotone" as const,
    colorScheme: "default",
    darkMode: darkMode,
  });
  const [viewOptions, setViewOptions] = useState({
    searchBar: true,
    statusBar: true,
    toolbar: true,
    minimap: false,
    zoomControls: true,
  });

  const theme = darkMode ? combinedDarkTheme : combinedLightTheme;

  const processData = useCallback(() => {
    const categories = Array.from(new Set(data.map((item) => item.category)));
    return categories.map((category) => ({
      name: category || "默认",
      data: data.filter((item) => item.category === category),
    }));
  }, [data]);

  const handleDownload = () => {
    const svg = document.querySelector(".recharts-wrapper svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "scatter-chart.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExport = () => {
    const csv = data.map((point) => `${point.x},${point.y}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scatter_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    console.log("Sharing chart...");
  };

  const chartControls = (
    <div className="flex space-x-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-grid">显示网格</Label>
        <Switch
          id="show-grid"
          checked={chartOptions.showGrid}
          onCheckedChange={(checked) =>
            setChartOptions({ ...chartOptions, showGrid: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="enable-zoom">启用缩放</Label>
        <Switch
          id="enable-zoom"
          checked={viewOptions.zoomControls}
          onCheckedChange={(checked) =>
            setViewOptions({ ...viewOptions, zoomControls: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-brush">显示选择器</Label>
        <Switch
          id="show-brush"
          checked={viewOptions.minimap}
          onCheckedChange={(checked) =>
            setViewOptions({ ...viewOptions, minimap: checked })
          }
        />
      </div>

      <Button variant="ghost" size="sm" onClick={handleDownload}>
        下载
      </Button>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <ChartWrapper
        title="数据分布"
        controls={chartControls}
        customization={
          <CustomizationPanel
            chartOptions={chartOptions}
            setChartOptions={setChartOptions}
            viewOptions={viewOptions}
            setViewOptions={setViewOptions}
            onExport={handleExport}
            onShare={handleShare}
          />
        }
        darkMode={chartOptions.darkMode}
      >
        <ResponsiveContainer width={width} height={height}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            {chartOptions.showGrid && (
              <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
            )}
            <XAxis
              type="number"
              dataKey="x"
              name="X 值"
              stroke={theme.text}
              tick={{ fill: theme.text }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y 值"
              stroke={theme.text}
              tick={{ fill: theme.text }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: theme.tooltipBg,
                color: theme.tooltipText,
                border: "none",
                borderRadius: "4px",
                padding: "8px",
              }}
              formatter={(value: number) => [value.toFixed(2)]}
            />
            <Legend />
            {viewOptions.minimap && (
              <Brush
                dataKey="x"
                height={30}
                stroke={theme.scatterColor}
                fill={theme.brushBg}
              />
            )}
            {processData().map((series, index) => (
              <Scatter
                key={series.name}
                name={series.name}
                data={series.data}
                fill={customize.scatterColor || theme.scatterColor}
                shape="circle"
                r={chartOptions.dataPointSize}
              />
            ))}
            {viewOptions.zoomControls && <ZoomIn />}
          </ScatterChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ThemeProvider>
  );
};

export default ScatterPlot;
