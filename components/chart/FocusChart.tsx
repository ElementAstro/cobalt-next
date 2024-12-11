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
import styled, { ThemeProvider } from "styled-components";

// 定义主题
const lightTheme = {
  background: "#fff",
  grid: "#ccc",
  text: "#000",
  scatter: "#82ca9d",
  reference: "red",
  tooltipBg: "#fff",
  tooltipText: "#000",
};

const darkTheme = {
  background: "#333",
  grid: "#555",
  text: "#fff",
  scatter: "#8884d8",
  reference: "red",
  tooltipBg: "#444",
  tooltipText: "#fff",
};

// 样式容器
const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.background};
  padding: 20px;
  box-sizing: border-box;
`;

interface FocusChartProps {
  data: { x: number; y: number }[];
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
  const theme = darkMode ? darkTheme : lightTheme;
  const scatterColor = customize.scatterColor || theme.scatter;
  const gridColor = customize.gridColor || theme.grid;
  const referenceLineColor = customize.referenceLineColor || theme.reference;

  return (
    <ThemeProvider theme={theme}>
      <ChartContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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
        </motion.div>
      </ChartContainer>
    </ThemeProvider>
  );
};

export default FocusChart;
