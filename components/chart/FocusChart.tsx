import React, { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { ChartWrapper } from "./ChartWrapper";
import { CustomizationPanel } from "./CustomizationPanel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { combinedLightTheme, combinedDarkTheme } from "./chartThemes";

interface DataPoint {
  x: number;
  y: number;
}

interface ChartCustomization {
  showGrid: boolean;
  showTooltip: boolean;
  showLegend: boolean;
  showAxis: boolean;
  enableAnimation: boolean;
  dataPointSize: number;
  lineThickness: number;
  curveType: "linear" | "natural" | "step" | "monotone";
  colorScheme: string;
  darkMode: boolean;
}

const initialChartOptions: ChartCustomization = {
  showGrid: true,
  showTooltip: true,
  showLegend: true,
  showAxis: true,
  enableAnimation: true,
  dataPointSize: 4,
  lineThickness: 2,
  curveType: "monotone",
  colorScheme: "default",
  darkMode: false,
};

const initialViewOptions = {
  searchBar: true,
  statusBar: true,
  toolbar: true,
  minimap: false,
  zoomControls: true,
};

interface FocusChartProps {
  data: DataPoint[];
  width: string | number;
  height: number;
  currentX: number;
  darkMode?: boolean;
  customize?: {
    scatterColor?: string;
    gridColor?: string;
    referenceLineColor?: string;
  };
}

const FocusChart: React.FC<FocusChartProps> = ({
  data,
  width,
  height,
  currentX,
  darkMode = false,
  customize = {},
}) => {
  const [chartOptions, setChartOptions] = useState(initialChartOptions);
  const [viewOptions, setViewOptions] = useState(initialViewOptions);

  const handleDownload = () => {
    const svg = document.querySelector(".recharts-wrapper svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "focus-chart.svg";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleShare = () => {
    console.log("Sharing chart...");
  };

  const theme = darkMode ? combinedDarkTheme : combinedLightTheme;
  const scatterColor = customize.scatterColor || theme.scatterColor;
  const gridColor = customize.gridColor || theme.grid;
  const referenceLineColor =
    customize.referenceLineColor || theme.referenceLineColor;

  return (
    <ChartWrapper
      title="焦点散点图"
      controls={
        <Button onClick={handleDownload} className="mr-2">
          <Download size={16} className="mr-2" />
          下载
        </Button>
      }
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
        <ScatterChart>
          <CartesianGrid stroke={gridColor} />
          <XAxis
            type="number"
            dataKey="x"
            name="Position"
            stroke={theme.text}
            tick={{ fill: theme.text }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="FWHM"
            stroke={theme.text}
            tick={{ fill: theme.text }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              color: theme.tooltipText,
            }}
          />
          <Scatter name="FWHM" data={data} fill={scatterColor} />
          <ReferenceLine
            x={currentX}
            stroke={referenceLineColor}
            strokeDasharray="3 3"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default FocusChart;
