import { useState, useEffect } from "react";
import { PlanetCard } from "./planet-card";
import { CreatePlanetForm } from "./create-planet-form";
import { PlanetDetail } from "./planet-detail";
import {
  Search,
  Filter,
  Sun,
  Moon,
  Plus,
  SortAsc,
  SortDesc,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Planet } from "@/types/skymap/planet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialPlanets: Planet[] = [
  {
    id: "1",
    name: "金星",
    riseTime: "10:04",
    setTime: "20:30",
    angle: -76.94,
    diameter: 19.52,
    brightness: -4.33,
    status: "即将升起",
    description: "金星是太阳系中最亮的行星,常被称为'晨星'或'昏星'。",
    favorite: false,
  },
  {
    id: "2",
    name: "火星",
    riseTime: "19:45",
    setTime: "09:47",
    angle: 77.64,
    diameter: 13.19,
    brightness: -0.88,
    status: "正在下落",
    description: "火星被称为'红色星球',因其表面富含氧化铁而呈现红色。",
    favorite: false,
  },
  {
    id: "3",
    name: "木星",
    riseTime: "16:07",
    setTime: "06:07",
    angle: 33.65,
    diameter: 47.9,
    brightness: -2.79,
    status: "正在下落",
    description: "木星是太阳系中最大的行星,以其巨大的红斑而闻名。",
    favorite: false,
  },
  {
    id: "4",
    name: "土星",
    riseTime: "11:32",
    setTime: "22:57",
    angle: -53.95,
    diameter: 16.88,
    brightness: 0.92,
    status: "即将升起",
    description: "土星以其独特的环系统而著称,是太阳系中最美丽的行星之一。",
    favorite: false,
  },
  {
    id: "5",
    name: "水星",
    riseTime: "05:21",
    setTime: "15:50",
    angle: -24.67,
    diameter: 7.84,
    brightness: -0.05,
    status: "即将升起",
    description: "水星是太阳系中最小的行星,也是最接近太阳的行星。",
    favorite: false,
  },
  {
    id: "6",
    name: "天王星",
    riseTime: "14:50",
    setTime: "04:30",
    angle: 13.81,
    diameter: 3.74,
    brightness: 5.63,
    status: "正在下落",
    description: "天王星是一颗冰巨星,以其独特的蓝绿色外观而闻名。",
    favorite: false,
  },
  {
    id: "7",
    name: "海王星",
    riseTime: "12:09",
    setTime: "00:01",
    angle: -40.91,
    diameter: 2.24,
    brightness: 7.88,
    status: "已经落下",
    description: "海王星是太阳系中最远的行星,以其深蓝色外观而著称。",
    favorite: false,
  },
];

export default function PlanetDashboard() {
  const [planets, setPlanets] = useState<Planet[]>(initialPlanets);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "brightness">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [advancedFilter, setAdvancedFilter] = useState({
    minBrightness: -5,
    maxBrightness: 8,
    minDiameter: 0,
    maxDiameter: 50,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const filteredPlanets = planets
    .filter(
      (planet) =>
        planet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus ? planet.status === filterStatus : true) &&
        (showFavoritesOnly ? planet.favorite : true)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc"
          ? a.brightness - b.brightness
          : b.brightness - a.brightness;
      }
    });

  const handleCreatePlanet = (data: {
    name: string;
    brightness: number;
    riseTime: string;
    setTime: string;
    diameter: number;
    description?: string;
  }) => {
    const newPlanet: Planet = {
      ...data,
      id: Date.now().toString(),
      angle: 0,
      status: "自定义",
      favorite: false,
      description: data.description || "",
    };
    setPlanets([...planets, newPlanet]);
  };

  const handleToggleFavorite = (id: string) => {
    setPlanets(
      planets.map((planet) =>
        planet.id === id ? { ...planet, favorite: !planet.favorite } : planet
      )
    );
  };

  const handleShowDetail = (planet: Planet) => {
    setSelectedPlanet(planet);
  };

  const toggleSort = (newSortBy: "name" | "brightness") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const toggleViewMode = () =>
    setViewMode((prev) => (prev === "grid" ? "compact" : "grid"));

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-950" : "bg-gray-100"
      } transition-colors duration-300 p-4 sm:p-6`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1
            className={`text-3xl sm:text-4xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4 sm:mb-0`}
          >
            行星仪表板
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="搜索行星..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`rounded-full ${
                isDarkMode
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-800 text-white"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button
              variant={filterStatus === null ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterStatus(null)}
              className="rounded-full"
            >
              全部
            </Button>
            <Button
              variant={filterStatus === "即将升起" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterStatus("即将升起")}
              className="rounded-full"
            >
              即将升起
            </Button>
            <Button
              variant={filterStatus === "正在下落" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterStatus("正在下落")}
              className="rounded-full"
            >
              正在下落
            </Button>
            <Button
              variant={filterStatus === "已经落下" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterStatus("已经落下")}
              className="rounded-full"
            >
              已经落下
            </Button>
            <Button
              variant={filterStatus === "自定义" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterStatus("自定义")}
              className="rounded-full"
            >
              自定义
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={isDarkMode ? "outline" : "secondary"}
              size="sm"
              onClick={() => toggleSort("name")}
              className="rounded-full flex items-center"
            >
              名称
              {sortBy === "name" &&
                (sortOrder === "asc" ? (
                  <SortAsc size={16} className="ml-1" />
                ) : (
                  <SortDesc size={16} className="ml-1" />
                ))}
            </Button>
            <Button
              variant={isDarkMode ? "outline" : "secondary"}
              size="sm"
              onClick={() => toggleSort("brightness")}
              className="rounded-full flex items-center"
            >
              亮度
              {sortBy === "brightness" &&
                (sortOrder === "asc" ? (
                  <SortAsc size={16} className="ml-1" />
                ) : (
                  <SortDesc size={16} className="ml-1" />
                ))}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center rounded-full ${
                showFavoritesOnly
                  ? "bg-yellow-500 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <Star
                size={16}
                className="mr-1"
                fill={showFavoritesOnly ? "currentColor" : "none"}
              />
              收藏
            </Button>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCreateFormOpen(true)}
            className={`flex items-center rounded-full ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Plus size={16} className="mr-2" />
            创建星球
          </Button>
        </div>
        <motion.div
          layout
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col space-y-2"
          }`}
        >
          <AnimatePresence>
            {filteredPlanets.map((planet) => (
              <PlanetCard
                key={planet.id}
                planet={planet}
                onToggleFavorite={handleToggleFavorite}
                onShowDetail={handleShowDetail}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {isCreateFormOpen && (
          <CreatePlanetForm
            onSubmit={handleCreatePlanet}
            onClose={() => setIsCreateFormOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetDetail
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
