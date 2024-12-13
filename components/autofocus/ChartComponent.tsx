import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Download,
  RefreshCw,
  BarChart2,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCw,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ChartComponentProps {
  mode: "real" | "mock";
}

export function ChartComponent({ mode }: ChartComponentProps) {
  const [chartData, setChartData] = useState<
    Array<{
      name: number;
      hfd: number;
      starIndex: number;
      timestamp: string;
    }>
  >([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [zoomDomain, setZoomDomain] = useState<[number, number]>([0, 100]);
  const [historyData, setHistoryData] = useState<(typeof chartData)[]>([]);

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const fetchData = useCallback(() => {
    if (mode === "mock") {
      const newData = Array.from({ length: 10 }, (_, i) => ({
        name: i + 1,
        hfd: Math.random() * 20 - 10,
        starIndex: Math.random() * 30,
        timestamp: new Date().toISOString(),
      }));
      setChartData(newData);
      setHistoryData((prev) => [...prev, newData].slice(-10));
    } else {
      // 真实数据获取逻辑
      setChartData([]);
    }
  }, [mode]);

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout;

    if (autoRefresh) {
      interval = setInterval(fetchData, 5000);
    }

    return () => interval && clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const containerClass = `
    relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md
    transition-all duration-300 ease-in-out
    ${isLandscape && isMobile ? "h-screen" : "h-80 sm:h-96"}
    ${isLandscape && isMobile ? "max-w-screen-lg mx-auto" : "w-full"}
  `;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const ControlButton = ({ icon: Icon, label, onClick }: any) => (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center dark:text-gray-200"
      >
        <Icon className="h-4 w-4 mr-1" />
        {label}
      </Button>
    </motion.button>
  );

  return (
    <motion.div
      className={containerClass}
      initial="hidden"
      animate="visible"
      variants={chartVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute right-2 top-2 flex flex-wrap gap-2 z-10">
        <ControlButton
          icon={Download}
          label="导出"
          onClick={() => {
            /* 导出逻辑 */
          }}
        />
        <ControlButton
          icon={chartType === "line" ? BarChart2 : Activity}
          label={chartType === "line" ? "柱状图" : "折线图"}
          onClick={() =>
            setChartType((prev) => (prev === "line" ? "bar" : "line"))
          }
        />
        <ControlButton
          icon={autoRefresh ? RotateCw : History}
          label={autoRefresh ? "自动刷新" : "手动刷新"}
          onClick={() => setAutoRefresh((prev) => !prev)}
        />
        <ControlButton
          icon={RefreshCw}
          label="清空"
          onClick={() => setChartData([])}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#666" domain={zoomDomain} />
                <YAxis
                  stroke="#666"
                  domain={[-20, 30]}
                  ticks={[-20, -10, 0, 10, 20, 30]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#e5e7eb",
                  }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Line
                  type="monotone"
                  dataKey="hfd"
                  stroke="#4ade80"
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="starIndex"
                  stroke="#60a5fa"
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis
                  stroke="#666"
                  domain={[-20, 30]}
                  ticks={[-20, -10, 0, 10, 20, 30]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#e5e7eb",
                  }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#666" />
                <Bar
                  dataKey="hfd"
                  fill="#4ade80"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="starIndex"
                  fill="#60a5fa"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
