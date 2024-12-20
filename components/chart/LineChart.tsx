import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import styled, { ThemeProvider } from "styled-components";
import { ChartWrapper } from "./ChartWrapper";
import {
  Download,
  Eye,
  EyeOff,
  Share2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { combinedLightTheme, combinedDarkTheme } from "./chartThemes";

// 样式容器
const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.background};
  padding: 20px;
  box-sizing: border-box;
`;

// 动画变体
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

interface LineGraphProps {
  data: { x: number; ra: number; dec: number }[];
  title?: string;
  description?: string;
  width?: string | number;
  height?: number;
  darkMode?: boolean;
  showControls?: boolean;
  enableBrush?: boolean;
  enableZoom?: boolean;
}

export const LineChart: React.FC<LineGraphProps> = ({
  data,
  title = "数据趋势",
  width = "100%",
  height = 400,
  darkMode = true,
  showControls = true,
  enableBrush = true,
  enableZoom = true,
}) => {
  const [zoomDomain, setZoomDomain] = React.useState<{
    x: [number, number];
    y: [number, number];
  }>({
    x: [0, data.length - 1],
    y: [0, Math.max(...data.map((d) => Math.max(d.ra, d.dec)))],
  });

  const theme = darkMode ? combinedDarkTheme : combinedLightTheme;
  const gridColor = theme.grid;
  const tooltipBg = theme.tooltipBg;
  const tooltipText = theme.tooltipText;
  const lineColors = theme.lineColors;

  const handleZoomIn = () => {
    const currentDomain = zoomDomain.x;
    const range = currentDomain[1] - currentDomain[0];
    const middle = (currentDomain[0] + currentDomain[1]) / 2;
    setZoomDomain({
      ...zoomDomain,
      x: [middle - range / 4, middle + range / 4],
    });
  };

  const handleZoomOut = () => {
    const currentDomain = zoomDomain.x;
    const range = currentDomain[1] - currentDomain[0];
    const middle = (currentDomain[0] + currentDomain[1]) / 2;
    setZoomDomain({
      ...zoomDomain,
      x: [
        Math.max(0, middle - range),
        Math.min(data.length - 1, middle + range),
      ],
    });
  };

  const handleReset = () => {
    setZoomDomain({
      x: [0, data.length - 1],
      y: [0, Math.max(...data.map((d) => Math.max(d.ra, d.dec)))],
    });
  };

  const chartControls = (
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm" onClick={handleZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );

  const customization = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">图表类型</h3>
        <Select defaultValue="line">
          <SelectTrigger>
            <SelectValue placeholder="选择图表类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">折线图</SelectItem>
            <SelectItem value="area">面积图</SelectItem>
            <SelectItem value="bar">柱状图</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* ...additional customization options... */}
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <ChartWrapper
        title={title}
        controls={chartControls}
        customization={customization}
        darkMode={darkMode}
      >
        <ResponsiveContainer width={width} height={height}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="x"
              domain={zoomDomain.x}
              stroke={theme.text}
              tick={{ fill: theme.text }}
            />
            <YAxis
              domain={zoomDomain.y}
              stroke={theme.text}
              tick={{ fill: theme.text }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                color: tooltipText,
              }}
            />
            <Legend />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Line
                type="monotone"
                dataKey="ra"
                stroke={lineColors.ra}
                dot={false}
                strokeWidth={2}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Line
                type="monotone"
                dataKey="dec"
                stroke={lineColors.dec}
                dot={false}
                strokeWidth={2}
              />
            </motion.div>
            {enableBrush && <Brush />}
            {enableZoom && (
              <>
                <ReferenceLine x={zoomDomain.x[0]} stroke="red" />
                <ReferenceLine x={zoomDomain.x[1]} stroke="red" />
              </>
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ThemeProvider>
  );
};

export default LineChart;
