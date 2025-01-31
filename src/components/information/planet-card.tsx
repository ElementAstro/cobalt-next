"use client";

import { useState } from "react";
import { type PlanetData } from "@/types/infomation";
import {
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset,
  Star,
  Navigation,
  CircleDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const planetOrbitVariants = {
  animate: (index: number) => ({
    rotate: 360,
    transition: {
      duration: 20 + index * 5,
      repeat: Infinity,
      ease: "linear",
    },
  }),
};

interface PlanetCardProps {
  planet: PlanetData;
  onToggleFavorite?: (name: string) => void;
  onShowDetail?: (planet: PlanetData) => void;
  viewMode?: "grid" | "compact";
  favorite?: boolean;
}

export function PlanetCard({
  planet,
  onToggleFavorite,
  onShowDetail,
  viewMode = "grid",
  favorite = false,
}: PlanetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 根据高度角判断状态
  const getStatus = (altitude: number) => {
    if (altitude > 30) return "最佳观测";
    if (altitude > 15) return "可以观测";
    if (altitude > 0) return "接近地平";
    if (altitude > -6) return "即将升起";
    return "已经落下";
  };

  const getStatusColor = (altitude: number) => {
    if (altitude > 30) return "bg-green-500/20 text-green-500";
    if (altitude > 15) return "bg-blue-500/20 text-blue-500";
    if (altitude > 0) return "bg-yellow-500/20 text-yellow-500";
    if (altitude > -6) return "bg-orange-500/20 text-orange-500";
    return "bg-red-500/20 text-red-500";
  };

  // 格式化相位显示
  const formatPhase = (phase: number | undefined) => {
    if (typeof phase !== "number") return "";
    return `${(phase * 100).toFixed(1)}%`;
  };

  // 格式化距离显示
  const formatDistance = (distance: number) => {
    return `${distance.toFixed(2)} AU`;
  };

  return viewMode === "grid" ? (
    <motion.div
      layout
      className="relative p-3 rounded-lg bg-gray-900/50 transition-all duration-300 hover:bg-gray-800/50 flex flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          className="relative w-16 h-16 flex-shrink-0"
          whileHover={{ scale: 1.05, rotate: 360 }}
          transition={{ duration: 0.8 }}
          onClick={() => onShowDetail?.(planet)}
        >
          <div
            className={cn(
              "w-full h-full rounded-full cursor-pointer bg-gradient-to-br",
              planet.name === "Mars" && "from-red-600 to-red-800",
              planet.name === "Venus" && "from-yellow-200 to-yellow-400",
              planet.name === "Jupiter" && "from-orange-300 to-orange-500",
              planet.name === "Saturn" && "from-yellow-600 to-yellow-800",
              "from-blue-500 to-blue-700" // 默认
            )}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white truncate">
              {planet.name}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                planet.altitude
              )}`}
            >
              {getStatus(planet.altitude)}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center space-x-1">
              <Sunrise size={12} className="text-yellow-500 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate">
                {planet.rise}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Sunset size={12} className="text-blue-300 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate">
                {planet.set}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Navigation size={12} className="text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate">
                {planet.altitude.toFixed(1)}°
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <CircleDot size={12} className="text-purple-400 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate">
                {planet.magnitude.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-3 pt-3 border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <p>方位角: {planet.azimuth.toFixed(1)}°</p>
              <p>高度角: {planet.altitude.toFixed(1)}°</p>
              <p>视星等: {planet.magnitude.toFixed(1)}</p>
              <p>距离: {formatDistance(planet.distance)}</p>
              {planet.phase !== undefined && (
                <p className="col-span-2">相位: {formatPhase(planet.phase)}</p>
              )}
              <p className="col-span-2">中天时间: {planet.transit}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
        {onToggleFavorite && (
          <Button
            onClick={() => onToggleFavorite(planet.name)}
            variant="ghost"
            className="text-yellow-500 hover:text-yellow-600"
          >
            <Star size={20} fill={favorite ? "currentColor" : "none"} />
          </Button>
        )}
        {onShowDetail && (
          <Button
            onClick={() => onShowDetail(planet)}
            variant="link"
            className="text-blue-500 hover:text-blue-600"
          >
            详情
          </Button>
        )}
      </div>
    </motion.div>
  ) : (
    <motion.div
      layout
      className="flex items-center p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full mr-3",
          "bg-gradient-to-br",
          planet.name === "Mars" && "from-red-600 to-red-800",
          planet.name === "Venus" && "from-yellow-200 to-yellow-400",
          planet.name === "Jupiter" && "from-orange-300 to-orange-500",
          planet.name === "Saturn" && "from-yellow-600 to-yellow-800",
          "from-blue-500 to-blue-700" // 默认
        )}
      />

      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">{planet.name}</h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
              planet.altitude
            )}`}
          >
            {getStatus(planet.altitude)}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">
            {planet.rise} - {planet.set}
          </span>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(planet.name)}
              className="text-yellow-500"
            >
              <Star size={16} fill={favorite ? "currentColor" : "none"} />
            </Button>
          )}
          {onShowDetail && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShowDetail(planet)}
              className="text-blue-500"
            >
              详情
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
