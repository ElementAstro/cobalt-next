"use client";

import React, { useState } from "react";
import {
  Line,
  LineChart as RechartsTemperatureLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ChartWrapper } from "./ChartWrapper";
import { CustomizationPanel } from "./CustomizationPanel";

interface DataPoint {
  time: string;
  temperature: number;
}

interface ChartCustomization {
  showGrid: boolean;
  showTooltip: boolean;
  showLegend: boolean;
  showAxis: boolean;
  enableAnimation: boolean;
  dataPointSize: number;
  lineThickness: number;
  curveType: "monotone" | "linear" | "natural" | "step";
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

export function TemperatureLineChart({
  data,
  enableZoom = true,
  showGrid = true,
  showLegend = true,
}: {
  data: DataPoint[];
  enableZoom?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
}) {
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
      link.download = "temperature-chart.svg";
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

  return (
    <ChartWrapper
      title="温度折线图"
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
      <ResponsiveContainer width="100%" height={300}>
        <RechartsTemperatureLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {chartOptions.showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="time"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}°C`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", borderColor: "#333" }}
            itemStyle={{ color: "#fff" }}
          />
          {chartOptions.showLegend && <Legend />}
          <Line
            type={chartOptions.curveType}
            dataKey="temperature"
            stroke="#4ade80"
            strokeWidth={chartOptions.lineThickness}
            dot={{ r: chartOptions.dataPointSize }}
            isAnimationActive={chartOptions.enableAnimation}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </RechartsTemperatureLineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export default TemperatureLineChart;
