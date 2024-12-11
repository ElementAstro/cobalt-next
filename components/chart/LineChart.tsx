import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  lineColors: {
    ra: "#8884d8",
    dec: "#82ca9d",
  },
};

const darkTheme = {
  background: "#333",
  grid: "#555",
  text: "#fff",
  tooltipBg: "#444",
  tooltipText: "#fff",
  lineColors: {
    ra: "#ff4081",
    dec: "#00e676",
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

interface LineGraphProps {
  data: { x: number; ra: number; dec: number }[];
  width: string | number;
  height: number;
  darkMode?: boolean;
  customize?: {
    gridColor?: string;
    tooltipBg?: string;
    tooltipText?: string;
    lineColors?: {
      ra?: string;
      dec?: string;
    };
  };
}

const LineGraph: React.FC<LineGraphProps> = ({
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
  const lineColors = {
    ra: customize.lineColors?.ra || theme.lineColors.ra,
    dec: customize.lineColors?.dec || theme.lineColors.dec,
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="x"
                domain={[0, 50]}
                stroke={theme.text}
                tick={{ fill: theme.text }}
              />
              <YAxis
                domain={[-4, 4]}
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
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </ChartContainer>
    </ThemeProvider>
  );
};

export default LineGraph;
