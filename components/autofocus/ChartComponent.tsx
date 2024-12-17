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
  Play,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ChartLegend } from "./ChartLegend";
import { Slider } from "@/components/ui/slider";

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
  const [activeDataKeys, setActiveDataKeys] = useState(["hfd", "starIndex"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

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

  const handleSeriesToggle = (series: string) => {
    setActiveDataKeys((prev) =>
      prev.includes(series)
        ? prev.filter((key) => key !== series)
        : [...prev, series]
    );
  };

  const handleZoom = (value: number) => {
    setZoomLevel(value);
    const dataLength = chartData.length;
    setZoomDomain([
      Math.max(0, dataLength - (dataLength * value) / 100),
      dataLength,
    ]);
  };

  const playHistory = useCallback(() => {
    if (historyData.length === 0) return;
    setIsPlaying(true);
    const interval = setInterval(() => {
      setHistoryIndex((prev) => {
        if (prev >= historyData.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [historyData]);

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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <ChartLegend
            onSeriesToggle={handleSeriesToggle}
            activeItems={activeDataKeys}
          />
          <div className="flex gap-2">
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
            <ControlButton
              icon={ZoomIn}
              label="放大"
              onClick={() => handleZoom(Math.min(zoomLevel + 10, 100))}
            />
            <ControlButton
              icon={ZoomOut}
              label="缩小"
              onClick={() => handleZoom(Math.max(zoomLevel - 10, 10))}
            />
          </div>
        </div>

        <div className="relative flex-1">
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
                  <LineChart
                    data={isPlaying ? historyData[historyIndex] : chartData}
                  >
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
                    {activeDataKeys.includes("hfd") && (
                      <Line
                        type="monotone"
                        dataKey="hfd"
                        stroke="#4ade80"
                        dot={false}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    )}
                    {activeDataKeys.includes("starIndex") && (
                      <Line
                        type="monotone"
                        dataKey="starIndex"
                        stroke="#60a5fa"
                        dot={false}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    )}
                  </LineChart>
                ) : (
                  <BarChart
                    data={isPlaying ? historyData[historyIndex] : chartData}
                  >
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
                    {activeDataKeys.includes("hfd") && (
                      <Bar
                        dataKey="hfd"
                        fill="#4ade80"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                    {activeDataKeys.includes("starIndex") && (
                      <Bar
                        dataKey="starIndex"
                        fill="#60a5fa"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>

        {historyData.length > 0 && (
          <div className="flex items-center gap-4 p-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isPlaying ? setIsPlaying(false) : playHistory())}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[historyIndex]}
              max={historyData.length - 1}
              step={1}
              onValueChange={([value]) => setHistoryIndex(value)}
              disabled={isPlaying}
              className="flex-1"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
