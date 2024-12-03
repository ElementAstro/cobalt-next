import { useState, useEffect } from "react";
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
} from "recharts";
import { Download, RefreshCw, BarChart2, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ChartComponentProps {
  mode: "real" | "mock";
}

export function ChartComponent({ mode }: ChartComponentProps) {
  const [chartData, setChartData] = useState<
    Array<{ name: number; hfd: number; starIndex: number }>
  >([]);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  useEffect(() => {
    const fetchData = () => {
      if (mode === "mock") {
        const mockData = Array.from({ length: 10 }, (_, i) => ({
          name: i + 1,
          hfd: Math.random() * 20 - 10,
          starIndex: Math.random() * 30,
        }));
        setChartData(mockData);
      } else {
        // 在真实模式下，从API或设备获取数据
        // 这里暂时清空数据
        setChartData([]);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // 每5秒刷新一次数据

    return () => clearInterval(interval);
  }, [mode]);

  const clearChart = () => {
    setChartData([]);
  };

  const exportToCSV = () => {
    const headers = ["Name", "HFD", "Star Index"];
    const rows = chartData.map((data) => [data.name, data.hfd, data.starIndex]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "chart_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleChartType = () => {
    setChartType((prev) => (prev === "line" ? "bar" : "line"));
  };

  return (
    <div className="relative h-80 sm:h-96 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="absolute right-2 top-2 flex space-x-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={exportToCSV}
        >
          <Button variant="ghost" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChartType}
        >
          <Button variant="ghost" size="sm" className="flex items-center">
            {chartType === "line" ? (
              <>
                <BarChart2 className="h-4 w-4 mr-1" />
                柱状图
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-1" />
                折线图
              </>
            )}
          </Button>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearChart}
        >
          <Button variant="ghost" size="sm" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-1" />
            清空
          </Button>
        </motion.button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis
              stroke="#666"
              domain={[-20, 30]}
              ticks={[-20, -10, 0, 10, 20, 30]}
            />
            <Tooltip />
            <Legend />
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
            <Tooltip />
            <Legend />
            <Bar dataKey="hfd" fill="#4ade80" barSize={20} />
            <Bar dataKey="starIndex" fill="#60a5fa" barSize={20} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
