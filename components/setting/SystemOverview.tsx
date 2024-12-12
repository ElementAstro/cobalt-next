"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemStore } from "@/lib/store/system";
import { motion } from "framer-motion";
import { Span } from "@/components/custom/Span";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Thermometer,
  Wifi,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export function SystemOverview() {
  const { systemInfo } = useSystemStore();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  const cards = [
    {
      title: "CPU 使用率",
      value: `${systemInfo.cpuUsage.toFixed(1)}%`,
      details: `${systemInfo.loadAverage
        .map((load) => load.toFixed(2))
        .join(", ")} (1, 5, 15 分钟)`,
      icon: <Cpu className="h-6 w-6 text-blue-500" />,
      variant: "info" as const,
    },
    {
      title: "内存使用率",
      value: `${systemInfo.memoryUsage.toFixed(1)}%`,
      details: `${(
        (systemInfo.memoryUsage * systemInfo.totalMemory) /
        100
      ).toFixed(1)} GB / ${systemInfo.totalMemory} GB`,
      icon: <MemoryStick className="h-6 w-6 text-green-500" />,
      variant: "success" as const,
    },
    {
      title: "磁盘使用率",
      value: `${systemInfo.diskUsage.toFixed(1)}%`,
      details: `${((systemInfo.diskUsage * systemInfo.totalDisk) / 100).toFixed(
        1
      )} GB / ${systemInfo.totalDisk} GB`,
      icon: <HardDrive className="h-6 w-6 text-yellow-500" />,
      variant: "warning" as const,
    },
    {
      title: "系统温度",
      value: `${systemInfo.temperature.toFixed(1)}°C`,
      details: systemInfo.temperatureDetails.join(", "),
      icon: <Thermometer className="h-6 w-6 text-red-500" />,
      variant: "error" as const,
    },
    {
      title: "网络使用率",
      value: `${systemInfo.networkUsage.toFixed(1)} Mbps`,
      details: `下载: ${systemInfo.downloadSpeed.toFixed(
        1
      )} Mbps, 上传: ${systemInfo.uploadSpeed.toFixed(1)} Mbps`,
      icon: <Wifi className="h-6 w-6 text-purple-500" />,
      variant: "primary" as const,
    },
    {
      title: "GPU 使用率",
      value: `${systemInfo.gpuUsage.toFixed(1)}%`,
      details: `${systemInfo.gpuTemperature.toFixed(1)}°C`,
      icon: <TrendingUp className="h-6 w-6 text-indigo-500" />,
      variant: "secondary" as const,
    },
  ];

  const [showDetails, setShowDetails] = useState(
    Array(cards.length).fill(false)
  );

  const toggleDetails = (index: number) => {
    setShowDetails((prev) =>
      prev.map((show, i) => (i === index ? !show : show))
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 p-2 dark:bg-gray-800">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="flex"
        >
          <Card
            className={`flex-1 shadow-lg rounded-lg border ${
              card.variant === "info"
                ? "border-blue-500"
                : card.variant === "success"
                ? "border-green-500"
                : card.variant === "warning"
                ? "border-yellow-500"
                : card.variant === "error"
                ? "border-red-500"
                : card.variant === "primary"
                ? "border-purple-500"
                : "border-indigo-500"
            } dark:bg-gray-700`}
          >
            <CardHeader className="flex items-center space-x-4">
              {card.icon}
              <CardTitle className="text-lg font-semibold text-white">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex items-center justify-between">
                <Span className="text-2xl font-bold">{card.value}</Span>
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                    onClick={() => toggleDetails(index)}
                  >
                    <span className="sr-only">详细信息</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-5 w-5 text-gray-400 hover:text-gray-200"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </motion.div>
                </div>
              </div>
              {showDetails[index] && card.details && (
                <p className="text-sm text-gray-400 mt-2">{card.details}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
