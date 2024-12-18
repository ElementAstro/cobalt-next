import { useState } from "react";
import { type Planet } from "@/types/skymap/planet";
import { ChevronDown, ChevronUp, Sun, Moon, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PlanetCardProps {
  planet: Planet;
  onToggleFavorite: (id: string) => void;
  onShowDetail: (planet: Planet) => void;
  viewMode: 'grid' | 'compact';
}

export function PlanetCard({
  planet,
  onToggleFavorite,
  onShowDetail,
  viewMode,
}: PlanetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "即将升起":
        return "bg-blue-500/20 text-blue-500";
      case "正在下落":
        return "bg-orange-500/20 text-orange-500";
      case "已经落下":
        return "bg-red-500/20 text-red-500";
      case "自定义":
        return "bg-purple-500/20 text-purple-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return viewMode === 'grid' ? (
    <motion.div
      layout
      className="relative p-4 rounded-lg bg-gray-900/50 backdrop-blur transition-all duration-300 ease-in-out hover:bg-gray-800/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 landscape:flex-row">
        <motion.div
          className="relative w-16 h-16 sm:w-20 sm:h-20 landscape:w-24 landscape:h-24"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.8 }}
          onClick={() => onShowDetail(planet)}
        >
          <img
            alt={planet.name}
            src={`/placeholder.svg?height=80&width=80`}
            className="w-full h-full rounded-full cursor-pointer"
          />
        </motion.div>
        <div className="flex flex-col flex-1 landscape:flex-row landscape:items-center landscape:justify-between">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {planet.name}
          </h3>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 landscape:grid-cols-4">
            <div className="flex items-center">
              <Sun size={14} className="mr-1 text-yellow-500" />
              <span>{planet.riseTime}</span>
            </div>
            <div className="flex items-center">
              <Moon size={14} className="mr-1 text-blue-300" />
              <span>{planet.setTime}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs">角度: {planet.angle}°</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs">亮度: {planet.brightness}</span>
            </div>
          </div>
        </div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-gray-700 rounded-full p-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </motion.button>
      </div>
      <motion.div
        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
          planet.status
        )}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {planet.status}
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-4 text-sm text-gray-300"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>角度: {planet.angle}°</p>
            <p>直径: {planet.diameter}"</p>
            <p>亮度: {planet.brightness}</p>
            <p className="mt-2">{planet.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between w-full mt-4">
        <Button
          onClick={() => onToggleFavorite(planet.id)}
          variant="ghost"
          className="text-yellow-500 hover:text-yellow-600"
        >
          <Star size={20} fill={planet.favorite ? "currentColor" : "none"} />
        </Button>
        <Button
          onClick={() => onShowDetail(planet)}
          variant="link"
          className="text-blue-500 hover:text-blue-600"
        >
          详情
        </Button>
      </div>
    </motion.div>
  ) : (
    <motion.div
      layout
      className="flex items-center p-2 rounded-lg bg-gray-900/50 backdrop-blur hover:bg-gray-800/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={`/placeholder.svg?height=40&width=40`}
        alt={planet.name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">{planet.name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(planet.status)}`}>
            {planet.status}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">{planet.riseTime} - {planet.setTime}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(planet.id)}
            className="text-yellow-500"
          >
            <Star size={16} fill={planet.favorite ? "currentColor" : "none"} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowDetail(planet)}
            className="text-blue-500"
          >
            详情
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
