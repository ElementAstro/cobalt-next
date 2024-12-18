import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Planet } from "@/types/skymap/planet";
import { X, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface PlanetDetailProps {
  planet: Planet;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function PlanetDetail({
  planet,
  onClose,
  onToggleFavorite,
}: PlanetDetailProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="relative w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </Button>
        <div className="flex flex-col lg:flex-row items-center mb-4 landscape:flex-row">
          <motion.div
            className="relative w-24 h-24 mr-4 landscape:w-32 landscape:h-32"
            animate={{ rotate: rotation }}
          >
            <img
              src={`/placeholder.svg?height=96&width=96`}
              alt={planet.name}
              className="w-full h-full rounded-full"
            />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {planet.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {planet.status}
            </p>
          </div>
          <Button
            onClick={() => onToggleFavorite(planet.id)}
            variant="ghost"
            className="ml-auto text-yellow-500 hover:text-yellow-600"
          >
            <Star size={24} fill={planet.favorite ? "currentColor" : "none"} />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              升起时间
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {planet.riseTime}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              落下时间
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {planet.setTime}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              角度
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {planet.angle}°
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              直径
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {planet.diameter}"
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              亮度
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {planet.brightness}
            </p>
          </div>
        </div>
        <motion.div className="w-full mt-4">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-4 landscape:grid-cols-5">
              <TabsTrigger value="description">描述</TabsTrigger>
              <TabsTrigger value="location">位置</TabsTrigger>
              <TabsTrigger value="statistics">统计</TabsTrigger>
              <TabsTrigger value="observation">观测建议</TabsTrigger>
              <TabsTrigger value="history" className="hidden landscape:block">
                历史记录
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-gray-700 dark:text-gray-300">
                {planet.description}
              </p>
            </TabsContent>
            <TabsContent value="location">
              <p>升起时间: {planet.riseTime}</p>
              <p>落下时间: {planet.setTime}</p>
            </TabsContent>
            <TabsContent value="statistics">
              <p>角度: {planet.angle}°</p>
              <p>直径: {planet.diameter}"</p>
              <p>亮度: {planet.brightness}</p>
            </TabsContent>
            <TabsContent value="observation">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">最佳观测时间</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {`最佳观测时间: ${planet.riseTime} - ${planet.setTime}`}
                </p>
                <h3 className="text-lg font-semibold">观测建议</h3>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                  <li>推荐使用的设备类型</li>
                  <li>最佳观测地点建议</li>
                  <li>天气条件建议</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">历史记录</h3>
                <div className="grid gap-2">
                  {/* 添加历史观测记录列表 */}
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <p>上次观测时间: 2024-01-15</p>
                    <p>观测条件: 晴朗</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
