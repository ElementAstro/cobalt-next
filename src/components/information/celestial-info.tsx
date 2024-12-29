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
import { Sun, Moon, Cloud, Thermometer, Droplet, Wind } from "lucide-react";

interface CelestialInfoProps {
  data: CelestialData;
}

const tableVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
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
  }[] = [
    {
      label: "当前时间",
      value: celestialData.current_time || "N/A",
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "温度",
      value: celestialData.weather.temperature || "N/A",
      icon: <Thermometer className="w-5 h-5 text-red-500" />,
    },
    {
      label: "湿度",
      value: celestialData.weather.humidity || "N/A",
      icon: <Droplet className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "气压",
      value: celestialData.weather.pressure || "N/A",
      icon: <Wind className="w-5 h-5 text-gray-500" />,
    },
    {
      label: "云量",
      value: celestialData.weather.cloud_cover || "N/A",
      icon: <Cloud className="w-5 h-5 text-gray-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-gray-900 dark:bg-gray-800">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl sm:text-2xl font-bold text-white dark:text-gray-200">
            当前条件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      指标
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      值
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {metrics.map((metric, index) => (
                      <motion.tr
                        key={metric.label}
                        custom={index}
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                          {metric.icon}
                          <span className="ml-2">{metric.label}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {metric.value}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
