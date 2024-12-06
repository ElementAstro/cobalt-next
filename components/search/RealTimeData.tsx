"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

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
  const [data, setData] = useState<RealTimeData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/real-time-data");
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div>Loading real-time data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-2"
    >
      <Card className="w-full md:w-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
            实时天文数据
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                最后更新: {new Date(data.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                月相: {Math.round(data.moonPhase * 100)}%
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                可见行星: {data.visiblePlanets.join(", ") || "无"}
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                云量: {Math.round(data.weather.cloudCover * 100)}%
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                温度: {data.weather.temperature}°C
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                湿度: {data.weather.humidity}%
              </p>
            </motion.div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
