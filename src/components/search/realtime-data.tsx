"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSearchStore from "@/store/useSearchStore";

interface RealTimeData {
  timestamp: string;
  moonPhase: number;
  visiblePlanets: string[];
  weather: {
    cloudCover: number;
    temperature: number;
    humidity: number;
  };
}

export function RealTimeData() {
  const { realTimeData, fetchRealTimeData } = useSearchStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRealTimeData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [fetchRealTimeData]);

  if (!realTimeData) {
    return <div>Loading real-time data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        bounce: 0.3,
      }}
      whileHover={{ scale: 1.02 }}
      className="w-full p-2"
    >
      <Card className="w-full md:w-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
            实时天文数据
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                最后更新: {new Date(realTimeData.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                月相: {Math.round(realTimeData.moonPhase * 100)}%
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                可见行星: {realTimeData.visiblePlanets.join(", ") || "无"}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                云量: {Math.round(realTimeData.weather.cloudCover * 100)}%
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                温度: {realTimeData.weather.temperature}°C
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                湿度: {realTimeData.weather.humidity}%
              </p>
              <TooltipProvider>
                {[
                  { label: "云量", value: realTimeData.weather.cloudCover },
                  { label: "月相", value: realTimeData.moonPhase },
                  { label: "能见度", value: 0.8 }, // 新增数据
                  { label: "大气稳定性", value: 0.7 }, // 新增数据
                ].map(({ label, value }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger className="w-full">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>{label}</span>
                          <span>{Math.round(value * 100)}%</span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <Progress value={value * 100} />
                        </motion.div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>点击查看{label}详情</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </motion.div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
