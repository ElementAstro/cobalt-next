import React from "react";
import {
  AreaChart,
  Area,
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
  areaColors: {
    r: "#ff0000",
    g: "#00ff00",
    b: "#0000ff",
  },
};

const darkTheme = {
  background: "#333",
  grid: "#555",
  text: "#fff",
  tooltipBg: "#444",
  tooltipText: "#fff",
  areaColors: {
    r: "#ff5555",
    g: "#55ff55",
    b: "#5555ff",
  },
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

interface HistogramChartProps {
  data: { x: number; r: number; g: number; b: number }[];
  width: string | number;
  height: number;
  darkMode?: boolean;
  customize?: {
    gridColor?: string;
    tooltipBg?: string;
    tooltipText?: string;
    areaColors?: {
      r?: string;
      g?: string;
      b?: string;
    };
  };
}

const HistogramChart: React.FC<HistogramChartProps> = ({
  data,
  width,
  height,
  darkMode = false,
  customize = {},
}) => {
  const theme = darkMode ? darkTheme : lightTheme;
  const gridColor = customize.gridColor || theme.grid;
  const tooltipBg = customize.tooltipBg || theme.tooltipBg;
  const tooltipText = customize.tooltipText || theme.tooltipText;
  const areaColors = {
    r: customize.areaColors?.r || theme.areaColors.r,
    g: customize.areaColors?.g || theme.areaColors.g,
    b: customize.areaColors?.b || theme.areaColors.b,
  };

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
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="x"
                domain={[0, 255]}
                stroke={theme.text}
                tick={{ fill: theme.text }}
              />
              <YAxis stroke={theme.text} tick={{ fill: theme.text }} />
              <Tooltip
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
                <Area
                  type="monotone"
                  dataKey="r"
                  stroke={areaColors.r}
                  fill={areaColors.r}
                  fillOpacity={0.6}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Area
                  type="monotone"
                  dataKey="g"
                  stroke={areaColors.g}
                  fill={areaColors.g}
                  fillOpacity={0.6}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Area
                  type="monotone"
                  dataKey="b"
                  stroke={areaColors.b}
                  fill={areaColors.b}
                  fillOpacity={0.6}
                />
              </motion.div>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </ChartContainer>
    </ThemeProvider>
  );
};

export default HistogramChart;
