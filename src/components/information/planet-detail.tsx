"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlanetData } from "@/types/infomation";
import {
  X,
  Star,
  Sunrise,
  Sunset,
  Navigation,
  CircleDot,
  Moon,
  Cloud,
  Thermometer,
  Orbit,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanetDetailProps {
  planet: PlanetData;
  onClose: () => void;
  onToggleFavorite?: (name: string) => void;
  favorite?: boolean;
}

export function PlanetDetail({
  planet,
  onClose,
  onToggleFavorite,
  favorite = false,
}: PlanetDetailProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30); // 加快旋转速度
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: string) => {
    return time || "N/A";
  };

  const formatAngle = (angle: number) => {
    return `${angle.toFixed(1)}°`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 50 }}
        className="relative w-full max-w-2xl bg-gray-900/90 rounded-lg shadow-xl border border-gray-800"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          <X size={24} />
        </Button>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <motion.div
              className="relative w-24 h-24 sm:w-32 sm:h-32"
              animate={{ rotate: rotation }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "linear",
              }}
            >
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br ${
                  (planet.name === "Mars" && "from-red-600 to-red-800") ||
                  (planet.name === "Venus" &&
                    "from-yellow-200 to-yellow-400") ||
                  (planet.name === "Jupiter" &&
                    "from-orange-300 to-orange-500") ||
                  (planet.name === "Saturn" &&
                    "from-yellow-600 to-yellow-800") ||
                  "from-blue-500 to-blue-700"
                }`}
              />
              <Orbit className="absolute top-0 left-0 w-full h-full text-gray-500" />
            </motion.div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {planet.name}
                  </h2>
                  <p className="text-lg text-gray-300 flex items-center">
                    <Star className="w-5 h-5 mr-1" />
                    视星等: {planet.magnitude.toFixed(1)}
                  </p>
                </div>
                {onToggleFavorite && (
                  <Button
                    onClick={() => onToggleFavorite(planet.name)}
                    variant="ghost"
                    size="icon"
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    <Star size={24} fill={favorite ? "currentColor" : "none"} />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">升起</p>
                    <p className="text-white">{formatTime(planet.rise)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">落下</p>
                    <p className="text-white">{formatTime(planet.set)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">高度角</p>
                    <p className="text-white">{formatAngle(planet.altitude)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">方位角</p>
                    <p className="text-white">{formatAngle(planet.azimuth)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">
                <Star className="w-4 h-4 mr-1" />
                基本信息
              </TabsTrigger>
              <TabsTrigger value="position">
                <Navigation className="w-4 h-4 mr-1" />
                位置信息
              </TabsTrigger>
              <TabsTrigger value="observation">
                <Sunrise className="w-4 h-4 mr-1" />
                观测建议
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                className="transition-all duration-300"
              >
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="grid grid-cols-2 gap-4 pt-6">
                    <div className="space-y-1 flex items-center">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-sm text-gray-400">中天时间</p>
                        <p className="text-lg text-white">
                          {formatTime(planet.transit)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-center">
                      <Cloud className="w-5 h-5 text-blue-300" />
                      <div>
                        <p className="text-sm text-gray-400">距离</p>
                        <p className="text-lg text-white">
                          {planet.distance.toFixed(2)} AU
                        </p>
                      </div>
                    </div>
                    {planet.phase !== undefined && (
                      <div className="col-span-2 space-y-1 flex items-center">
                        <CircleDot className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">相位</p>
                          <p className="text-lg text-white">
                            {(planet.phase * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="position">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                className="transition-all duration-300"
              >
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="grid grid-cols-2 gap-4 pt-6">
                    <div className="space-y-1 flex items-center">
                      <Navigation className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">高度角</p>
                        <p className="text-lg text-white">
                          {formatAngle(planet.altitude)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-center">
                      <CircleDot className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">方位角</p>
                        <p className="text-lg text-white">
                          {formatAngle(planet.azimuth)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="observation">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate="visible"
                className="transition-all duration-300"
              >
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                        <Sunrise className="w-5 h-5 mr-1 text-yellow-400" />
                        最佳观测时间
                      </h3>
                      <p className="text-gray-300">
                        {formatTime(planet.rise)} - {formatTime(planet.transit)}
                        (达到最高点)
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                        <Thermometer className="w-5 h-5 mr-1 text-red-400" />
                        观测建议
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>当前高度角: {formatAngle(planet.altitude)}</li>
                        <li>视星等: {planet.magnitude.toFixed(1)}</li>
                        {planet.phase !== undefined && (
                          <li>当前相位: {(planet.phase * 100).toFixed(1)}%</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
}
