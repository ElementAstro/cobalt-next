import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import styled, { ThemeProvider } from "styled-components";

// 定义主题
const lightTheme = {
  background: "#fff",
  grid: "#ccc",
  text: "#000",
  tooltipBg: "#fff",
  tooltipText: "#000",
  scatterColor: "#82ca9d",
};

const darkTheme = {
  background: "#333",
  grid: "#555",
  text: "#fff",
  tooltipBg: "#444",
  tooltipText: "#fff",
  scatterColor: "#8884d8",
};

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

interface ScatterChartProps {
  data: { x: number; y: number }[];
  width: string | number;
  height: number;
  darkMode?: boolean;
  customize?: {
    scatterColor?: string;
    gridColor?: string;
    tooltipBg?: string;
    tooltipText?: string;
  };
}

const ScatterPlot: React.FC<ScatterChartProps> = ({
  data,
  width,
  height,
  darkMode = false,
  customize = {},
}) => {
  const theme = darkMode ? darkTheme : lightTheme;
  const scatterColor = customize.scatterColor || theme.scatterColor;
  const gridColor = customize.gridColor || theme.grid;
  const tooltipBg = customize.tooltipBg || theme.tooltipBg;
  const tooltipText = customize.tooltipText || theme.tooltipText;

  return (
    <ThemeProvider theme={theme}>
      <ChartContainer>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width={width} height={height}>
            <ScatterChart>
              <CartesianGrid stroke={gridColor} />
              <XAxis
                type="number"
                dataKey="x"
                name="X 值"
                domain={["auto", "auto"]}
                stroke={theme.text}
                tick={{ fill: theme.text }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Y 值"
                domain={["auto", "auto"]}
                stroke={theme.text}
                tick={{ fill: theme.text }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Scatter name="数据点" data={data} fill={scatterColor} />
              </motion.div>
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
      </ChartContainer>
    </ThemeProvider>
  );
};

export default ScatterPlot;
