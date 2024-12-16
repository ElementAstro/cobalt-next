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
  ZoomPane,
  Brush,
} from "recharts";
import { motion } from "framer-motion";
import styled, { ThemeProvider } from "styled-components";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// 扩展主题定义
const lightTheme = {
  background: "#fff",
  grid: "#ccc",
  text: "#000",
  tooltipBg: "#fff",
  tooltipText: "#000",
  scatterColor: "#82ca9d",
  legendBg: "#f5f5f5",
  brushBg: "rgba(130, 202, 157, 0.2)",
};

const darkTheme = {
  background: "#333",
  grid: "#555",
  text: "#fff",
  tooltipBg: "#444",
  tooltipText: "#fff",
  scatterColor: "#8884d8",
  legendBg: "#444",
  brushBg: "rgba(136, 132, 216, 0.2)",
};

// 扩展接口
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

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.background};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ControlPanel = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${(props) => props.theme.legendBg};
  border-radius: 8px;
  display: grid;
  gap: 1rem;
`;

const ScatterPlot: React.FC<ScatterChartProps> = ({
  data,
  width,
  height,
  darkMode = false,
  customize = {},
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [pointSize, setPointSize] = useState(customize.pointSize || 4);
  const [enableZoom, setEnableZoom] = useState(false);
  const [showBrush, setShowBrush] = useState(false);

  const theme = darkMode ? darkTheme : lightTheme;

  // 数据处理函数
  const processData = useCallback(() => {
    const categories = [...new Set(data.map((item) => item.category))];
    return categories.map((category) => ({
      name: category || "默认",
      data: data.filter((item) => item.category === category),
    }));
  }, [data]);

  const handleReset = () => {
    // 重置图表状态
  };

  const handleExport = () => {
    // 导出数据为CSV
    const csv = data.map((point) => `${point.x},${point.y}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scatter_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <ChartContainer>
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width={width} height={height}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              {showGrid && (
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
              {showBrush && (
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
                  r={pointSize}
                />
              ))}
              {enableZoom && <ZoomPane />}
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        <ControlPanel>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid">显示网格</Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>

          <div className="space-y-2">
            <Label>点大小</Label>
            <Slider
              value={[pointSize]}
              onValueChange={([value]) => setPointSize(value)}
              min={2}
              max={10}
              step={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-zoom">启用缩放</Label>
            <Switch
              id="enable-zoom"
              checked={enableZoom}
              onCheckedChange={setEnableZoom}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-brush">显示选择器</Label>
            <Switch
              id="show-brush"
              checked={showBrush}
              onCheckedChange={setShowBrush}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="w-full">
              重置视图
            </Button>
            <Button onClick={handleExport} variant="outline" className="w-full">
              导出数据
            </Button>
          </div>
        </ControlPanel>
      </ChartContainer>
    </ThemeProvider>
  );
};

export default ScatterPlot;
