"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, JSX } from "react";
import { useAstroStore } from "@/store/useInformationStore";
import { CelestialData } from "@/types/infomation";
import {
  Sun,
  Moon,
  Cloud,
  Thermometer,
  Droplet,
  Wind,
  Sunrise,
  Sunset,
  Calendar,
  Clock,
  Compass,
  Star,
} from "lucide-react";

interface CelestialInfoProps {
  data: CelestialData;
}

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: "spring",
      stiffness: 100,
      damping: 10,
      mass: 0.5,
    },
  }),
  hover: {
    scale: 1.02,
    rotateX: 1,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export function CelestialInfo() {
  const { data: celestialData, updateData } = useAstroStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!celestialData) {
      setError("无法加载天文数据");
    } else {
      setError(null);
    }
  }, [celestialData]);

  useEffect(() => {
    updateData();
    const interval = setInterval(() => {
      updateData();
    }, 60000); // 每分钟更新一次数据

    return () => clearInterval(interval);
  }, [updateData]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-500 text-white p-4 rounded-lg"
      >
        {error}
      </motion.div>
    );
  }

  if (!celestialData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-yellow-500 text-white p-4 rounded-lg"
      >
        加载中...
      </motion.div>
    );
  }

  const metrics: {
    label: string;
    value: string | number;
    icon: JSX.Element;
    tooltip?: string;
  }[] = [
    {
      label: "当前时间",
      value: celestialData.current_time || "N/A",
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      tooltip: "本地时间",
    },
    {
      label: "温度",
      value: `${celestialData.weather.temperature || "N/A"}°C`,
      icon: <Thermometer className="w-5 h-5 text-red-500" />,
      tooltip: "当前温度",
    },
    {
      label: "湿度",
      value: `${celestialData.weather.humidity || "N/A"}%`,
      icon: <Droplet className="w-5 h-5 text-blue-500" />,
      tooltip: "相对湿度",
    },
    {
      label: "气压",
      value: `${celestialData.weather.pressure || "N/A"} hPa`,
      icon: <Wind className="w-5 h-5 text-gray-500" />,
      tooltip: "大气压力",
    },
    {
      label: "云量",
      value: `${celestialData.weather.cloud_cover || "N/A"}%`,
      icon: <Cloud className="w-5 h-5 text-gray-500" />,
      tooltip: "云层覆盖率",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[calc(100vh-4rem)] p-2 lg:p-4"
    >
      <Card className="bg-gray-900/80 backdrop-blur-sm h-full border-gray-800">
        <CardHeader className="border-b border-gray-800 py-2 lg:py-4">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-400" />
            观测条件
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 lg:p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover="hover"
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50"
              >
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  {metric.icon}
                  {metric.label}
                </div>
                <div className="text-white font-medium text-lg ml-7">
                  {metric.value}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
